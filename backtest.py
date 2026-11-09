import pandas as pd
import numpy as np

df = pd.read_csv("relative_value_scan.csv", index_col="Date", parse_dates=True)

symbols = ["GOLD", "GOLDGUINEA", "GOLDM", "GOLDPETAL", "GOLDTEN"]
transaction_cost = 0.0005

all_results = []

for symbol in symbols:
    price_col = symbol
    flag_col = f"{symbol}_flag"

    sub = df[[price_col, flag_col]].copy()
    sub = sub.dropna()

    sub["signal"] = sub[flag_col].map({"CHEAP": 1, "EXPENSIVE": -1, "FAIR": 0})
    sub["signal_lagged"] = sub["signal"].shift(1).fillna(0)

    sub["price_return"] = sub[price_col].pct_change().fillna(0)

    sub["position_change"] = sub["signal_lagged"].diff().abs().fillna(0)
    sub["cost"] = sub["position_change"] * transaction_cost

    sub["strategy_return"] = sub["signal_lagged"] * sub["price_return"] - sub["cost"]

    sub["symbol"] = symbol
    all_results.append(sub[["symbol", "signal_lagged", "price_return", "strategy_return"]])

combined = pd.concat(all_results)

portfolio = combined.groupby(combined.index)["strategy_return"].mean()

cumulative_return = (1 + portfolio).cumprod() - 1
total_return_pct = cumulative_return.iloc[-1] * 100

daily_std = portfolio.std()
sharpe_ratio = (portfolio.mean() / daily_std) * np.sqrt(252) if daily_std > 0 else 0

win_rate = (portfolio > 0).sum() / (portfolio != 0).sum() * 100 if (portfolio != 0).sum() > 0 else 0

running_max = cumulative_return.cummax()
drawdown = cumulative_return - running_max
max_drawdown_pct = drawdown.min() * 100

print("Total Return: {:.2f}%".format(total_return_pct))
print("Sharpe Ratio: {:.2f}".format(sharpe_ratio))
print("Win Rate: {:.2f}%".format(win_rate))
print("Max Drawdown: {:.2f}%".format(max_drawdown_pct))
print("Trading Days:", len(portfolio))

result_df = pd.DataFrame({
    "daily_return": portfolio,
    "cumulative_return": cumulative_return
})
result_df.to_csv("backtest_results.csv")