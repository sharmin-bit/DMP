import os
import json
import re
import google.generativeai as genai
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import HttpResponse
from .models import TechStack as TechStackModel
from .serializers import TechStackSerializer
import google.generativeai as genai
from .utils import generate_deployment_pdf
from django.shortcuts import render
from .models import (
    HostingSuggestion,
    TechStack,
    DeploymentPreference,
    DeploymentPlan
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
@permission_classes([IsAuthenticated])
def extract_techstack(request):

    prompt = request.data.get("prompt") or request.data.get("text")

    if not prompt:
        return Response(
            {"detail": "'prompt' is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        full_prompt = f"""
You are an expert software architect.

Your task is to analyze a project idea and determine the most suitable technology stack.

You must follow this logic strictly:

----------------------
STEP 1: EXTRACTION
----------------------
- If the user explicitly mentions any technologies, extract them exactly.
- Do NOT remove or override valid mentioned technologies.
- Normalize common variations (e.g., "node" → "Node.js", "reactjs" → "React").

----------------------
STEP 2: INTELLIGENT SUGGESTION
----------------------
- If technologies are missing, suggest appropriate ones based on the project type.

Use these broad guidelines (NOT restrictive — choose intelligently):

FRONTEND OPTIONS:
- React → dynamic UI, dashboards, SPAs
- Angular → enterprise-scale applications
- Vue.js → lightweight and fast UI
- HTML/CSS/JS → static or simple websites
- React Native / Flutter → mobile apps

BACKEND OPTIONS:
- Django / Flask → Python-based apps
- FastAPI → high-performance APIs, AI/ML systems
- Node.js (Express/NestJS) → real-time apps, JS ecosystem
- Spring Boot → large-scale Java enterprise systems

DATABASE OPTIONS:
- PostgreSQL / MySQL → relational structured data
- MongoDB → flexible/unstructured data
- Firebase → real-time/mobile backend
- Redis → caching / real-time systems

CLOUD OPTIONS:
- AWS → scalable production systems
- GCP → AI/ML-heavy applications
- Azure → enterprise environments
- Vercel / Netlify → frontend deployments
- Firebase → full backend + hosting

----------------------
STEP 3: LANGUAGE MAPPING (IMPORTANT)
----------------------
Automatically include languages based on chosen frameworks:

- Django / Flask / FastAPI → Python
- React / Angular / Vue / Node.js → JavaScript
- React Native → JavaScript (or TypeScript)
- Flutter → Dart
- Spring Boot → Java
- Express / NestJS → JavaScript

- If a framework is selected, its language MUST be included.
- Avoid duplicate languages.
- If user already specified a language, keep it.

----------------------
STEP 4: CONSISTENCY CHECK
----------------------
- Ensure all technologies are compatible.
- Avoid conflicting stacks (e.g., Django + Node.js unless clearly needed).
- Prefer a clean, minimal, production-ready stack.

----------------------
RULES:
----------------------
- Maximum 2-3 items per category.
- Use modern, widely adopted technologies.
- Always include at least one cloud platform.
- Do NOT add explanations.
- Do NOT include markdown.

----------------------
OUTPUT FORMAT (STRICT JSON):
----------------------
{{
  "languages": [],
  "frameworks": [],
  "databases": [],
  "cloud": []
}}

----------------------
PROJECT IDEA:
{prompt}
"""

        response = model.generate_content(full_prompt)

        text = response.text.strip()

        # Remove markdown if Gemini adds it
        text = re.sub(r"```json|```", "", text).strip()

        parsed = json.loads(text)

        # Ensure keys exist
        parsed.setdefault("languages", [])
        parsed.setdefault("frameworks", [])
        parsed.setdefault("databases", [])
        parsed.setdefault("cloud", [])

        # Save in DB
        row = TechStackModel.objects.create(
            user=request.user,
            prompt=prompt,
            data=parsed
        )

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
@permission_classes([IsAuthenticated])
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

    pref = serializer.save(user=request.user)
    DeploymentPlan.objects.create(
    user=request.user,
    techstack=pref.techstack
    )
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


@api_view(["POST"])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "is_admin": user.is_staff, 
    })


@api_view(["POST"])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Logged out successfully"})
    except Exception:
        return Response({"error": "Invalid token"}, status=400)
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def download_plan_pdf(request):
    try:
        techstack_id = request.data.get("techstack_id")

        if not techstack_id:
            return Response({"error": "techstack_id is required"}, status=400)

        user = request.user

        # Fetch TechStack
        techstack = TechStack.objects.filter(
            id=techstack_id,
            user=user
        ).first()

        if not techstack:
            return Response(
                {"error": "TechStack not found for this user"},
                status=404
            )

        # 🔥 CREATE PLAN ENTRY (FIX)
        DeploymentPlan.objects.get_or_create(
            user=user,
            techstack=techstack
         )
        # Fetch Preference
        preference = DeploymentPreference.objects.filter(
            techstack=techstack,
            user=user
        ).first()

        if not preference:
            return Response(
                {"error": "Deployment preference not found"},
                status=404
            )

        # Generate PDF
        pdf_buffer = generate_deployment_pdf(
            project_idea=techstack.prompt,
            techstack=techstack.data,
            preference=preference
        )

        # Response
        response = HttpResponse(
            pdf_buffer,
            content_type="application/pdf"
        )

        response["Content-Disposition"] = f'attachment; filename="deployment_plan.pdf"'

        return response

    except Exception as e:
        return Response(
            {"error": f"Something went wrong: {str(e)}"},
            status=500
        )
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_users(request):
    users = User.objects.all().values("id", "username", "email")
    return Response(list(users))

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_techstacks(request):
    stacks = TechStack.objects.all()
    serializer = TechStackSerializer(stacks, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_plans(request):
    plans = DeploymentPlan.objects.select_related("user", "techstack").all()

    data = []
    for plan in plans:
        data.append({
            "id": plan.id,
            "username": plan.user.username,
            "prompt": plan.techstack.prompt,
            "created_at": plan.created_at
        })

    return Response(data)