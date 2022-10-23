import json
import re
from django.shortcuts import render, redirect
from django.http import JsonResponse
from sign.forms import *
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView
from django.urls import reverse_lazy
from sign.models import Order, Users
from django.core.mail import send_mail


# Create your views here.
def index (request):
    return render(request, 'sign/index.html', {'title': 'Главная страница'})

@login_required
def logout_view(request):
    """ Страница выхода """

    logout(request)

    return redirect('index')
    
class register_view(CreateView):
    """ Страница регистраций """
    form_class = UserRegistrationForm
    template_name = 'sign/register.html'
    success_url = reverse_lazy('login')

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title']='Регистрация'
        return dict(list(context.items()))

@login_required
def profile_view(request):
    """ Страница профиля """
    try:
        user = Users.objects.get(user_id=request.user.id)
        return render(request, 'sign/profile.html', {'title': 'Профиль', 'name': user.name, 'surname': user.surname, 'phone': user.phone})
    except:
        return render(request, 'sign/profile.html', {'title': 'Профиль'})
    

@login_required
def save_data(request):
    data = json.loads(request.body)
    print(data)
    phone = ''
    phone = (int)((phone.join(re.findall(r'\d*', data['2'])))[1:])
    try:
        Users.objects.filter(user_id=request.user.id).update(name=data['0'], surname=data['1'], phone=phone)
    except:
        Users.objects.create(name=data['0'], surname=data['1'], phone=phone, user_id=request.user.id)
    return JsonResponse({})

@login_required
def save_order(request):
    data = json.loads(request.body)
    user = Users.objects.get(user_id=request.user.id).id
    Order.objects.create(user_id_id=user, theme=data['0'], content=data['1'])
    send_mail(
        data['0'],
        data['1'],
        'aigames@list.ru',
        ['aigames@list.ru'],
        fail_silently=False,
    )
    return JsonResponse({})


@login_required
def secret_view(request):
    """ Страница доступная только авторизованным пользователям """

    return render(request, 'sign/profile.html', {'title': 'Профиль'})