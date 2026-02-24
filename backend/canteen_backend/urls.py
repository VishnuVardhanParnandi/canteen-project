from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("canteen.urls")),       # ✅ FIXES 404 ON /
    path("api/", include("canteen.urls")),
]
