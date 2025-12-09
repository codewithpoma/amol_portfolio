from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
import logging

from .forms import ContactForm

logger = logging.getLogger(__name__)


def index(request):
    form = ContactForm()
    return render(request, "portfolio/index.html", {"form": form})



def submit_contact(request):
    """Handle contact form submission."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            # Save to database
            contact_message = form.save()

            # Build email content
            subject = f"New portfolio contact: {contact_message.subject}"
            body = (
                "You have received a new contact message from your portfolio website.\n\n"
                f"Name: {contact_message.name}\n"
                f"Email: {contact_message.email}\n\n"
                f"Subject: {contact_message.subject}\n\n"
                f"Message:\n{contact_message.message}\n\n"
                f"Sent at: {contact_message.timestamp}\n"
            )

            # Try to send email
            try:
                send_mail(
                    subject,
                    body,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.CONTACT_RECIPIENT_EMAIL],
                    fail_silently=False,
                    headers={"Reply-To": contact_message.email},
                )
                messages.success(request, "Your message has been sent successfully!")
            except Exception as e:
                # Log the error for debugging on PythonAnywhere
                logger.exception("Error sending contact form email")
                messages.error(
                    request,
                    "We saved your message, but there was a problem sending the email. "
                    "Please try again later."
                )

            # Go back to the contact section
            return redirect(reverse("home") + "#contact")
        else:
            messages.error(request, "Please correct the errors in the form.")
            # Re-render the same page with errors
            return render(request, "portfolio/index.html", {"form": form})

    # GET or other methods: just go back to home at contact section
    return redirect(reverse("home") + "#contact")


'''
def submit_contact(request):
    """Handle contact form submission."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Your message has been sent successfully!")
            # Go back to the contact section
            return redirect(reverse("home") + "#contact")
        else:
            messages.error(request, "Please correct the errors in the form.")
            # Re-render the same page with errors
            return render(request, "portfolio/index.html", {"form": form})

    # GET or other methods: just go back to home at contact section
    return redirect(reverse("home") + "#contact")
'''