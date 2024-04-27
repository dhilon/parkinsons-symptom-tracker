from django.shortcuts import get_object_or_404, render

# Create your views here.

from django.http import HttpResponseRedirect
from django.http import Http404
from django.urls import reverse

from .models import Choice, Question, Profile
from django.views import generic
from rest_framework import generics


class indexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'latest_question_list'

    def get_queryset(self):
        """Return the last five published questions."""
        return Question.objects.order_by('-pub_date')[:5]

class detailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'

class resultsView(generic.DetailView):
    model = Question
    template_name = 'polls/results.html'

class ProfileDetail(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()

    def get_object(self):
        obj = Profile.objects.get(user=self.request.user)
        return obj
    

def vote(request, question_id):
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
        return HttpResponseRedirect(reverse('results', args=(p.id,)))
