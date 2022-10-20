from django.shortcuts import render

# Create your views here.
def tetris(request):
    """ Страница тетриса """

    return render(request, 'game/tetris.html', {'title': 'Тетрис'})

def snake(request):
    """ Страница тетриса """

    return render(request, 'game/snake.html', {'title': 'Змейка'})