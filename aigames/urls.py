"""aigames URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from sign.views import *
from game.views import *

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('tetris/', tetris, name='tetris'),
    path('snake/', snake, name='snake'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view.as_view(), name ='register'),
    path('profile/', profile_view, name='profile'),
    path('secret/', secret_view, name='secret'),
    path('save_data/', save_data, name='save'),
    path('save_order/', save_order, name='save_order'),
]