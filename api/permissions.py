from rest_framework import permissions


class IsCompanyAdmin(permissions.BasePermission):
    message = "Only company admins are perform this operation."

    def has_permission(self, request, view):
        return request.user.company_admin
