import pandas as pd
import glob
import os

data_folder = "data"
all_files = glob.glob(os.path.join(data_folder, "bhavcopy_*.csv"))

gold_symbols = ["GOLD", "GOLDM", "GOLDGUINEA", "GOLDTEN", "GOLDPETAL"]

all_gold_data = []

for file in all_files:
    try:
        df = pd.read_csv(file)
        df.columns = df.columns.str.strip()
        df["Symbol"] = df["Symbol"].str.strip()
        gold_df = df[df["Symbol"].isin(gold_symbols)]
        if not gold_df.empty:
            all_gold_data.append(gold_df)
            print(file, "-", len(gold_df), "rows added")
        else:
            print(file, "- no gold data")
    except Exception as e:
        print(file, "error:", e)

final_df = pd.concat(all_gold_data, ignore_index=True)
final_df.to_csv("gold_master_data.csv", index=False)
print("Total rows in master file:", len(final_df))