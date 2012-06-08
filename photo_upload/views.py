from django.shortcuts import render_to_response
from django.template import RequestContext
from photo_upload.models import *
from photo_upload.forms import PhotoForm


def home(request):
	photos = Photo.objects.filter(approved=True)
	name = Photo.objects.filter(approved=True)
	context = {
		"photos": photos,
		"name": name,
	}
	return render_to_response("home.html",context,context_instance=RequestContext(request))
	
	
def upload(request):
	context = {
		"form": PhotoForm(),
	}
	if request.method == 'POST':
		form = PhotoForm(request.POST, request.FILES)
		if form.is_valid():
			new_upload = form.save()
		else:
			context['form'] = form
			print form.errors
	return render_to_response("upload.html",context,context_instance=RequestContext(request))