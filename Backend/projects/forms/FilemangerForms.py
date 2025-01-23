from django import forms
    

class DirRequestForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)
    name = forms.CharField(required=False  )
    data = forms.CharField(required=False, min_length=0)

class MoveForm(forms.Form):
    ID = forms.CharField(required=True)
    From = forms.CharField(required=True, min_length=0)
    To = forms.CharField(required=False)
    type = forms.CharField(required=True)

class DeleteForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=True, min_length=0)
    type = forms.CharField(required=True)

