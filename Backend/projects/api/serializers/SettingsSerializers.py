from rest_framework import serializers

class UserHandlerSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    username = serializers.CharField(required=True)

class FolderRolesAcessSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    Type = serializers.CharField(required=True)
    UUID = serializers.UUIDField(required=True)

class switchVisbilitySerializer(FolderRolesAcessSerializer):
    path = serializers.CharField(required=True)
    action = serializers.CharField(required=True)

class EditRolesDirSerializer(FolderRolesAcessSerializer):
    path = serializers.CharField(required=True)
    add = serializers.JSONField(required=True)
    remove = serializers.JSONField(required=True)

class RoleUpdateHandlerSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    action = serializers.CharField(required=True)
    data = serializers.JSONField(required=True)

class GetUsersInRoleSerializer(serializers.Serializer):
    ID = serializers.CharField(required=True)
    name = serializers.CharField(required=True)

class EditUsersInRoleSerializer(GetUsersInRoleSerializer):
    username = serializers.CharField(required=True)
    action = serializers.CharField(required=True)