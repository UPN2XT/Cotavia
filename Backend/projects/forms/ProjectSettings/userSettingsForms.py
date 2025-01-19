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