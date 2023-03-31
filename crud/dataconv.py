
import csv
import json


def convertion():
    
    csv_file_path = 'D:/Entertainment/New folder/Kaar Tech/project/Angular/saleforecast/crud/download/predicted_data.csv'
    json_file_path = 'D:/Entertainment/New folder/Kaar Tech/project/Angular/saleforecast/src/assets/new.json'

    # Read the CSV file
    with open(csv_file_path, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        rows = list(reader)

    # Convert CSV data to JSON
    with open(json_file_path, 'w') as json_file:
        json.dump(rows, json_file)

    csv_file_path1 = 'D:/Entertainment/New folder/Kaar Tech/project/Angular/saleforecast/crud/download/grouped_data.csv'
    json_file_path1 = 'D:/Entertainment/New folder/Kaar Tech/project/Angular/saleforecast/src/assets/old.json'

    # Read the CSV file
    with open(csv_file_path1, 'r') as csv_file:
        reader = csv.DictReader(csv_file)
        rows = list(reader)

    # Convert CSV data to JSON
    with open(json_file_path1, 'w') as json_file:
        json.dump(rows, json_file)
