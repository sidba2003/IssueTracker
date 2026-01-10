from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models


class NewUserManager(UserManager):
    def create_user(self,**user_data):
        """Create a new user profile"""
        if not user_data['email']:
            raise ValueError('User must have an email address')
        
        email = self.normalize_email(email=user_data['email']) 
        user = self.model(email=email, first_name=user_data['first_name'], last_name=user_data['last_name']) 
        user.set_password(user_data['password'])
        user.save(using=self.db)
        return user

    def create_superuser(self,**user_data):
        """Create a new user profile"""
        if not user_data['email']:
            raise ValueError('User must have an email address')
        
        email = self.normalize_email(email=user_data['email']) 
        user = self.model(email=email) 
        user.set_password(user_data['password'])
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self.db)
        return user


class Company(models.Model):
    name = models.CharField(null=True, max_length=25)


def create_user_company():
    company = Company()
    company.save()
    return company.id


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = None
    company = models.ForeignKey(Company, default=create_user_company, on_delete=models.CASCADE, related_name='users')
    company_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = NewUserManager()
