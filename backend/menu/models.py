from django.db import models

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price}"
