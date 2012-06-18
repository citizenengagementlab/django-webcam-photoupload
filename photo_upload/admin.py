from photo_upload.models import *
from django.contrib import admin

class TextBoxAdmin(admin.ModelAdmin):
	list_display = ['title','description']

class PhotoAdmin(admin.ModelAdmin):
	list_display = ['name','zip_code','email']


admin.site.register(Photo,PhotoAdmin)
admin.site.register(TextBox, TextBoxAdmin)
admin.site.register(CaptionedPhoto)