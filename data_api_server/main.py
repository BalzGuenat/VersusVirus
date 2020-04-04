from flask import Flask, jsonify
import scrape_gm as scraper
import os
import csv

app = Flask(__name__)

@app.route('/api/place/<place_id>')
def place(place_id):
    data = scraper.run_scraper("https://goo.gl/maps/{}".format(place_id))
    data_points = parse_scraper_data(data)
    return jsonify(data_points)

@app.route('/api/cached/<place_id>')
def cached(place_id):
    data_points = read_scraper_data_file("scraped/{}.csv".format(place_id))
    return jsonify(data_points)

def parse_scraper_data(data):
    data_points = {}
    for entry in data:
        dp = {}
        dp['hour_of_day'] = entry[1]
        dp['popularity_normal'] = entry[2]
        if entry[3]:
            dp['popularity_current'] = entry[3]

        day = entry[0]
        if day not in data_points:
            data_points[day] = []
        data_points[day].append(dp)
    return data_points

def read_scraper_data_file(path):
    with open(path, "r") as f:
        reader = csv.reader(f)
        data_points = {}
        it = iter(reader)
        next(it) # skip header row
        for entry in it:
            dp = {}
            dp['url'] = entry[1]
            dp['hour_of_day'] = int(entry[4] if entry[4] else 0)
            dp['popularity_normal'] = int(entry[5] if entry[5] else 0)
            if len(entry) > 6 and entry[6]:
                dp['popularity_current'] = int(entry[6])

            day = entry[3]
            if day not in data_points:
                data_points[day] = []
            data_points[day].append(dp)
        return data_points
