from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from django.contrib.sites.models import Site

from photo_upload.models import *

from photo_upload.forms import PhotoForm
	
def index(request):
	context = {
		"form": PhotoForm(),
		"photos": Photo.objects.all()
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
	form = Photo(name="test")
	print form
	form.photo = request.POST
	print form.photo
	if request.method == 'POST':
		form.save()
		print form	
	else:
		print "Error"
	return render_to_response("index.html",context,context_instance=RequestContext(request))
	

		
			
			
			
			
			
			