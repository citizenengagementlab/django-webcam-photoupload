from models import *
from django.contrib import admin

from django import forms 

#override CharField to show a TextArea instead.  We want to cut message length so people can't type too much onto the canvas
#but a single text input is obnoxious.

class PhotoMessageModelForm(forms.ModelForm):
	message = forms.CharField(widget=forms.Textarea)
	class Meta:
		model = Photo

class PhotoCampaignAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("title",)}
	list_display = ['title','description']

class PhotoAdmin(admin.ModelAdmin):
	form = PhotoMessageModelForm
	list_filter = ('approved','campaign')
	list_display = ['final_photo','approved']
	list_editable = ['approved',]

admin.site.register(PhotoCampaign, PhotoCampaignAdmin)
admin.site.register(Photo,PhotoAdmin)
