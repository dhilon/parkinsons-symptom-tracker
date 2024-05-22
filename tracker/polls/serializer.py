from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Survey, Question, Profile, Choice, Vote


class UserSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff']


class SurveySerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    
    class Meta:
        model = Survey
        fields = ['name', 'questions']
    
    #def get_questions(self, obj):
    #    questions = Question.objects.filter(survey = obj)
    #    return Choice.objects.filter(question=questions)

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['question', 'choice_text', 'voteCount']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'