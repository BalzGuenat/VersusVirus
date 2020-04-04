from django.utils import path
from . import views

urlpatterns = [path('', views.index, name='index'),]