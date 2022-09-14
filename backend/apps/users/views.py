import datetime
import calendar
import random
from random import seed
from random import randint
import hashlib

from django.contrib.auth import get_user_model
from rest_framework import permissions, viewsets, filters, status, generics, views
from apps.users.serializers import RegisterSerializer, LoginSerializer, UserSerializer, ResetPasswordSerializer, SetNewPasswordSerializer, MFASerializer, MFALoginSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.response import Response
from django.shortcuts import redirect
from django.contrib.sites.shortcuts import get_current_site
import os
from django.conf import settings
import pyotp
from .models import User
from django.core.mail import EmailMessage
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.encoding import force_bytes, force_text
from axes.decorators import axes_dispatch
from django.utils.decorators import method_decorator
from django.contrib.auth import signals
from django.http import JsonResponse
from axes.utils import reset


class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.is_superuser:  # Admin users can see info of every user
            return get_user_model().objects.raw('SELECT * FROM users_user')
        else:
            # Normal users only see information about themselves
            return get_user_model().objects.raw('SELECT * FROM users_user WHERE id = %s', [self.request.user.id])


class RegistrationViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        res = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response({
            "user": serializer.data,
            "refresh": res["refresh"],
            "token": res["access"]
        }, status=status.HTTP_201_CREATED)

@method_decorator(axes_dispatch, name='dispatch')
class LoginViewSet(viewsets.ModelViewSet, TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            signals.user_login_failed.send(
                sender=User, request=request, 
                credentials={
                    'username': serializer.credentials()
                })
            raise InvalidToken(e.args[0])

        user = serializer.validated_data.get("user")
        reset(username=user.get("username"))

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class RefreshViewSet(viewsets.ViewSet, TokenRefreshView):
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class VerificationView(generics.GenericAPIView):
    def get(self, request, uid, status):
        verified_url = settings.URL + "/verified"
        invalid_url = settings.URL + "/invalid"
        try:
            id = force_text(urlsafe_base64_decode(uid))
            newid = int(id) - 100
            user = get_user_model().objects.get(pk=newid)
            token = user.verify_mail_url
        
            newtoken = force_text(urlsafe_base64_decode(token))
            newstatus = force_text(urlsafe_base64_decode(status))

            if str(newstatus) == str(newtoken):
                user.is_active = True
                user.verify_mail_url = None
                user.save()
            else:
                user.is_active = False
                user.save()
                return redirect(invalid_url)

            return redirect(verified_url)

        except Exception as ex:
            pass

        return redirect(invalid_url)


class MFAView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MFASerializer

    def get(self, request):
        '''
            Creates a new secret token if the user has not activated MFA, else return current token.
        '''
        user = User.objects.get(id = request.user.id)
        if user.mfa_active==False:
            secret_key = pyotp.random_base32()
            user.mfa_token = secret_key
            user.save()
            mfa_token = pyotp.TOTP(secret_key).provisioning_uri(name=request.user.email, issuer_name='TrustedSitters')
            return Response({'mfa_token': mfa_token, 'active': user.mfa_active})
        else:
            mfa_token = pyotp.TOTP(user.mfa_token).provisioning_uri(name=request.user.email, issuer_name='TrustedSitters')
            return Response({'mfa_token': mfa_token, 'active': user.mfa_active})

    def post(self, request):
        '''
            Verifies the provided one-time-password and sets the mfa_active User field to True
        '''

        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        user = User.objects.get(id = request.user.id)
        if user.mfa_token is None:
            return Response(status=status.HTTP_403_FORBIDDEN)
        mfa_token = pyotp.TOTP(user.mfa_token)
        if not user.mfa_active and mfa_token.verify(serializer.validated_data):
            user.mfa_active=True
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        elif mfa_token.verify(serializer.validated_data):
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class PasswordResetEmailView(generics.GenericAPIView):

    serializer_class = ResetPasswordSerializer

    def post(self, request):
        if request.data.get("email") and request.data.get("username"):
            email = request.data["email"]
            username = request.data["username"]

            if get_user_model().objects.filter(email=email, username=username).exists():
                user = get_user_model().objects.get(email=email, username=username)
                
                
                
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
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                domain = get_current_site(request).domain
                token = urlsafe_base64_encode(force_bytes(hashed_str))
                user.reset_url = token
                user.save()
                link = reverse(
                    'password-reset', kwargs={"uidb64": uid, "token": token})

                url = f"{settings.PROTOCOL}://{domain}{link}"
                email_subject = "Password reset"
                mail = EmailMessage(
                    email_subject,
                    url,
                    None,
                    [email],
                )
                mail.send(fail_silently=False)
        return Response({'success': "If the user exists, you will shortly receive a link to reset your password."}, status=status.HTTP_200_OK)


class ResetPasswordView(generics.GenericAPIView):
    def get(self, request, uidb64, token):
        domain = get_current_site(request).domain
        new_password_url = settings.URL + "/new_password"
        invalid_url = settings.URL + "/invalid"
        try:
            id = force_text(urlsafe_base64_decode(uidb64))
            user = get_user_model().objects.get(pk=id)
            url_safe = force_text(urlsafe_base64_decode(token))
            if not url_safe != None and str(url_safe) == str(force_text(urlsafe_base64_decode(user.reset_url))):  # Verify that the token is valid for the user
                return redirect(invalid_url)

            return redirect(f'{new_password_url}?uid={uidb64}&token={token}')

        except Exception as ex:
            pass

        return redirect(invalid_url)


class SetNewPasswordView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)


class MFALogin(generics.GenericAPIView):
    serializer_class = MFALoginSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']

    def post(self, request):
        serializers = self.get_serializer(data=request.data)
        otp = request.data.get('otp')
        username = request.data['username']
        try:
            if not otp.isdigit():
                return Response(status=status.HTTP_403_FORBIDDEN)
        except TokenError as e:
            raise InvalidToken(e.args[0])
        user = get_user_model().objects.get(username=username)

        if user.mfa_token is None:
            return Response(status=status.HTTP_403_FORBIDDEN)

        mfa_token = pyotp.TOTP(user.mfa_token)
        if mfa_token.verify(otp):
            data = serializers.validate(user)
            return Response(data, status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)



class LogoutView(generics.GenericAPIView):

    def post(self, request):
        refresh_token = self.request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "logout successful"}, status=status.HTTP_200_OK)

def lockout(request, credentials, *args, **kwargs):
    return JsonResponse({"status": "Locked out due to too many login failures"}, status=403)

