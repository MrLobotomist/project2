# Generated by Django 4.1.2 on 2022-10-24 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sign', '0004_order'),
    ]

    operations = [
        migrations.CreateModel(
            name='RecordTetris',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('record', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sign.users')),
            ],
        ),
    ]
