import pandas as pd

df = pd.read_csv("gold_normalized.csv")

df["Date"] = pd.to_datetime(df["Date"], format="%d %b %Y")
df["Expiry Date"] = pd.to_datetime(df["Expiry Date"], format="%d%b%Y", errors="coerce")

df = df.dropna(subset=["Expiry Date"])

results = []

for (date, symbol), group in df.groupby(["Date", "Symbol"]):
    group = group.sort_values("Expiry Date")
    if len(group) < 2:
        continue

    near = group.iloc[0]
    far = group.iloc[-1]

    near_price = near["Normalized_Price_Per_Gram_999"]
    far_price = far["Normalized_Price_Per_Gram_999"]
    days_diff = (far["Expiry Date"] - near["Expiry Date"]).days

    if near_price == 0 or days_diff == 0:
        continue

    carry_pct = ((far_price - near_price) / near_price) * 100
    annualized_carry_pct = carry_pct * (365 / days_diff)

    results.append({
        "Date": date,
        "Symbol": symbol,
        "Near_Expiry": near["Expiry Date"],
        "Far_Expiry": far["Expiry Date"],
        "Near_Price": near_price,
        "Far_Price": far_price,
        "Days_Diff": days_diff,
        "Carry_Pct": carry_pct,
        "Annualized_Carry_Pct": annualized_carry_pct,
        "Structure": "Contango" if far_price > near_price else "Backwardation"
    })

term_df = pd.DataFrame(results)
term_df.to_csv("term_structure.csv", index=False)

print("Total rows:", len(term_df))
print(term_df.groupby("Symbol")["Annualized_Carry_Pct"].mean())
print(term_df["Structure"].value_counts())
