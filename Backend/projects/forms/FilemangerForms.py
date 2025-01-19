from django import forms
    

class DirRequestForm(forms.Form):
    ID = forms.CharField(required=True)
    path = forms.CharField(required=False, min_length=0)
    name = forms.CharField(required=False  )
    data = forms.CharField(required=False, min_length=0)
