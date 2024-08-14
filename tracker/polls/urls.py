from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.indexView.as_view(), name='index'),
    path('questions/<int:pk>/choices/<int:pk2>/votes/<int:pk3>/', views.VoteDetail.as_view(), name='vote'),
    path('questions/<int:pk>/choices/<int:pk2>/votes/', views.ChoiceVoteList.as_view()),
    path('questions/<int:pk>/votes/', views.QuestionVoteList.as_view()),
    path('surveys/<int:pk>/', views.SurveyDetail.as_view()),
    path('surveys/by_name/<str:name>', views.SurveyDetailByName.as_view()),
    path('surveys/', views.SurveyList.as_view()),
    path('questions/<int:pk>/', views.QuestionDetail.as_view()),
    path('questions/<int:pk>/choices/<int:pk2>/', views.ChoiceDetail.as_view()),
    path('questions/<int:pk>/choices/', views.ChoiceList.as_view()),
    path('profiles/<int:pk>/', views.ProfileDetail.as_view()), #how to print all data ever from a certain user
    path('profiles/', views.ProfileList.as_view())
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)