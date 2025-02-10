from rest_framework import serializers

class folderCreationSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    UUID = serializers.UUIDField(required=True)

class FileCreationSerializer(folderCreationSerializer):
    data = serializers.FileField(required=True)
    Type = serializers.CharField(required=True)

class FileUpdateSerializer(FileCreationSerializer):
    name = serializers.CharField(required=False)

class DeletionSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    Type = serializers.CharField(required=True)
    UUID = serializers.UUIDField(required=True)

class RenameSerializer(DeletionSerializer):
    name = serializers.CharField(required=True)

class MoveSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    Type = serializers.CharField(required=True)
    UUIDFrom = serializers.UUIDField(required=True)
    UUIDTo = serializers.UUIDField(required=True)
    mode = serializers.CharField(required=True)


class GetFileSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    UUID = serializers.UUIDField(required=True)

    