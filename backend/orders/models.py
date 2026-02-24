from django.db import models

class Order(models.Model):
    user_email = models.EmailField()
    item_name = models.TextField()
    status = models.CharField(max_length=20, default="Preparing")
    payment_status = models.CharField(max_length=20, default="SUCCESS")
