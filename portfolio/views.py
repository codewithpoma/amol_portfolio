from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages

from .forms import ContactForm


def index(request):
    form = ContactForm()
    return render(request, "portfolio/index.html", {"form": form})


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
