from photo_upload.models import *
from django.contrib import admin

class PhotoAdmin(admin.ModelAdmin):
	list_display = ['name','zip_code','email']

admin.site.register(Photo,PhotoAdmin)

