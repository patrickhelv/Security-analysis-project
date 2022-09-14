from rest_framework import permissions
from .models import Child


class IsParentOrReadOnly(permissions.BasePermission):

    """
    Object-level permission to only allow parents of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.parent == request.user


class ChildFilePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            if request.data.get("child"):
                child = Child.objects.get(pk=request.data["child"])

                return child.parent == request.user
            return False

        return True

    def has_object_permission(self, request, view, obj):
        if request.method == "DELETE":
            return request.user == obj.child.parent
        return request.user == obj.child.parent or request.user in obj.child.guardians.all()
