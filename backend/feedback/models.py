from django.db import models

class Feedback(models.Model):
    user_email = models.EmailField()
    item_name = models.CharField(max_length=100)
    rating = models.IntegerField()
