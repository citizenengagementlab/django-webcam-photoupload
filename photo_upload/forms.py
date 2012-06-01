from django.forms import ModelForm
from django import forms
from photo_upload.models import *

class PhotoForm(ModelForm):
	class Meta:
		model = Photo
	