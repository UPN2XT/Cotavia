from django import forms

class createProjectForm(forms.Form):
    name = forms.CharField(required=True)

class IdAcessForm(forms.Form):
    ID = forms.CharField(required=True)