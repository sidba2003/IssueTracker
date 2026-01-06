from django.urls import path
from .views import (
    IsAuthenticatedView,
    UserCreateListAPIView,
    UserInformationAPIView,
    UpdateCompanyNameAPIView
)

urlpatterns = [
    path('is-authenticated/', IsAuthenticatedView.as_view()),
    path('signup/', UserCreateListAPIView.as_view()),
    path('current-user-information/', UserInformationAPIView.as_view()),
    path('update-company-name/', UpdateCompanyNameAPIView.as_view()),
]