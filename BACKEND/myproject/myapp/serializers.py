from rest_framework import serializers
from .models import TechStack, DeploymentPreference, HostingSuggestion

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
