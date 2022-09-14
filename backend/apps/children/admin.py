from django.contrib import admin

# Register your models here.
from .models import Child, ChildFile

admin.site.register(Child)
admin.site.register(ChildFile)
