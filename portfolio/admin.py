from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "status", "timestamp")
    list_filter = ("status", "timestamp")
    search_fields = ("name", "email", "subject", "message")
    ordering = ("-timestamp",)
