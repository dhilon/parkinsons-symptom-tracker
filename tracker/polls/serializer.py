from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Survey, Question, Profile, Choice, Vote


class UserSerializer(serializers.HyperlinkedModelSerializer):
    
    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff', 'password']


class SurveySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Survey
        fields = ['id', 'name', 'questions']
        
class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'question', 'choice_text', 'other_text', 'date', 'voteCount']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    
    question = QuestionSerializer(read_only=True)
    choice = ChoiceSerializer(read_only=True)
    
    class Meta:
        model = Vote
        fields = ['id', 'question', 'survey', 'profile', 'choice', 'created_at']
        
    def to_internal_value(self, data):
        return {'choice': data.get('choice')}
    
    def create(self, validated_data):
        return Vote.objects.create(**validated_data)

class ProfileSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Profile
        fields = ['user', 'created', 'votes']


