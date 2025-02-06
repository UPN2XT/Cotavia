from rest_framework import serializers

class createProjectSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)