from rest_framework import serializers

class handleConnectionRequestSerializers(serializers.Serializer):
    username = serializers.CharField(required=True)
    accept = serializers.CharField(required=False)
    mode = serializers.CharField(required=True)