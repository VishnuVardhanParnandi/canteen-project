from django.db import models

class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    college = models.CharField(max_length=150)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username


class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.IntegerField(default=0)
    college = models.CharField(max_length=150)  

    def __str__(self):
        return f"{self.name} ({self.college})"


class Order(models.Model):
    order_id = models.BigIntegerField(unique=True)
    user = models.CharField(max_length=100)
    items = models.JSONField()
    total = models.FloatField()
    status = models.CharField(max_length=20, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.order_id)


class Feedback(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    user = models.CharField(max_length=100)
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Order {self.order.order_id}"
