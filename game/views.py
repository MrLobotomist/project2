from django.shortcuts import render
from sign import models as m
from django.contrib.auth import models as auth

# Create your views here.
def tetris(request):
    """ Страница тетриса """
    records_table = m.RecordTetris.objects.all().order_by('record')[0:10]
    records = []
    count = 1
    for item in records_table:
        user = m.Users.objects.get(id = item.user_id).user_id
        nickname = auth.User.objects.get(id=user).username
        records.append({'nickname': nickname, 'record': item.record, 'count': count})
        count += 1
    if(request.user.is_authenticated):
        user_id = m.Users.objects.get(user_id=request.user.id).id
        try:
            record=m.RecordTetris.objects.get(user_id=user_id).record
        except:
            record = 0
        return render(request, 'game/tetris.html', {'title': 'Тетрис', 'record': record, 'records': records})
    else:
        return render(request, 'game/tetris.html', {'title': 'Тетрис', 'records': records})

def snake(request):
    """ Страница тетриса """

    return render(request, 'game/snake.html', {'title': 'Змейка'})