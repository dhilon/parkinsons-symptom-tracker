from django.urls import path

from . import views
from django.conf import settings

urlpatterns = [
    path('', views.indexView.as_view(), name='index'),
    path('<int:pk>/', views.detailView.as_view(), name='detail'),
    path('<int:pk>/results/', views.resultsView.as_view(), name='results'),
    path('questions/<int:pk>/choices/<int:pk2>/votes/<int:pk3>/', views.VoteDetail.as_view(), name='vote'), #need way to keep track of total votes for each option
    path('questions/<int:pk>/choices/<int:pk2>/votes/', views.VoteList.as_view()),
    path('surveys/<int:pk>/', views.SurveyDetail.as_view()),
    path('surveys/', views.SurveyList.as_view()),
    path('questions/<int:pk>/', views.QuestionDetail.as_view()),
    path('questions/<int:pk>/choices/<int:pk2>/', views.ChoiceDetail.as_view()),
    path('profiles/<int:pk>/', views.ProfileDetail.as_view()),
    path('profiles/', views.ProfileList.as_view())
    
]