from django.db import models

class Users(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    phone = models.IntegerField()