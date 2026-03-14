import os
import json
import re
import google.generativeai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import TechStack as TechStackModel
from .serializers import TechStackSerializer
import google.generativeai as genai
from django.shortcuts import render
from .models import (
    HostingSuggestion,
    TechStack as TechStackModel,
    DeploymentPreference,
)
from .serializers import (
    HostingSuggestionSerializer,
    TechStackSerializer,
    DeploymentPreferenceSerializer,
)
SYSTEM_PROMPT = (
    "Extract technologies from the project description. "
    "Return only these four categories: languages, frameworks, databases, cloud. "
    "Use the exact names mentioned (e.g., React Native, Node.js, PostgreSQL, AWS). "
    "If Node.js appears, classify it as a framework. "
    "Do not infer or guess technologies. "
    "If a category has no technologies mentioned, return an empty list. "
    "Respond strictly in JSON format."
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

@api_view(["POST"])
@permission_classes([AllowAny])
def extract_techstack(request):
    prompt = request.data.get("prompt") or request.data.get("text")
    if not prompt:
        return Response(
            {"detail": "'prompt' is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    try:
        full_prompt = f"""
                     Extract technologies from the project description.
                     Return ONLY valid JSON with this structure:
                  {{
                     "languages": [],
                     "frameworks": [],
                     "databases": [],
                     "cloud": []
                   }}
                 Rules:
                    - Use exact names mentioned
                    - If nothing is mentioned return empty list
                    - Do NOT add explanation
                 Project:
                 {prompt}
                 """

        response = model.generate_content(full_prompt)
        text = response.text.strip()
        # Remove markdown ```json ``` if Gemini adds it
        text = re.sub(r"```json|```", "", text).strip()
        parsed = json.loads(text)
        # Save to DB
        row = TechStackModel.objects.create(data=parsed)
        serializer = TechStackSerializer(row)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except json.JSONDecodeError:
        return Response(
            {
                "error": "Gemini returned invalid JSON",
                "raw_output": text
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def suggest_hosts(pref, techstack):
    """
    pref: DeploymentPreference instance
    techstack: dict (pref.techstack.data) or minimal dict if missing
    """
    runtime = pref.runtime
    media = pref.media_upload
    auth = pref.auth_required
    users = pref.monthly_users

    frameworks = techstack.get("frameworks", []) if techstack else []
    databases = techstack.get("databases", []) if techstack else []

    suggestions = []

    if runtime == "static":
        suggestions += [
            {"name": "GitHub Pages", "why": "Simple static hosting from a GitHub repo"},
            {"name": "Cloudflare Pages", "why": "Fast CDN + edge functions if needed"},
            {"name": "Netlify", "why": "Static + functions; generous free tier"},
            {"name": "Vercel Hobby", "why": "Perfect for React/Next.js static apps"},
        ]

    elif runtime == "serverless":
        suggestions += [
            {"name": "Vercel", "why": "Serverless functions + React integration"},
            {"name": "Netlify", "why": "Functions + static hosting"},
            {"name": "Cloudflare Workers", "why": "Edge runtime for low latency"},
        ]
        if auth:
            suggestions.append({"name": "Supabase Auth", "why": "Auth + Postgres + storage"})
            suggestions.append({"name": "Firebase Auth", "why": "Popular free auth option"})

    elif runtime == "container":
        suggestions += [
            {"name": "Render", "why": "Free Postgres + good Django support"},
            {"name": "Fly.io", "why": "Runs small containers globally"},
        ]

    # Techstack-based hints
    if "PostgreSQL" in databases:
        suggestions.append({"name": "Supabase", "why": "Free Postgres DB + Auth + Storage"})
    if "Django" in frameworks:
        suggestions.append({"name": "Render", "why": "Great free tier for Django apps"})
    if "React" in frameworks and runtime == "static":
        suggestions.append({"name": "Vercel", "why": "Optimized for React frontends"})

    # Media uploads
    if media:
        suggestions.append({"name": "Cloudflare R2 / Supabase Storage", "why": "Free object storage"})

    # High traffic warning
    if users and users > 100_000:
        suggestions.insert(0, {"name": "NOTE", "why": "Free tiers likely insufficient for >100k users"})

    return suggestions


@api_view(["POST"])
@permission_classes([AllowAny])
def create_deployment_pref(request):
    """
    POST /api/deployment/preferences/
    Body example:
    {
      "techstack": 1,
      "coding_choice": "coding",
      "monthly_users": 1500,
      "runtime": "serverless",
      "media_upload": true,
      "auth_required": true
    }
    """
    serializer = DeploymentPreferenceSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    pref = serializer.save()

    # get techstack data; handle case when pref.techstack might be None
    techstack_data = pref.techstack.data if getattr(pref, "techstack", None) else {"frameworks": [], "databases": []}

    # IMPORTANT: pass techstack_data into suggest_hosts (fixes the missing-argument bug)
    suggestions = suggest_hosts(pref, techstack_data)

    # Save each suggestion to DB
    suggestion_objs = []
    for s in suggestions:
        # the NOTE entry may not be a real host (it is a warning). Save it anyway or skip it if you prefer.
        obj = HostingSuggestion.objects.create(
            preference=pref, name=s.get("name", "Unknown"), why=s.get("why", "")
        )
        suggestion_objs.append(obj)

    return Response(
    DeploymentPreferenceSerializer(pref).data,
    status=status.HTTP_201_CREATED
    )
