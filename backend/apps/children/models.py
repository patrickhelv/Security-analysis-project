from django.db import models
from django.contrib.auth import get_user_model
from .validators import FileValidator
import math
# Create your models here.


class Child(models.Model):

    parent = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, blank=False)

    name = models.CharField(max_length=16)

    guardians = models.ManyToManyField(
        get_user_model(), related_name='children', blank=True)

    info = models.TextField()


def child_directory_path(instance, filename):
    """
    Return the path for an child's file
    :param instance: Current instance containing an child
    :param filename: Name of the file
    :return: Path of file as a string
    """
    return f"children/{instance.child.id}/{filename}"


class ChildFile(models.Model):

    child = models.ForeignKey(
        Child, on_delete=models.CASCADE, blank=False, related_name='children_files')

    file = models.FileField(upload_to=child_directory_path,
                            blank=False, validators=[FileValidator(allowed_mimetypes=('image/png', 'application/pdf'), allowed_extensions=('pdf', 'png'), min_size=100, max_size=8*1024*1024)])
    content_type = models.CharField(max_length=64)
