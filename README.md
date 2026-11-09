<div align="center">

# 🪙 GoldLens

### Cross-contract relative value scanner for MCX gold futures

*One metal. Five contracts. One common price basis.*

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![pandas](https://img.shields.io/badge/pandas-data%20pipeline-150458?logo=pandas&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Hackathon](https://img.shields.io/badge/Hack%20in%20Hills-'26-gold)


</div>

---

## Overview

MCX lists five gold futures: **GOLD, GOLDM, GOLDGUINEA, GOLDTEN, GOLDPETAL**. They all track the same metal, but each one has a different lot size (1 g, 8 g or 10 g) and purity (995 or 999). Raw prices look different, so they cannot be compared directly.

GoldLens fixes this:

1. **Scrapes** daily MCX Bhavcopy data.
2. **Normalizes** every contract to **price per gram at 999 purity**.
3. **Scans** for contracts that are cheap or expensive versus the market average.
4. **Analyses** the futures curve (contango / backwardation and annualized carry).
5. **Backtests** the signal with transaction costs.
6. **Visualizes** everything in an interactive React dashboard.

## Key findings

*Data: 1 Jun to 25 Sep 2026, 61 trading days, 5 contracts.*

| Finding | Result |
|---------|--------|
| Curve shape | **Contango on all 305 contract-day observations**, no backwardation |
| Average annualized carry | GOLDGUINEA 12.8%, GOLDPETAL 12.5%, GOLDTEN 11.2%, GOLDM 10.9%, GOLD 10.2% |
| Most "expensive" contract | **GOLD** was flagged EXPENSIVE on 48 of 61 days (average +1.56% above market average) |
| Most "cheap" contracts | **GOLDTEN** CHEAP on 50 days, **GOLDM** CHEAP on 43 days |
| Closest to fair | GOLDGUINEA and GOLDPETAL stayed within ±0.5% on 54 days |
| Backtest | Total return **-2.63%**, Sharpe **-1.80**, win rate **42.11%**, max drawdown **-3.23%** |

> **Honest takeaway:** the naive "buy cheap, sell expensive" signal did **not** make money in this window. Most of the persistent GOLD premium is explained by the 995 vs 999 purity adjustment and different expiry cycles, so a constant "expensive" flag is not automatically a trade. See [Limitations](#limitations).

## How it works

```
  MCX Bhavcopy website
          │  scraper.py            (Selenium, daily CSV download)
          ▼
   data/bhavcopy_*.csv
          │  combine_gold.py       (merge, keep 5 gold symbols)
          ▼
   gold_master_data.csv
          │  normalize.py          (per-gram, 999 purity)
          ▼
   gold_normalized.csv
      ┌───┴────────────┐
      ▼                ▼
 relative_value.py   term_structure.py
      │                │
      ▼                ▼
 relative_value_     term_structure.csv
 scan.csv
      │  backtest.py
      ▼
 backtest_results.csv ───►  goldlens-frontend  (React dashboard)
```

### Normalization

```
price_per_gram = Close / quote_unit
normalized     = price_per_gram × (999 / purity)
```

| Symbol | Quote unit | Purity |
|--------|-----------:|-------:|
| GOLD | 10 g | 995 |
| GOLDM | 10 g | 995 |
| GOLDGUINEA | 8 g | 999 |
| GOLDTEN | 10 g | 999 |
| GOLDPETAL | 1 g | 999 |

### Signal and backtest rules

- **Deviation** = (contract price − same-day average of all contracts) / average × 100
- **CHEAP** if deviation < −0.5%, **EXPENSIVE** if > +0.5%, otherwise **FAIR**
- **Long** CHEAP, **short** EXPENSIVE, flat on FAIR
- Signal is **lagged by 1 day** to avoid look-ahead bias
- **0.05% transaction cost** on every position change
- Equal-weighted across the five contracts

### Term structure

For each contract and date, the nearest and farthest expiry are compared:

```
carry %            = (far − near) / near × 100
annualized carry % = carry % × 365 / days between expiries
```

## Dashboard

The `goldlens-frontend/` folder holds a dark-gold, parallax React site (Vite + Recharts) with:

- Live normalized price comparison across contracts
- Term structure / annualized carry chart
- Backtest equity curve and metrics

<!-- Add a screenshot: save it as docs/dashboard.png and uncomment the line below -->
<!-- ![GoldLens dashboard](docs/dashboard.png) -->

## Getting started

### 1. Run the data pipeline

```bash
pip install pandas numpy selenium

python scraper.py          # optional: raw data is already in data/
python combine_gold.py
python normalize.py
python relative_value.py
python term_structure.py
python backtest.py
```

> `scraper.py` needs Google Chrome and `chromedriver`. It looks for `chromedriver.exe` under `C:\Users\hp\Downloads`. Edit `search_pattern` at the top of the script for your machine.

### 2. Run the dashboard

```bash
cd goldlens-frontend
npm install
npm run dev          # opens http://localhost:5173
```

To load your latest results into the dashboard:

```bash
cd goldlens-frontend
python export_data.py
```

Build a static site for deployment (Vercel, Netlify, GitHub Pages):

```bash
npm run build        # output in dist/
```

## Project structure

```
goldlens/
├── scraper.py                # Selenium Bhavcopy downloader
├── combine_gold.py           # merge daily files, filter gold symbols
├── normalize.py              # per-gram, 999-purity normalization
├── relative_value.py         # cheap / fair / expensive flags
├── term_structure.py         # carry and contango analysis
├── backtest.py               # cost-adjusted signal backtest
├── data/                     # raw daily Bhavcopy CSVs
├── gold_master_data.csv      # merged gold rows
├── gold_normalized.csv       # normalized prices
├── relative_value_scan.csv   # deviation and flags per day
├── term_structure.csv        # carry per contract per day
├── backtest_results.csv      # daily and cumulative returns
└── goldlens-frontend/        # React + Vite dashboard
```

## Limitations

- **Short sample:** 61 trading days (Jun to Sep 2026), so results are indicative, not conclusive.
- **Daily Close only:** no intraday data, bid/ask spreads or liquidity filters.
- **Contract differences are not fully modelled:** expiry cycles, lot sizes and margin differ between contracts, so some "mispricing" is structural.
- **Simple benchmark:** the market average is an equal-weight mean of five correlated contracts.
- **Gaps in dates:** some days in the dataset are missing because the scraper hit non-trading days or site errors.

## Roadmap

- [ ] Liquidity and roll-window filters (volume / open interest)
- [ ] Strip out gold's own price trend before scoring a spread
- [ ] Walk-forward backtest with parameter tuning
- [ ] Longer history and intraday data
- [ ] Spot / Due Date Rate (DDR) comparison

## Team

| Name | Role |
|------|------|
| **Aman Kumar** | Strategy and backtesting |
| **R Vishal Karthik** | Research and documentation |
| **Jainesh Bharti** | Frontend and backend |

## Data source and disclaimer

Data: [MCX India Bhavcopy](https://www.mcxindia.com/market-data/bhavcopy), used for academic and hackathon purposes.
This project is for education only and is **not investment advice**.
