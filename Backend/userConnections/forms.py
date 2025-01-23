from django.forms import forms, CharField

class handleConnectionRequestFrom(forms.Form):
    username = CharField(required=True)
    accept = CharField(required=False)
    mode = CharField(required=True)