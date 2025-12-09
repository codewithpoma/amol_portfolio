from django.db import models


class ContactMessage(models.Model):
    STATUS_CHOICES = (
        ('new', 'New'),
        ('read', 'Read'),
    )

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='new'
    )

    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.name} — {self.subject}"
