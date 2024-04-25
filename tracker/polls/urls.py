from django.urls import path

from . import views
from django.conf import settings

urlpatterns = [
    path('', views.indexView.as_view(), name='index'),
    path('<pk>/', views.detailView.as_view(), name='detail'),
    path('<pk>/results/', views.resultsView.as_view(), name='results'),
    path('<question_id>/vote/', views.vote, name='vote'),
]