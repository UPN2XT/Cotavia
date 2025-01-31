from django import forms
    

class FileGetterForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)

class DirRequestForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)
    name = forms.CharField(required=False  )
    data = forms.CharField(required=False, min_length=0)

class FileCreationForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)
    name = forms.CharField(required=True)
    data = forms.FileField(required=True)
    Type = forms.CharField(required=True)

class FileUpdateForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)
    data = forms.FileField(required=True)
    Type = forms.CharField(required=True)

class MoveForm(forms.Form):
    ID = forms.CharField(required=True)
    From = forms.CharField(required=True, min_length=0)
    To = forms.CharField(required=False)
    type = forms.CharField(required=True)

class DeleteForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=True, min_length=0)
    type = forms.CharField(required=True)

