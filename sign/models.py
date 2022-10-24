from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import User

class Users(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    phone = models.IntegerField()

class Order(models.Model):
    user_id = models.ForeignKey(Users, on_delete = models.CASCADE)
    theme = models.CharField(max_length=255)
    content = models.TextField()

class RecordTetris(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    record = models.IntegerField()