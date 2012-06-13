from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.http import HttpRequest, HttpResponse
from django.contrib.sites.models import Site

from photo_upload.models import *

from photo_upload.forms import PhotoForm
	
def index(request):
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
	return render_to_response("index.html",context,context_instance=RequestContext(request))
	
@csrf_exempt
def save_raw_image(request):
	context = {}
	if request.method == 'POST':
		print raw_post_data
		Photo.photo.save("/uploads/",ContentFile(request.raw_post_data)) #trying to save a file to my uploads model in my photo directory.  pretty sure its already a jpeg so i can just save it the request.POST?  raw_post_data didn't work - not sure it is a real thing.
		print "Cool"
	else:
		print "Error"
	return render_to_response("index.html",context,context_instance=RequestContext(request))
	

		
			
			
			
			
			
			