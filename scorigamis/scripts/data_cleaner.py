# Finds today's data file from /public/raw_scori_data, cleans into usable format
# Should be run right after scraper.py.
import pandas as pd
import os
from datetime import datetime
import re

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
# Find csv address
script_dir = os.path.dirname(__file__)

# Removes unwanted characters and trims spacing.
def clean_text(s: str) -> str:
    if not isinstance(s, str):
        return s
    s = s.encode("ascii", "ignore").decode()  # remove non-ascii
    s = re.sub(r"[^\w\s\-']", "", s)  # keep letters, digits, space, -, '
    return s.strip()

# Find todays csv
today = datetime.now().strftime("%Y-%m-%d")
csv_name = f"scorigami_data_{today}.csv"

csv_path = os.path.join(script_dir, "..", "public", "raw_scori_data", csv_name) 

df = pd.read_csv(csv_path)
print(df.head())

# Scraping leaves multiple table headers, clean those out
df = df[df["Last Game"].notna()]  # Remove empty Last Game
df = df[df["Last Game"] != "Last Game"]  # Remove repeated header rows
df = df[df["Rk"] != "Rk"]  # Remove repeated header row from the first column
df.reset_index(drop=True, inplace=True)

# Create empty lists for splitting 'LastGame'
w_team, l_team, month, day, year = [], [], [], [], []

for x in df["Last Game"]:
    vs_index = x.find("vs.")
    w_team.append( x[0 : vs_index].strip() ) # Find winning team (the first one)
    
    date_index = None 
    found_month = None
    for m in months: # Find month
        i = x.find(m)
        if i != -1:
            date_index = i
            found_month = m
            break

    month.append(months.index(found_month) + 1)

    l_team.append( (x[vs_index + 3 : date_index]).strip() ) # Find losing team (second one)

    year.append(x[-4:]) # Find year

    day.append(x[date_index + len(found_month) : -5].strip()) # Find day

# Create new DF

new_df = df[["Score", "PtsW", "PtsL", "Count"]].copy()
new_df["W_Team"] = w_team
new_df["L_Team"] = l_team
new_df["Month"] = month
new_df["Day"] = day
new_df["Year"] = year

# Cleans the text in case it has unwanted characters
for col in new_df.columns:
    if new_df[col].dtype == "object":
        new_df[col] = new_df[col].astype(str).apply(lambda x: clean_text(x))

new_file_name = "cleaned_" + csv_name
new_csv_path = os.path.join(script_dir, "..", "public", new_file_name)

# Deletes any old cleaned csv files
public_path = os.path.join(script_dir, "..", "public")
for fname in os.listdir(public_path):
    if fname.startswith("cleaned_scorigami_data_"):
        os.remove(os.path.join(public_path, fname))

# Save cleaned CSV into public
new_df.to_csv(new_csv_path, index=False)
print("Cleaned CSV made.")