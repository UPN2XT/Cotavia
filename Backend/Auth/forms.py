import re
from django import forms
from django.core.exceptions import ValidationError

class CustomPasswordField(forms.CharField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', forms.PasswordInput)
        kwargs.setdefault('label', 'Password')
        kwargs.setdefault('help_text', 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.')
        super().__init__(*args, **kwargs)

    def validate(self, value):
        super().validate(value)

        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', value):
            raise ValidationError(
                "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
            )

class signupFrom(forms.Form):
    username = forms.CharField(max_length=32, required=True, min_length=4)
    displayname = forms.CharField(min_length=1, max_length=32)
    email = forms.EmailField(required=True)
    password = CustomPasswordField(required=True)

class loginForm(forms.Form):
    username = forms.CharField(max_length=32, required=True, min_length=4)
    password = forms.CharField()