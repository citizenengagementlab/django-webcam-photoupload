from django.forms import ModelForm
from django import forms
from models import *

class PhotoForm(ModelForm):
	class Meta:
		model = Photo
		exclude = {'approved',}
		widgets = {
            'message': forms.Textarea(attrs={'cols': 80, 'rows': 20}),
        }
		
class RawPhotoForm(ModelForm):
	class Meta:
		model = RawPhoto