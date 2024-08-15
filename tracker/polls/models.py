from django.db import models

from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def post_user_create(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        Profile.objects.create(user=instance)

class Survey(models.Model):
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name
    
    def questionCount(self):
        return Question.objects.filter(survey = self).count()


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    survey = models.ForeignKey(Survey, related_name='questions', on_delete=models.CASCADE)
    
    class QuestionType(models.TextChoices):
        MC = "MC", ("Multiple Choice")
        SINGLE_CHOICE = "SC", ("Single Choice")
        SHORT_ANSWER = "SA", ("Short Answer")
        DATE = "DT", ("Date")
        TIME = "TM", ("Time")

    q_type = models.CharField(
        max_length=2,
        choices=QuestionType,
        default=QuestionType.MC,
    )
    
    def __str__(self):
        return self.question_text
    
    search_fields = ['question_text']

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE, primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.get_username()

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    other_text = models.CharField(max_length=200, blank=True)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    #votes = models.IntegerField(default=0)
    def __str__(self):              # __unicode__ on Python 2
        return self.choice_text
    
    def voteCount(self):
        return Vote.objects.filter(choice = self).count()

class Vote(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    question = models.ForeignKey(Question, related_name='votes', on_delete=models.CASCADE)
    survey = models.ForeignKey(Survey, related_name='votes', on_delete=models.CASCADE, default=None)
    profile = models.ForeignKey(Profile, related_name='votes', on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, related_name='votes', on_delete=models.CASCADE)