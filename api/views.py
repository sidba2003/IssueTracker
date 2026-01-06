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
    UserInformationSerializer,
    EditCompanyNameSerializer
)
from .permissions import (
    IsAllowedToChangeCompanyName
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


class UpdateCompanyNameAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAllowedToChangeCompanyName]

    def put(self, request):
        serializer = EditCompanyNameSerializer(data=request.data)
        if serializer.is_valid():
            company_name = serializer.data.get("company_name")

            current_user_company = request.user.company
            current_user_company.name = company_name
            current_user_company.save()

            print("NAme is >>>", company_name)

            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)