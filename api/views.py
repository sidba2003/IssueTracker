from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import generics
from .models import (
    CustomUser,
    Company
)
from .serializers import (
    UserListSerializer,
    UserCreateSerializer,
    UserInformationSerializer,
    EditCompanyNameSerializer,
    CompanyUsersSerializer
)
from .permissions import (
    IsCompanyAdmin
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
    permission_classes = [IsAuthenticated, IsCompanyAdmin]

    def put(self, request):
        serializer = EditCompanyNameSerializer(data=request.data)
        if serializer.is_valid():
            company_name = serializer.data.get("company_name")

            current_user_company = request.user.company
            current_user_company.name = company_name
            current_user_company.save()

            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_400_BAD_REQUEST)


class CompanyUserManagement(APIView):
    permission_classes = [IsAuthenticated, IsCompanyAdmin]
    
    def get(self, request, format=None):
        company_users = CustomUser.objects.filter(company=request.user.company).values()
        company_users = [u for u in company_users if u != request.user]
        serializer = CompanyUsersSerializer(company_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = CompanyUsersSerializer(data=request.data)

        if serializer.is_valid():
            first_name = serializer.validated_data["first_name"]
            last_name = serializer.validated_data["last_name"]
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]
            company = serializer.validated_data["company"]

            user = CustomUser(
                first_name=first_name,
                last_name=last_name,
                email=email,
                company=company
            )
            user.set_password(password)
            user.save()

            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
