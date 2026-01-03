from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import generics
from .models import (
    CustomUser
)
from .serializers import (
    UserListSerializer,
    UserCreateSerializer,
    UserInformationSerializer
)


class IsAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response(status=status.HTTP_200_OK)


class UserCreateListAPIView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()

    list_serializer_class = UserListSerializer
    create_serializer_class = UserCreateSerializer

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'GET':
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return self.list_serializer_class
        return self.create_serializer_class


class UserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = UserInformationSerializer(request.user)
        return Response(serializer.data)
