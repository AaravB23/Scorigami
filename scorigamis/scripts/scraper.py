# Scrapes the CSV table from https://www.pro-football-reference.com/boxscores/game-scores.htm
# Saves into ../public

from playwright.sync_api import sync_playwright
import pandas as pd
from datetime import datetime
import os
from io import StringIO

url = "https://www.pro-football-reference.com/boxscores/game-scores.htm"

# Get HTML from the website
with sync_playwright() as p:
    print("Launching browser...")
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("Launching page...")
    for i in range(3):
        try:
            print(f"Attempt {i + 1} to load page...")
            page.goto(url, timeout=180000, wait_until="networkidle")
            
            # Wait for the specific element to be ready
            page.wait_for_selector("#games")
            
            print("Page loaded successfully.")
            break # If successful, exit the loop
            
        except Exception as e:
            print(f"Attempt {i + 1} failed: {e}")
            if i == 2: # If this was the last attempt
                print("All 3 attempts failed.")
                raise # Re-raise the error to stop the script

    print("Extracting HTML...")
    html = page.locator("#games").inner_html()
    browser.close()

# Parse HTML as pd df
df_list = pd.read_html(StringIO(f"<table>{html}</table>"))
df = df_list[0]

# Name file based on date
today = datetime.now().strftime("%Y-%m-%d")
filename = f"scorigami_data_{today}.csv"

# Find /public/raw_scori_data folder
output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "raw_scori_data")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, filename)

# Save df as CSV
df.to_csv(output_path, index=False)
print(f"Data saved to public folder.")