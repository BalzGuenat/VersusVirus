from django.db import models

# Create your models here.

class Opt_In_User(models.Model):
    user_id = models.IntegerField(max_length=7, primary_key=True)
    user_firstname = models.CharField(max_length=20)
    user_lastname = models.CharField(max_length=20)
    user_pwd = models.IntegerField(max_length=200)
    user_score_ = models.IntegerField(max_length=10)
    user_level = models.IntegerField(max_length=1)
    daily_limit = models.IntegerField(max_length=5)
    is_at_risk = models.BooleanField(max_length=1)
    cur_loc_lat = models.IntegerField(max_length=30)
    cur_loc_lon = models.IntegerField(max_length=30)
