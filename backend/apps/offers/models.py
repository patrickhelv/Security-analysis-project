from django.db import models
from django.contrib.auth import get_user_model
from apps.adverts.models import Advert

# Create your models here.


class OfferType(models.TextChoices):
    GUARDIAN_OFFER = 'GUARDIAN_OFFER'
    JOB_OFFER = 'JOB_OFFER'


class OfferStatus(models.TextChoices):
    ACCEPTED = 'A'
    DECLINED = 'D'
    PENDING = 'P'


class Offer(models.Model):

    sender = models.TextField()
    recipient = models.TextField()
    advert = models.ForeignKey(
        Advert, on_delete=models.SET_NULL, null=True, blank=True)
    offerType = models.CharField(max_length=14,
                                 choices=OfferType.choices, default=OfferType.JOB_OFFER, blank=False)
    status = models.CharField(
        max_length=1, choices=OfferStatus.choices, default=OfferStatus.PENDING)


class Contract(models.Model):

    finished = models.BooleanField(default=False)

    parent = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, blank=False, related_name='p_contract')

    sitter = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, blank=False, related_name='s_contract')

    content = models.TextField()

    date = models.DateField(blank=False)

    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
