from django.urls import path
from .views import *

urlpatterns = [
    path("", home),

    path("api/menu/", get_menu),
    path("api/register/", register_user),
    path("api/login/", login_user),
    path("menu/", menu_list),
    path("colleges/", college_list),
    path("orders/create/", create_order),
    path("orders/", get_orders),
    path("orders/<int:order_id>/status/", update_order_status),
    path("api/forecast/", forecast_sales),
    path("forecast-items/", forecast_items_page),
    path("feedback/submit/", submit_feedback),
    path("api/forecast-items/", forecast_items_api),
    path("feedback/all/", get_feedbacks),
]
