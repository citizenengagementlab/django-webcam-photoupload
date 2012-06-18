from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.conf import settings
from django.shortcuts import render
import json
import md5


from photo_upload.models import *
from photo_upload.forms import *
	

def index(request):
    textbox = TextBox.objects.all()
    form = PhotoForm(request.POST or None)

    if form.is_valid():
        new_photo = form.save()

    response_data = {
        'form': form
    }

    form = PhotoForm(request.POST or None, request.FILES or None)

    if form.is_valid():
        new_upload = form.save()
    else:
        print form.errors

    context = {
        "photos": Photo.objects.filter(approved=True),
        'form': form,
        "textbox": textbox,
    }

    return render(request, "index.html", dictionary=context)
	
@csrf_exempt
def upload_raw_photo(request):
	if request.method == 'POST':
 		raw_photo = RawPhoto()
 		raw_content_file = ContentFile(request.raw_post_data)
 		file_name = "test.jpg"
 		raw_photo.photo.save(file_name, raw_content_file)
 		data = {
 			'success': True,
 			'file_name': file_name,
 			'file_url': raw_photo.photo.url,
 			'raw_photo_pk': raw_photo.pk
 		}
 	else:
 		data = {'success': False}
	return HttpResponse(json.dumps(data))
	
@csrf_exempt
def submit(request):
	form = PhotoForm()
	if request.method == 'POST':
		form = PhotoForm(request.POST or None, request.FILES or None)
		if form.is_valid():
			new_upload = form.save()
		else:
			print form.errors
 	else:
 		print form.errors
	return HttpResponse(form.save())
			

# captioned_photo = CaptionedPhoto()
# 		captioned_content_file = ContentFile(request.raw_post_data)
# 		file_name = "test_final.jpg"
# 		captioned_photo.photo.save(file_name, captioned_content_file)
# 		data = {
#  			'success': True,
#  			'file_name': file_name,
#  			'file_url': captioned_photo.photo.url,
#  			'captioned_photo_pk': captioned_photo.pk
#  		}			
# 			