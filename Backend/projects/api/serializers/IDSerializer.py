from rest_framework import serializers

class IDSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)