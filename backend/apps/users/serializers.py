from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from .models import User
from django.utils.encoding import force_bytes, force_text
from rest_framework.exceptions import AuthenticationFailed

import datetime
import calendar
import random
from random import seed
from random import randint
import hashlib



class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email']
        read_only_fields = ['id']


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        # hei
        
        data = super().validate(attrs)

        data['user'] = UserSerializer(self.user).data
        
        if User.objects.get(username = self.user).mfa_active == False:
            refresh = self.get_token(self.user)
            data['refresh'] = str(refresh)
            data['access'] = str(refresh.access_token)
        else:
            data['refresh'] = None
            data['access'] = None
        
        data['mfa_verified'] = User.objects.get(username = self.user).mfa_active
       
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

    def credentials(self, attrs):
        data = super().credentials(attrs)

        data['user'] = UserSerializer(self.user).data.username
        return data

class RegisterSerializer(UserSerializer):
    password = serializers.CharField(
        max_length=128, min_length=1, write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        user.is_active = False
        user.save()
        email = validated_data["email"]
        email_subject = "Activate your account"
        uid = urlsafe_base64_encode(force_bytes(user.pk + 100))
        domain = get_current_site(self.context["request"])
        date = datetime.datetime.utcnow()
        utc_time = calendar.timegm(date.utctimetuple())
            
        seed(utc_time)
        nb = random.randrange(0, 1000)
        for i in range(0, nb + 149):
            utc_time += nb
            utc_time -= i
                
        seed(utc_time)
        counter = randint(0, 10000)
        string = str(counter + utc_time)
        hashed_str = hashlib.sha256(string.encode('utf-8')).hexdigest()
        token = urlsafe_base64_encode(force_bytes(hashed_str))
        user.verify_mail_url = token
        user.save()
        link = reverse('verify-email', kwargs={"uid": uid, "status": token})

        url = f"{settings.PROTOCOL}://{domain}{link}"

        mail = EmailMessage(
            email_subject,
            url,
            None,
            [email],
        )
        mail.send(fail_silently=False)

        return user

    def validate(self, data):

        # get the password from the data
        password = data.get('password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validate_password(password=password)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(RegisterSerializer, self).validate(data)


class MFASerializer(serializers.Serializer):
    '''
        Validate the one-time-password which must be six digits.
    '''

    otp = serializers.CharField(
        min_length=6, max_length=6, write_only=True)

    def validate(self, data):
        otp=data.get('otp')

        if not otp.isdigit():
            raise serializers.ValidationError('The one-time-password must be a number with six digits.')

        return otp


class ResetPasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['email', "username"]


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    password1 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uid = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'password1', 'token', 'uid']

    def validate(self, attrs):
        password = attrs.get('password')
        password1 = attrs.get('password1')
        token = attrs.get('token')
        uid = attrs.get('uid')

        id = force_text(urlsafe_base64_decode(uid))
        user = get_user_model().objects.get(id=id)
        url_safe = force_text(urlsafe_base64_decode(token))
        errorMessage = dict()
        if not str(url_safe) == str(force_text(urlsafe_base64_decode(user.reset_url))):

            errorMessage['message'] = 'The reset link is invalid'
            raise serializers.ValidationError(errorMessage)

        try:
            validate_password(password)
        except exceptions.ValidationError as error:
            errorMessage['message'] = list(error.messages)

        if errorMessage:
            raise serializers.ValidationError(errorMessage)

        if password != password1:
            raise serializers.ValidationError("Passwords must match!")

        user.set_password(password)
        user.reset_url = None
        user.save()

        return user


class MFALoginSerializer(TokenObtainPairSerializer):
    
    def validate(self, user):
        data = {'user': None, 'refresh': None, 'access': None, 'mfa_verified': None}
        data['user'] = UserSerializer(user).data
        refresh = self.get_token(user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['mfa_verified'] = user.mfa_active
        
        return data

    
