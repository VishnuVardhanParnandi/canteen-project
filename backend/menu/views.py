from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MenuItem

@api_view(["GET"])
def menu_list(request):
    items = MenuItem.objects.filter(available=True)
    return Response([
        {"id": i.id, "name": i.name, "price": i.price}
        for i in items
    ])
