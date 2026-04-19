from django.urls import path
from .views import extract_techstack,create_deployment_pref,register_user,get_users,get_plans,get_techstacks,login_user,logout_user ,download_plan_pdf

urlpatterns = [
    path("extract/", extract_techstack, name="extract-techstack"),
    path("deployment/preferences/",create_deployment_pref,name="deployment-pref"),

     # auth APIs
    path("auth/register/", register_user),
    path("auth/login/", login_user),
    path("auth/logout/", logout_user),
    path("users/", get_users),
    path("techstacks/", get_techstacks),
    path("plans/", get_plans),
    #download pdf
    path("download-plan/", download_plan_pdf),
]
