from photo_upload.models import *
from django.contrib import admin

class PhotoCampaignAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("title",)}
	list_display = ['title','description']

class PhotoAdmin(admin.ModelAdmin):
	list_filter = ('approved','campaign')
	list_display = ['name','zip_code','email', 'final_photo','approved']
	list_editable = ['approved',]

admin.site.register(PhotoCampaign, PhotoCampaignAdmin)
admin.site.register(Photo,PhotoAdmin)
