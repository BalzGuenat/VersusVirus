import time

from flask import Flask, jsonify, request
from flask_cors import CORS
import scrape_gm as scraper
import os
import csv

app = Flask(__name__)
CORS(app)

@app.route('/api/place/<place_id>')
def place(place_id):
    data = scraper.run_scraper("https://goo.gl/maps/{}".format(place_id))
    data_points = parse_scraper_data(data)
    return jsonify(data_points)


@app.route('/api/cached/<place_id>')
def cached(place_id):
    data_points = read_scraper_data_file("scraped/{}.csv".format(place_id))
    return jsonify(data_points)


@app.route('/api/place')
def places():
    files = os.listdir('scraped')
    return jsonify([f[:-4] for f in files])


def get_hour_data_idx(day_data, hour):
    for i, d in enumerate(day_data):
        if d['hour_of_day'] == hour:
            return i
    return -1


days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
def find_recommended_time(data_points, preferred_time=None):
    if not preferred_time:
        preferred_time = time.localtime()
    day = days[preferred_time.tm_wday]
    day_data = data_points[day]
    hour_idx = get_hour_data_idx(day_data, preferred_time.tm_hour)
    if hour_idx == -1:
        return day_data[0] # go tomorrow

    if hour_idx + 1 < len(day_data) and \
          day_data[hour_idx]['popularity_normal'] > day_data[hour_idx + 1]['popularity_normal']:
        return time.localtime(time.mktime(preferred_time) + 3600)
    else:
        return preferred_time


def find_best_time(data_points, preferred_time=None):
    if not preferred_time:
        preferred_time = time.localtime()
    day = days[preferred_time.tm_wday]
    day_data = data_points[day]
    best_hour = -1
    best_hour_pop = 100
    for hour_data in day_data:
        if hour_data['popularity_normal'] < best_hour_pop:
            best_hour = hour_data['hour_of_day']
            best_hour_pop = hour_data['popularity_normal']
    return time.localtime(time.mktime(preferred_time) - 3600 * preferred_time.tm_hour + 3600 * best_hour)


@app.route('/api/recommend/<place_id>')
def recommend_time(place_id):
    data_points = read_scraper_data_file("scraped/{}.csv".format(place_id))
    preferred_time = request.args.get('t', None)
    if preferred_time:
        preferred_time = time.localtime(int(preferred_time))
    rec_time = find_recommended_time(data_points, preferred_time)
    best_time = find_best_time(data_points, preferred_time)
    return jsonify({
        "rec_time": rec_time,
        "best_time": best_time
    })


def parse_scraper_data(data):
    result = {}
    result['days'] = {}
    for entry in data:
        dp = {}
        dp['hour_of_day'] = entry[1]
        dp['popularity_normal'] = entry[2]
        if entry[3]:
            dp['popularity_current'] = entry[3]

        day = entry[0]
        if day not in result['days']:
            result['days'][day] = []
        result['days'][day].append(dp)
    return result


def read_scraper_data_file(path):
    with open(path, "r") as f:
        reader = csv.reader(f)
        data_points = {}
        it = iter(reader)
        next(it) # skip header row
        for entry in it:
            dp = {}
            dp['id'] = entry[0]
            dp['url'] = entry[1]
            dp['lat'] = entry[3]
            dp['lng'] = entry[4]
            dp['hour_of_day'] = int(entry[6] if entry[6] else 0)
            dp['popularity_normal'] = int(entry[7] if entry[7] else 0)
            if len(entry) > 8 and entry[8]:
                dp['popularity_current'] = int(entry[8])

            day = entry[5]
            if day not in data_points:
                data_points[day] = []
            data_points[day].append(dp)
        return data_points
