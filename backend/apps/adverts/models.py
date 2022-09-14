from django.db import models
from django.contrib.auth import get_user_model


class AdvertType(models.TextChoices):
    IS_SITTER = 'IS_SITTER'
    NEED_SITTER = 'ND_SITTER'


class Advert(models.Model):

    advertType = models.CharField(max_length=9,
                                  choices=AdvertType.choices, default=AdvertType.NEED_SITTER, blank=False)

    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, blank=False)

    content = models.TextField()

    date = models.DateField(blank=False)

    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
