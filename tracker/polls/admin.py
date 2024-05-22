from django.contrib import admin

# Register your models here.

from .models import Question, Choice, Profile, Survey, Vote

admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Profile)
admin.site.register(Survey)
admin.site.register(Vote)
