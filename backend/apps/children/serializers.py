from rest_framework import serializers
from django.urls import reverse
from .models import Child, ChildFile
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site


"""
Serializer for the Child model.
"""


class ChildSerializer(serializers.ModelSerializer):

    guardians = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='username')
    parent = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = Child
        fields = ('id', 'parent', 'name', 'info', 'guardians')
        read_only_fields = ['parent']


"""
Same Serializer as above, but with email for Guardians instead of username.
Used when fetching the child infos for babysitters on active contracts.
"""


class ContractChildSerializer(serializers.ModelSerializer):

    guardians = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='email')
    parent = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    class Meta:
        model = Child
        fields = ('id', 'parent', 'name', 'info', 'guardians')
        read_only_fields = ['parent']


"""
Serializer for the upload of Child files.
"""


class ChildFilePostSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChildFile
        fields = ('id', 'child', 'file')


"""
Serializer for the download of Child files.
"""


class ChildFileGetSerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = ChildFile
        fields = ('id', 'child', 'link', 'name')

    def get_link(self, obj):
        domain = get_current_site(self.context["request"])
        link = reverse('child-file-download', kwargs={"pk": obj.id})

        link = f"{settings.PROTOCOL}://{domain}{link}"
        return link

    def get_name(self, obj):
        # name is stored as children/id/filename, so splitting and selecting last item gets only the filename.
        return obj.file.name.split('/')[-1]
