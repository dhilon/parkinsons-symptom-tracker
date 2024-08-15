from django.shortcuts import get_object_or_404, render

# Create your views here.

from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from .models import Choice, Question, Profile
from django.views import generic
from rest_framework import generics, permissions, viewsets
from django.contrib.auth.models import User
from polls.serializer import UserSerializer
from polls.permissions import IsOwnerOrReadOnly
from datetime import datetime
from django.contrib.auth import authenticate, login
from .serializer import *

def getDate(kwargs):
    if 'date' not in kwargs:
        date = datetime.now()
    else:
        date = kwargs['date']
    return date

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    
    
    
@csrf_exempt
def user_list(request):
    
    def perform_create(self, serializer):
        serializer.save(quiz=Question.getFromDate(getDate(self.kwargs)))
        
    if request.method == 'GET':
        snippets = User.objects.all()
        serializer = UserSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    

@csrf_exempt
def user_detail(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.update()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=204)
    
    
class indexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.all()

class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()

    def get_object(self):
        obj = Profile.objects.get(user=self.request.user)
        return obj

class ProfileList(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()

class QuestionDetail(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    
    def get_object(self):
        return Question.objects.get(pk=self.kwargs['pk'])

class SurveyDetail(generics.RetrieveAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    
    def get_object(self):
        return Survey.objects.get(pk=self.kwargs['pk'])
    

class SurveyDetailByName(generics.RetrieveAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    
    def get_object(self):
        return Survey.objects.get(name=self.kwargs['name'])

class SurveyList(generics.ListCreateAPIView):
    
    serializer_class = SurveySerializer
    
    def get_queryset(self):
        return Survey.objects.all();
    

class ChoiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    
    def get_object(self):
        return Choice.objects.get(question=self.kwargs['pk'], pk=self.kwargs['pk2'])

class ChoiceList(generics.ListCreateAPIView):
    
    serializer_class = ChoiceSerializer
    
    def get_queryset(self):
        return Choice.objects.all().filter(question=self.kwargs['pk']);
    
    '''def perform_create(self, serializer):
        choice_text = 'other: ' + self.request.data['choice_text']
        question = Question.objects.get(pk=self.kwargs['pk'])
        
        serializer.save(
            choice_text=choice_text,
            question=question,
            )'''

class VoteDetail(generics.RetrieveUpdateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
        
    def get_object(self):
        return Vote.objects.get(question=self.kwargs['pk'], choice=self.kwargs['pk2'], pk=self.kwargs['pk3'], profile=Profile.objects.get(user=self.request.user))

class ChoiceVoteList(generics.ListCreateAPIView):

    serializer_class = VoteSerializer
    
    def get_queryset(self):
        return Vote.objects.all().filter(question=self.kwargs['pk'], choice=self.kwargs['pk2'], profile=Profile.objects.get(user=self.request.user));
    
    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        choice = Choice.objects.get(pk=self.kwargs['pk2'])
        question = Question.objects.get(pk=self.kwargs['pk'])
        survey = question.survey
        
        serializer.save(
            profile=profile,
            choice=choice,
            question=question,
            survey=survey
            )

class QuestionVoteList(generics.ListCreateAPIView):

    serializer_class = VoteSerializer
    
    def get_queryset(self):
        return Vote.objects.all().filter(question=self.kwargs['pk'], profile=Profile.objects.get(user=self.request.user));
    
    def perform_create(self, serializer):
        profile = Profile.objects.get(user=self.request.user)
        question = Question.objects.get(pk=self.kwargs['pk'])
        t = self.request.data['type']
        if t == 'date':
            choice = Choice(date=datetime.strptime(self.request.data['date'], '%m/%d/%Y'), choice_text='date', question=question)
        elif t == 'time':
            choice = Choice(time=datetime.strptime(self.request.data['time'], '%H:%M'), choice_text='time', question=question)
        elif t == 'text':
            choice = Choice(other_text=self.request.data['other_text'], choice_text='other', question=question)
        choice.save()
        
        survey = question.survey
        
        serializer.save(
            profile=profile,
            choice=choice,
            question=question,
            survey=survey
            )

class ProfileDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    
    def get_object(self):
        objs = Profile.objects.order_by('?')
        if len(objs) == 0:
            error = {'message': "profile not found"}
            return serializers.ValidationError(error)
        return objs[0]

def entry(request):
    return HttpResponseRedirect(reverse('', args=()))
                                

