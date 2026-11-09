# GoldLens Frontend (Vite + React)

A scrollable, parallax/3D landing dashboard for the MCX cross-contract gold arbitrage project.

## Setup

1. Copy this whole `goldlens-frontend` folder next to your Python scripts (`relative_value.py`, `backtest.py`, `term_structure.py`).
2. Install Node.js dependencies:
   ```
   cd goldlens-frontend
   npm install
   ```
3. (Optional, to use your real numbers instead of the sample data) copy `export_data.py` into your main project folder (where `relative_value_scan.csv`, `backtest_results.csv`, `term_structure.csv` live) and run:
   ```
   python export_data.py
   ```
   This overwrites `src/data/*.json` with your real results. Re-run it any time your CSVs update.
4. Start the dev server:
   ```
   npm run dev
   ```
   Open the printed `http://localhost:5173` link in your browser.

## What's inside
- `src/App.jsx` — all sections: hero, problem, live normalized-price chart, term structure chart, backtest metrics.
- `src/App.css` — dark gold theme, parallax mountain background, 3D tilt hero, scroll-reveal cards.
- `src/data/*.json` — sample data out of the box; replace via `export_data.py` for real numbers.

## Build for submission
```
npm run build
```
This creates a `dist/` folder with a static site you can zip and submit, or deploy anywhere (Vercel/Netlify/GitHub Pages).
