from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Order, MenuItem
from django.contrib.auth.models import User

@csrf_exempt
def orders_view(request):
    if request.method == "GET":
        user_id = request.GET.get("user_id")

        if user_id:
            orders = Order.objects.filter(user_id=user_id)
        else:
            orders = Order.objects.all()

        data = list(orders.values())
        return JsonResponse(data, safe=False)
