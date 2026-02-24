import joblib
from sklearn.ensemble import RandomForestRegressor
from ml.features import build_sales_dataframe


def train_sales_model():

    df = build_sales_dataframe()

    if df.empty:
        print("❌ Not enough order data")
        return

    X = df[["dow", "is_weekend", "lag1", "lag7"]]
    y = df["qty"]

    model = RandomForestRegressor(
        n_estimators=250,
        random_state=42
    )

    model.fit(X, y)

    joblib.dump(model, "ml/sales_model.pkl")
    print("✅ Model trained and saved")
