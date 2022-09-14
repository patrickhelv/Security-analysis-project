from rest_framework import permissions


class IsSenderOrReceiver(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        return obj.recipient == request.user.username or obj.sender == request.user.username
