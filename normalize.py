import pandas as pd

df = pd.read_csv("gold_master_data.csv")

df["Option Type"] = df["Option Type"].astype(str).str.strip()
df = df[df["Option Type"] == "-"]

contract_specs = {
    "GOLD": {"quote_unit": 10, "purity": 995},
    "GOLDM": {"quote_unit": 10, "purity": 995},
    "GOLDGUINEA": {"quote_unit": 8, "purity": 999},
    "GOLDTEN": {"quote_unit": 10, "purity": 999},
    "GOLDPETAL": {"quote_unit": 1, "purity": 999},
}

def normalize_row(row):
    symbol = row["Symbol"]
    if symbol not in contract_specs:
        return None
    spec = contract_specs[symbol]
    price = row["Close"]
    if pd.isna(price) or price == 0:
        return None
    per_gram_price = price / spec["quote_unit"]
    normalized = per_gram_price * (999 / spec["purity"])
    return normalized

df["Normalized_Price_Per_Gram_999"] = df.apply(normalize_row, axis=1)

df_clean = df.dropna(subset=["Normalized_Price_Per_Gram_999"])

df_clean.to_csv("gold_normalized.csv", index=False)
print("Total normalized rows:", len(df_clean))

sample = df_clean[df_clean["Date"] == "01 Jun 2026"].groupby("Symbol")["Normalized_Price_Per_Gram_999"].mean()
print(sample)