# Scorigami: NFL Unique Score Tracker

Live Project: https://aaravb23.github.io/Scorigami

Repository: https://github.com/AaravB23/Scorigami

## What it does
Scorigami is a web app that tracks every unique NFL final score, a concept popularized by Jon Bois.
It scrapes the latest game data from [Pro Football Reference](https://www.pro-football-reference.com/boxscores/game-scores.htm) 
using a Playwright + Python pipeline, processes and cleans the dataset, and visualizes the results in a React dashboard hosted on Vercel.

The app automatically updates a few times per week via GitHub Actions, so the dataset and charts are up-to-date.

## Features

- **Automated Web Scraper**  
  Uses [Playwright](https://playwright.dev/python/docs/intro) to scrape the live score table from Pro Football Reference.
  
- **Data Cleaning Pipeline**  
  Python scripts parse, normalize, and clean historical data into a structured format for database storage.

- **Cloud Database Upload**  
  Cleaned data is uploaded to **Google Firestore** via Firebase Admin SDK.

- **Continuous Updates via GitHub Actions**  
  Scheduled runs three times per week automatically refresh the data.

---

## Tech Stack

| Layer | Tools Used |
|-------|-------------|
| **Scraping** | Python, Playwright, pandas |
| **Data Cleaning** | pandas, regex |
| **Database** | Firebase Firestore |
| **Automation** | GitHub Actions |
| **Frontend (WIP)** | React, Node.js, Tailwind CSS |

