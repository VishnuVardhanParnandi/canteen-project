import pandas as pd
from canteen.models import Order   # keep your fixed app name


def build_sales_dataframe():
    rows = []

    for order in Order.objects.all():

        # ✅ FIX — no timezone conversion
        order_date = order.created_at.date()

        for it in order.items:
            rows.append({
                "date": order_date,
                "item": it.get("name"),
                "qty": it.get("quantity", 0)
            })

    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows)

    daily = (
        df.groupby(["date", "item"])["qty"]
        .sum()
        .reset_index()
    )

    daily["date"] = pd.to_datetime(daily["date"])
    daily["dow"] = daily["date"].dt.dayofweek
    daily["is_weekend"] = daily["dow"].isin([5,6]).astype(int)

    daily["lag1"] = daily.groupby("item")["qty"].shift(1)
    daily["lag7"] = daily.groupby("item")["qty"].shift(7)

    daily = daily.fillna(0)

    return daily
