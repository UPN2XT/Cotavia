import re
from rest_framework import serializers

class CustomPasswordField(serializers.CharField):
    def __init__(self, **kwargs):
        kwargs.setdefault('write_only', True)  # Password should not be returned in API responses
        kwargs.setdefault('style', {'input_type': 'password'})  # Makes it behave like a password field in DRF browsable API
        super().__init__(**kwargs)

    def validate(self, value):
        """Custom password validation logic"""
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', value):
            raise serializers.ValidationError(
                "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
            )
        return value
    
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=4, max_length=32, required=True)
    password = serializers.CharField(write_only=True, required=True)

class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=4, max_length=32, required=True)
    displayname = serializers.CharField(min_length=1, max_length=32, required=True)
    email = serializers.EmailField(required=True)
    password = CustomPasswordField(required=True)


