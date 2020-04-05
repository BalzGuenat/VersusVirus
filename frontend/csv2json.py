import csv
import json

hours = []
for hour in range(1, 24):
    with open('geoGridData/gridData_1_{}.csv'.format(hour), "r") as f:
        reader = csv.reader(f)
        it = iter(reader)
        next(it) # skip header row
        hourData = {"hour": hour, 'grid': []}
        for entry in it:
            dp = {}
            dp['lat'] = float(entry[0])
            dp['lng'] = float(entry[1])
            dp['pop'] = float(entry[2])
            hourData['grid'].append(dp)
        hours.append(hourData)

with open('gridData.json', 'w') as outfile:
    json.dump(hours, outfile, indent='  ')