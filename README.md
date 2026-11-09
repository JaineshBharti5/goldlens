# GoldLens: MCX Gold Cross-Contract Relative Value Scanner

**Team 3 Musketeers, Hack in Hills '26**

MCX lists several gold futures (GOLD, GOLDM, GOLDGUINEA, GOLDTEN, GOLDPETAL) that all track the same metal but quote different lot sizes and purities. GoldLens converts them to one common basis, price per gram at 999 purity, then scans for relative mispricing, studies the futures curve, and backtests the signal.

## Pipeline

| Step | Script | What it does | Output |
|------|--------|--------------|--------|
| 1 | `scraper.py` | Selenium bot that downloads daily MCX Bhavcopy CSVs (1 Jun to 25 Sep 2026) | `data/bhavcopy_YYYYMMDD.csv` |
| 2 | `combine_gold.py` | Merges all daily files and keeps only the 5 gold symbols | `gold_master_data.csv` |
| 3 | `normalize.py` | Keeps futures rows (Option Type `-`) and converts Close to price per gram at 999 purity | `gold_normalized.csv` |
| 4 | `relative_value.py` | Compares each contract with the daily market average. Flags **CHEAP** (below -0.5%), **EXPENSIVE** (above +0.5%) or **FAIR** | `relative_value_scan.csv` |
| 5 | `term_structure.py` | Compares near and far expiry per contract to get carry and annualized carry (contango or backwardation) | `term_structure.csv` |
| 6 | `backtest.py` | Trades the CHEAP/EXPENSIVE flags with a 1-day lag and 0.05% transaction cost, equal-weighted across contracts | `backtest_results.csv` |

### Normalization

```
price_per_gram = Close / quote_unit
normalized     = price_per_gram * (999 / purity)
```

| Symbol | Quote unit (g) | Purity |
|--------|---------------|--------|
| GOLD | 10 | 995 |
| GOLDM | 10 | 995 |
| GOLDGUINEA | 8 | 999 |
| GOLDTEN | 10 | 999 |
| GOLDPETAL | 1 | 999 |

## Results (1 Jun to 25 Sep 2026, 61 trading days)

- **Term structure:** every contract was in contango on every date. Annualized carry fell from about 15% in June to about 5 to 12% by September.
- **Relative value:** GOLD was usually flagged EXPENSIVE and GOLDM/GOLDTEN CHEAP, but the gaps shrank sharply from mid-July.
- **Backtest:** total return **-2.63%**, Sharpe **-1.80**, win rate **42.11%**, max drawdown **-3.23%**.

The strategy did not make money in this window. The GOLD vs GOLDM gap is partly explained by the 995 vs 999 purity adjustment and different expiry cycles, so a persistent "cheap" flag is not automatically a trade. Short sample, daily Close prices only.

## Frontend dashboard

`goldlens-frontend/` is a React + Vite + Recharts site that visualizes the results (normalized prices, term structure, backtest curve).

```bash
cd goldlens-frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
```

To refresh the dashboard with new numbers, run this from the project root after the CSVs update:

```bash
cd goldlens-frontend
python export_data.py
```

## Run the whole pipeline

```bash
pip install pandas numpy selenium
python scraper.py          # needs Chrome + chromedriver (path is set inside the script)
python combine_gold.py
python normalize.py
python relative_value.py
python term_structure.py
python backtest.py
```

The scraper looks for `chromedriver.exe` under `C:\Users\hp\Downloads`. Change `search_pattern` in `scraper.py` for your machine. The raw data is already included in `data/`, so you can skip step 1.

## Repository layout

```
.
├── scraper.py
├── combine_gold.py
├── normalize.py
├── relative_value.py
├── term_structure.py
├── backtest.py
├── data/                    # raw daily Bhavcopy CSVs
├── gold_master_data.csv
├── gold_normalized.csv
├── relative_value_scan.csv
├── term_structure.csv
├── backtest_results.csv
└── goldlens-frontend/       # React dashboard
```

## Team

- Aman Kumar: strategy and backtesting
- R Vishal Karthik: research and docs
- Jainesh Bharti: frontend and backend

## Data source

[MCX India Bhavcopy](https://www.mcxindia.com/market-data/bhavcopy). Used for academic and hackathon purposes only. This is not investment advice.
