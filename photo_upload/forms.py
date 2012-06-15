from django.forms import ModelForm
from django import forms
from photo_upload.models import *

class RawPhotoForm(ModelForm):
	class Meta:
		model = Photo
		fields = {'raw_photo',}

class PhotoForm(ModelForm):
	class Meta:
		model = Photo
		exclude = {'approved','raw_photo'}
		
