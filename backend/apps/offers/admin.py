from django.contrib import admin

# Register your models here.

from .models import Offer, Contract

admin.site.register(Offer)
admin.site.register(Contract)
