from rest_framework import serializers
from .models import (
    CustomUser,
    Company
)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'name'
        ]


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'company'
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'company_admin'
        ]

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'id',
            'name'
        ]


class UserInformationSerializer(serializers.ModelSerializer):
    company = CompanySerializer()

    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'company',
            'password',
            'company_admin'
        ]


class EditCompanyNameSerializer(serializers.Serializer):
    company_name = serializers.CharField()


class CompanyUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'company'
        ]
