from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Order

@api_view(["POST"])
def place_order(request):
    data = request.data

    if not data.get("user") or not data.get("items"):
        return Response(
            {"error": "user and items are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    item_names = ", ".join(i.get("name", "") for i in data["items"])

    order = Order.objects.create(
        user_email=data["user"],
        item_name=item_names,
        status="Preparing",
        payment_status="SUCCESS"
    )

    # 🔴 CRITICAL FIX: convert ObjectId → string
    return Response(
        {"order_id": str(order.id)},
        status=status.HTTP_201_CREATED
    )
