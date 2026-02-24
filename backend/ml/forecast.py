import joblib
import pandas as pd
from datetime import datetime
from pathlib import Path
from collections import defaultdict

from canteen.models import Order   # ← your real app name


MODEL_PATH = Path("ml/sales_model.pkl")
MODEL = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None


def get_item_lag_features():
    """
    Build last-day and last-7-day sales per item
    from your Order JSON items field
    """

    rows = []

    for o in Order.objects.all():
        d = o.created_at.date()
        for it in o.items:
            rows.append((d, it.get("name"), it.get("quantity", 0)))

    if not rows:
        return {}

    df = pd.DataFrame(rows, columns=["date", "item", "qty"])

    daily = (
        df.groupby(["date","item"])["qty"]
        .sum()
        .reset_index()
        .sort_values("date")
    )

    result = {}

    for item, g in daily.groupby("item"):
        result[item] = {
            "lag1": g["qty"].iloc[-1],
            "lag7": g["qty"].tail(7).sum()
        }

    return result


def predict_all_items():
    if MODEL is None:
        return {}

    lag_map = get_item_lag_features()
    today = datetime.today()
    dow = today.weekday()

    preds = {}

    for item, feats in lag_map.items():

        X = pd.DataFrame([{
            "dow": dow,
            "is_weekend": int(dow >= 5),
            "lag1": feats["lag1"],
            "lag7": feats["lag7"]
        }])

        qty = MODEL.predict(X)[0]
        preds[item] = max(0, round(qty))

    return preds

def predict_next_day(last_qty, last7_qty):
    today = datetime.today()
    dow = today.weekday()

    X = pd.DataFrame([{
        "dow": dow,
        "is_weekend": int(dow >= 5),
        "lag1": last_qty,
        "lag7": last7_qty
    }])

    qty = MODEL.predict(X)[0]
    return max(0, round(qty))
