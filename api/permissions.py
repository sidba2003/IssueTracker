from rest_framework import permissions


class IsAllowedToChangeCompanyName(permissions.BasePermission):
    message = "Only company admins are allowed to change company names."

    def has_permission(self, request, view):
        return request.user.company_admin
