from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(ModelAdmin):
    list_display = ['user', 'phone_number']
