from django.shortcuts import render, redirect
from django.http import HttpResponse
from sign.forms import *
from django.contrib.auth import logout
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.views.generic import CreateView
from django.urls import reverse_lazy


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

    return render(request, 'sign/profile.html', {'title': 'Профиль'})


@login_required
def secret_view(request):
    """ Страница доступная только авторизованным пользователям """

    return render(request, 'sign/profile.html', {'title': 'Профиль'})