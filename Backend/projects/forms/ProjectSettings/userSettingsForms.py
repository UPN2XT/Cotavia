from django.forms import forms
from django import forms as Form

class GetUsersForm(forms.Form):
    ID = Form.CharField(required=True)

class UpdateUsersForm(forms.Form):
    ID = Form.CharField(required=True)
    username = Form.CharField(required=True)

class RoleUpdate(forms.Form):
    ID = Form.CharField(required=True)
    action = Form.CharField(required=True)
    data = Form.JSONField(required=True)

class GetUsersRoleInfo(forms.Form):
    ID = Form.CharField(required=True)
    name = Form.CharField(required=True)

class UpdateUserInRoleForm(GetUsersRoleInfo):
    username = Form.CharField(required=True)
    action = Form.CharField(required=True)

class DirRoleForm(forms.Form):
    ID = Form.CharField(required=True)
    name: str = Form.CharField(required=False)
    path: str = Form.CharField(required=True)
    type: str = Form.CharField(required=True)
    action: str = Form.CharField(required=False)