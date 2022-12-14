"""
Django settings for trustedsitters project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os

from pathlib import Path
from datetime import timedelta
import os.path

# The PRODUCTION variable decides how the static files are handeled in wsgi.py
# The variable is set to 'True' (string) when running with docker
PRODUCTION = os.getenv('PRODUCTION', False)

# Get environment variables
GROUP_ID = os.environ.get("GROUP_ID", "3000")
PORT_PREFIX = os.environ.get("PORT_PREFIX", "")
DOMAIN = os.environ.get("DOMAIN", "localhost")
PROTOCOL = os.environ.get("PROTOCOL", "HTTPS")

# Set the URL used for redirecting
# URL in local development will not find environment variables and looks like: 'http://localhost:3000' (redirect to node)
# URL in local production with docker can look like this: 'http://localhost:21190', where 190 is the GROUP_ID
# URL in remote production with docker can look like this: 'http://molde.idi.ntnu.no:21190', where 190 is the GROUP_ID
URL = PROTOCOL + '://' + DOMAIN + ':' + PORT_PREFIX + GROUP_ID

# Email configuration
# The host must be running within NTNU's VPN (vpn.ntnu.no) to allow this config
# Usage: https://docs.djangoproject.com/en/3.1/topics/email/#obtaining-an-instance-of-an-email-backend
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.stud.ntnu.no"
EMAIL_USE_TLS = True
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL = "tdt4237-group" + GROUP_ID + " " + "<noreply@idi.ntnu.no>"
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'asølkjwojdw09wdlg6u=986qz+fh2t!dj-i%)s*vebg@w&r92p2ci(ixc_25cm5!t'
FIELD_ENCRYPTION_KEY = os.environ.get('FIELD_ENCRYPTION_KEY', 'yXhjluyPu6bYlul9wyAaHW2CT25ky9W7TKC7h8y166E=')

DEBUG = False

ALLOWED_HOSTS = [
    # Hosts for local development
    '127.0.0.1',
    'localhost',
    # Hosts for production
    'molde.idi.ntnu.no',
]

CORS_ALLOWED_ORIGINS = [
    # Allow requests from node app in development
    "http://localhost:3000",
    # Allow requests from node app in production
    "http://localhost:5000",
]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_password_validators',
    'corsheaders',
    'rest_framework',
    'apps.adverts.apps.AdvertsConfig',
    'apps.users.apps.UsersConfig',
    'apps.children.apps.ChildrenConfig',
    'apps.offers.apps.OffersConfig',
    'encrypted_model_fields',
    'rest_framework_simplejwt.token_blacklist',
    'axes',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'axes.middleware.AxesMiddleware',
]

ROOT_URLCONF = 'trustedsitters.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'trustedsitters.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_USER_MODEL = "users.User"
# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators


# Expanding the validator function to make sure passwords dont match user information, are of required length and aren't too common
AUTH_PASSWORD_VALIDATORS = [
    {
        # Makes sure the password isn't simmilar to the user's username, email, first name or last name. Set the max simmilarity to 0.6
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        'Options': {
            'user_attributes': (
                'username', 'email', 'first_name', 'last_name'
            ),
            'max_smiliarity': 0.6
        }
    },
    { # Sets a required minimum password length of 8 characters
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    { # We check the password against a list of common passwords, we will be using the Django's default list.
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    { # Additionally we require the password to have a special character
        'NAME': 'django_password_validators.password_character_requirements.password_validation.PasswordCharacterValidator',
            'OPTIONS': {
            'min_length_digit': 1,
            'min_length_special': 1,
            'min_length_lower': 1,
            'min_length_upper': 1,
            'special_characters': "~!@#$%^&*()_+{}:;'[]" + '"'
        }
    }
]

# Adopting the default set of passwords hashers in Django. This will utilize the PBKDF2 algorithm with a SHA256 hash.
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher'
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/
# This is only relevant in production (running with docker)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# MEDIA FILES
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}


SIMPLE_JWT = {
    # Changed access token lifetime from 6000 minutes to 30 minutes.
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes = 30),
    # Changed the refresh token lifetime from 15 days to 1 day.
    'REFRESH_TOKEN_LIFETIME': timedelta(days = 1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True
}

#Lock out Django Axes

AXES_FAILURE_LIMIT = 5
AXES_LOCKOUT_CALLABLE = "users.views.lockout"
AXES_ONLY_USER_FAILURES = True
AXES_COOLOFF_TIME = 23

AUTHENTICATION_BACKENDS = [
    # AxesBackend should be the first backend in the AUTHENTICATION_BACKENDS list.
    'axes.backends.AxesBackend',

    # Django ModelBackend is the default authentication backend.
    'django.contrib.auth.backends.ModelBackend',
]