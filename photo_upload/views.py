from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from photo_upload.models import *

from photo_upload.forms import *
	

def index(request):
	textbox = TextBox.objects.all()
	context = {
		"form": PhotoForm(),
		"photos": Photo.objects.filter(approved=True),
		"textbox": textbox,
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
	textbox = TextBox.objects.all()
	context = {
		"form": RawPhotoForm(),
		"photos": Photo.objects.filter(approved=True),
		"textbox": textbox,
	}
	if request.method == 'POST':
		#I thought certain file types were returned as request.FILE, rather than POST.  This part is still a bit mysterious to me.
		form = RawPhotoForm(request.POST, request.FILES)
		if form.is_valid():
			new_upload = form.save(commit=False)
			return HttpResponseRedirect("raws/")
		else:
			context['form'] = form
			print form.errors
		#Save object reference to new Photo instance, with the property raw_photo only, and upload file to server in raw directory.  We want to pass this back too, so I assume that would be something we add to the context...
	else:
		print "Error"
	return render_to_response("index.html",context,context_instance=RequestContext(request))
			
			
			
			