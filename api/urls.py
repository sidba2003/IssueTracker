from django.urls import path
from .views import (
    IsAuthenticatedView,
    UserCreateListAPIView
)

urlpatterns = [
    path('is-authenticated/', IsAuthenticatedView.as_view()),
    path('signup/', UserCreateListAPIView.as_view())
]