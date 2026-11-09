import pandas as pd
import json
import os

OUT_DIR = os.path.join("src", "data")

rv = pd.read_csv("relative_value_scan.csv", index_col="Date", parse_dates=True).tail(30)
symbols = ["GOLD", "GOLDGUINEA", "GOLDM", "GOLDPETAL", "GOLDTEN"]
rv_records = []
for date, row in rv.iterrows():
    rec = {"date": date.strftime("%Y-%m-%d")}
    for s in symbols:
        rec[s] = round(row[s], 2) if pd.notna(row[s]) else None
    rec["GOLDTEN_flag"] = row.get("GOLDTEN_flag", "FAIR")
    rv_records.append(rec)

with open(os.path.join(OUT_DIR, "relativeValue.json"), "w") as f:
    json.dump(rv_records, f, indent=2)

bt = pd.read_csv("backtest_results.csv", index_col=0, parse_dates=True)
cumulative = [
    {"date": d.strftime("%Y-%m-%d"), "value": round(v * 100, 2)}
    for d, v in bt["cumulative_return"].items()
]
backtest_json = {
    "totalReturnPct": round(bt["cumulative_return"].iloc[-1] * 100, 2),
    "sharpeRatio": None,
    "winRatePct": None,
    "maxDrawdownPct": None,
    "tradingDays": len(bt),
    "cumulativeCurve": cumulative
}
with open(os.path.join(OUT_DIR, "backtest.json"), "w") as f:
    json.dump(backtest_json, f, indent=2)

term = pd.read_csv("term_structure.csv")
term_avg = term.groupby("Symbol")["Annualized_Carry_Pct"].mean().reset_index()
term_records = [
    {"symbol": row["Symbol"], "annualizedCarryPct": round(row["Annualized_Carry_Pct"], 2)}
    for _, row in term_avg.iterrows()
]
with open(os.path.join(OUT_DIR, "termStructure.json"), "w") as f:
    json.dump(term_records, f, indent=2)

print("Exported relativeValue.json, backtest.json, termStructure.json to src/data/")
