#Download pdf
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io


def generate_deployment_pdf(project_idea, techstack, preference):

    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)

    width, height = letter
    y = height - 50

    # Title
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(180, y, "Prompt2Deploy Report")

    y -= 40

    # Project Idea
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "1. Project Idea")

    y -= 20
    pdf.setFont("Helvetica", 12)

    for line in project_idea.split("\n"):
        pdf.drawString(60, y, line)
        y -= 18

    y -= 20

    # Techstack
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "2. Detected Tech Stack")

    y -= 20
    pdf.setFont("Helvetica", 12)

    for key, value in techstack.items():
        stack = ", ".join(value) if value else "None"
        pdf.drawString(60, y, f"{key}: {stack}")
        y -= 18

    y -= 20

    # Preferences
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "3. Deployment Preferences")

    y -= 20
    pdf.setFont("Helvetica", 12)

    pdf.drawString(60, y, f"Runtime: {preference.runtime}")
    y -= 18

    pdf.drawString(60, y, f"Monthly Users: {preference.monthly_users}")
    y -= 18

    pdf.drawString(60, y, f"Media Upload: {preference.media_upload}")
    y -= 18

    pdf.drawString(60, y, f"Authentication Required: {preference.auth_required}")

    y -= 30

    # # Deployment Plan
    # pdf.setFont("Helvetica-Bold", 14)
    # pdf.drawString(50, y, "4. Deployment Plan")

    # y -= 20
    # pdf.setFont("Helvetica", 12)

    # for line in plan_text.split("\n"):

    #     if y < 80:
    #         pdf.showPage()
    #         pdf.setFont("Helvetica", 12)
    #         y = height - 50

    #     pdf.drawString(60, y, line)
    #     y -= 18

    pdf.save()
    buffer.seek(0)

    return buffer


