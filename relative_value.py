import pandas as pd

df = pd.read_csv("gold_normalized.csv")

df["Date"] = pd.to_datetime(df["Date"], format="%d %b %Y")

daily_avg = df.groupby(["Date", "Symbol"])["Normalized_Price_Per_Gram_999"].mean().reset_index()

pivot = daily_avg.pivot(index="Date", columns="Symbol", values="Normalized_Price_Per_Gram_999")

market_avg = pivot.mean(axis=1)

deviation = pivot.sub(market_avg, axis=0)
deviation_pct = deviation.div(market_avg, axis=0) * 100

threshold = 0.5

flags = deviation_pct.map(
    lambda x: "CHEAP" if x < -threshold else ("EXPENSIVE" if x > threshold else "FAIR")
)

result = deviation_pct.copy()
result.columns = [f"{col}_dev_pct" for col in result.columns]

flags.columns = [f"{col}_flag" for col in flags.columns]

final = pd.concat([pivot, result, flags], axis=1)
final.to_csv("relative_value_scan.csv")

print("Total dates analyzed:", len(final))
print(final.tail(10))