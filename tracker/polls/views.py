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

class detailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'
    
    #def get_object(self):
    #    return Question.getFromDate(getDate(self.kwargs));

class resultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

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
        objs = Question.objects.order_by('?')
        if len(objs) == 0:
            return Question(title = "This is a bug.")
        return objs[0]

class SurveyDetail(generics.RetrieveAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer

class SurveyList(generics.ListCreateAPIView):
    
    serializer_class = SurveySerializer
    
    def get_queryset(self):
        return Survey.objects.all();
    

class ChoiceDetail(generics.RetrieveAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    
    def get_object(self):
        return Choice.objects.get(question=self.kwargs['pk'], pk=self.kwargs['pk2'])

class VoteDetail(generics.RetrieveUpdateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    
    def get_object(self):
        return Vote.objects.get(question=self.kwargs['pk'], choice=self.kwargs['pk2'], pk=self.kwargs['pk3'], profile=Profile.objects.get(user=self.request.user))

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
                                
'''def vote(request, question_id):
    p = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = p.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': p,
            'error_message': "You didn't select a choice.",
        })
    else:
        selected_choice.votes += 1
        selected_choice.save()
        return HttpResponseRedirect(reverse('results', args=(p.id,))) #ProfileDetail.get_object(self'''
