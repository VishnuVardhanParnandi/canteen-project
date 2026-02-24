from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Avg
from .serializers import MenuItemSerializer
from .models import MenuItem, Order, Feedback, User
import time
from collections import defaultdict


def home(request):
    return JsonResponse({"status": "Canteen Backend Running"})


# -------------------------
# MENU (college-aware)
# -------------------------
@api_view(["GET"])
def get_menu(request):
    college = request.GET.get("college")

    if college:
        menu_items = MenuItem.objects.filter(college=college)
    else:
        menu_items = MenuItem.objects.all()  # admin usage

    sold_counter = defaultdict(int)
    orders = Order.objects.all()

    for o in orders:
        for item in o.items:
            sold_counter[item["id"]] += item.get("quantity", 1)

    rating_map = {}
    feedbacks = Feedback.objects.select_related("order")

    for fb in feedbacks:
        for item in fb.order.items:
            rating_map.setdefault(item["id"], []).append(fb.rating)

    result = []

    for m in menu_items:
        ratings = rating_map.get(m.id, [])
        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else 0

        result.append({
            "id": m.id,
            "name": m.name,
            "price": m.price,
            "stock": m.stock,
            "college": m.college,
            "avg_rating": avg_rating,
            "sold": sold_counter.get(m.id, 0)
        })

    result.sort(key=lambda x: (x["avg_rating"], x["sold"]), reverse=True)

    return Response(result)


# -------------------------
# CREATE ORDER
# -------------------------
@api_view(["POST"])
def create_order(request):
    data = request.data
    items = data["items"]

    for i in items:
        menu_item = MenuItem.objects.get(id=i["id"])
        if menu_item.stock < i["quantity"]:
            return Response({"error": f"{menu_item.name} out of stock"}, status=400)

    for i in items:
        menu_item = MenuItem.objects.get(id=i["id"])
        menu_item.stock -= i["quantity"]
        menu_item.save()

    order = Order.objects.create(
        order_id=int(time.time() * 1000),
        user=data["user"],
        items=items,
        total=data["total"],
        status="Pending"
    )

    return Response({"success": True, "order_id": order.order_id})


# -------------------------
# GET ORDERS
# -------------------------
@api_view(["GET"])
def get_orders(request):
    user = request.GET.get("user")

    if user:
        orders = Order.objects.filter(user=user).order_by("-id")
    else:
        orders = Order.objects.all().order_by("-id")

    data = []
    for o in orders:
        has_feedback = Feedback.objects.filter(order=o).exists()

        data.append({
            "order_id": o.order_id,
            "user": o.user,
            "items": o.items,
            "total": o.total,
            "status": o.status,
            "created_at": o.created_at,
            "has_feedback": has_feedback
        })

    return Response(data)


# -------------------------
# UPDATE STATUS
# -------------------------
@api_view(["PATCH"])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(order_id=order_id)

        if order.status == "Completed":
            return Response({"error": "Order already completed"}, status=400)

        order.status = request.data.get("status")
        order.save()

        return Response({"success": True, "status": order.status})

    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)


# -------------------------
# FEEDBACK
# -------------------------
@api_view(["POST"])
def submit_feedback(request):
    order_id = request.data.get("order_id")
    user = request.data.get("user")
    rating = request.data.get("rating")
    comment = request.data.get("comment", "")

    try:
        order = Order.objects.get(order_id=order_id, status="Completed")
    except Order.DoesNotExist:
        return Response({"error": "Order not completed or not found"}, status=400)

    if Feedback.objects.filter(order=order).exists():
        return Response({"error": "Feedback already submitted"}, status=400)

    Feedback.objects.create(order=order, user=user, rating=rating, comment=comment)
    return Response({"success": True})


@api_view(["GET"])
def get_feedbacks(request):
    feedbacks = Feedback.objects.select_related("order").order_by("-created_at")

    data = []
    for f in feedbacks:
        data.append({
            "id": f.id,
            "order_id": f.order.order_id,
            "user": f.user,
            "rating": f.rating,
            "comment": f.comment,
            "created_at": f.created_at
        })

    return Response(data)


# -------------------------
# REGISTER
# -------------------------
@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    college = request.data.get("college")
    password = request.data.get("password")

    if not all([username, email, college, password]):
        return Response({"error": "All fields required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=400)

    User.objects.create(
        username=username,
        email=email,
        college=college,
        password=password
    )

    return Response({"success": True})


# -------------------------
# LOGIN (returns college)
# -------------------------
@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        user = User.objects.get(username=username, password=password)
        return Response({
            "success": True,
            "username": user.username,
            "college": user.college
        })
    except User.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=401)

@api_view(["GET"])
def menu_list(request):
    college = request.GET.get("college")

    if college:
        items = MenuItem.objects.filter(college__iexact=college)
    else:
        items = MenuItem.objects.all()

    serializer = MenuItemSerializer(items, many=True)
    return Response(serializer.data)

# Get all registered colleges
@api_view(["GET"])
def college_list(request):
    colleges = (
        MenuItem.objects
        .values_list("college", flat=True)
        .distinct()
    )
    return Response(colleges)

# ===== ML FORECAST API (ADDED — NON BREAKING) =====

from ml.forecast import predict_next_day


def forecast_sales(request):
    try:
        last = int(request.GET.get("last", 5))
        last7 = int(request.GET.get("last7", 20))
    except ValueError:
        return JsonResponse({"error": "Invalid inputs"}, status=400)

    qty = predict_next_day(last, last7)

    return JsonResponse({
        "predicted_qty": qty
    })

from django.shortcuts import render
from ml.forecast import predict_all_items


def forecast_items_page(request):

    preds = predict_all_items()

    # convert to sorted list
    rows = sorted(preds.items(), key=lambda x: x[1], reverse=True)

    return render(request, "forecast_items.html", {
        "rows": rows
    })
def forecast_items_api(request):
    preds = predict_all_items()
    return JsonResponse(preds)


