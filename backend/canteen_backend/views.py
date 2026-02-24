from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import MenuItem, Order, Feedback


# ---------------- MENU ----------------
@api_view(["GET"])
def menu_list(request):
    items = MenuItem.objects.filter(available=True)
    return Response(list(items.values()), status=200)


# ---------------- ORDERS ----------------
@api_view(["GET", "POST"])
def orders(request):

    if request.method == "GET":
        return Response(list(Order.objects.all().values()), status=200)

    if request.method == "POST":
        user = request.data.get("user")
        items = request.data.get("items")
        amount = request.data.get("amount")

        if not user or not items or amount is None:
            return Response(
                {"error": "user, items and amount are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(
            user=user,
            items=items,
            amount=int(amount),
            payment_status="SUCCESS"
        )

        return Response(
            {"id": order.id, "status": order.status},
            status=status.HTTP_201_CREATED
        )


@api_view(["PUT"])
def update_order(request, id):
    try:
        order = Order.objects.get(id=id)
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    new_status = request.data.get("status")
    if new_status:
        order.status = new_status
        order.save()

    return Response({"status": order.status}, status=200)


# ---------------- FEEDBACK ----------------
@api_view(["POST"])
def submit_feedback(request):
    data = request.data

    if not all(k in data for k in ("user_email", "item_name", "rating")):
        return Response(
            {"error": "user_email, item_name and rating are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    Feedback.objects.create(
        user_email=data["user_email"],
        item_name=data["item_name"],
        rating=int(data["rating"])
    )

    return Response({"message": "Feedback submitted"}, status=201)
