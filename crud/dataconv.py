import csv
import json

csv_file_path = '/assets/sample.csv'
json_file_path = '/assets/new.json'

# Read the CSV file
with open(csv_file_path, 'r') as csv_file:
    reader = csv.DictReader(csv_file)
    rows = list(reader)

# Convert CSV data to JSON
with open(json_file_path, 'w') as json_file:
    json.dump(rows, json_file)
