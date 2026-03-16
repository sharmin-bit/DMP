from rest_framework import serializers
from django.contrib.auth.models import User
from .models import TechStack, DeploymentPreference, HostingSuggestion

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user
    

class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ["id", "data", "created_at"]

class HostingSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HostingSuggestion
        fields = ["id", "name", "why", "created_at"]

class DeploymentPreferenceSerializer(serializers.ModelSerializer):
    hosting_suggestions = HostingSuggestionSerializer(many=True, read_only=True)

    class Meta:
        model = DeploymentPreference
        fields = [
    "id",
    "techstack",
    "coding_choice",
    "monthly_users",
    "runtime",
    "media_upload",
    "auth_required",
    "created_at",
    "hosting_suggestions"
]
