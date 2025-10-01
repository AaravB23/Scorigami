import pandas as pd
import os

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
# Find csv address
script_dir = os.path.dirname(__file__)
csv_path = os.path.join(script_dir, "..", "public", "nfl_scores.csv") 

df = pd.read_csv(csv_path)

# Create empty lists for splitting 'LastGame'
w_team = []
l_team = []
month = []
day = []
year = []

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

new_df = df[["Score", "PtsW", "PtsL"]].copy()
new_df["W_Team"] = w_team
new_df["L_Team"] = l_team
new_df["Month"] = month
new_df["Day"] = day
new_df["Year"] = year

new_csv_path = os.path.join(script_dir, "..", "public", "nfl_scores_cleaned.csv")

# Save cleaned CSV into public
new_df.to_csv(new_csv_path, index=False)