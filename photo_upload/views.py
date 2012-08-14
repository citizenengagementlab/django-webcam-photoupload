from django.shortcuts import render_to_response
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,HttpResponseBadRequest
from django.core.files.base import ContentFile
from django.conf import settings
from django.shortcuts import render
import json

import re
from django.core.files.base import ContentFile
import tempfile

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
        file_name = "raw_photo.png"
        raw_photo.photo.save(file_name, raw_content_file)
        data = {
            'success': True,
            'file_name': file_name,
            'file_url': raw_photo.photo.url,
            'raw_photo_pk': raw_photo.pk
        }
    else:
        data = {'success': False}
    return HttpResponse(json.dumps(data),mimetype="application/json")
    
@csrf_exempt
def submit(request):
    required_fields = ['name','zip_code','email','captioned_photo']
    for f in required_fields:
        if request.POST.get(f) == "":
            resp = {'message':'%s is required' % f,
                    'field':f}
            return HttpResponseBadRequest(json.dumps(resp),mimetype="application/json")

    #decode the dataurl
    dataurl = request.POST['captioned_photo']
    encoded_photo = re.search(r'base64,(.*)', dataurl).group(1)
    decoded_photo = encoded_photo.decode('base64')

    #save it to a ContentFile
    captioned_content_file = ContentFile(decoded_photo)
    captioned_file_name = "test_upload.png"

    #create the django photo object
    new_photo = Photo.objects.create(name=request.POST.get('name'),
                                    zip_code=request.POST.get('zip_code'),
                                    email=request.POST.get('email'))
    new_photo.captioned_photo.save(captioned_file_name,captioned_content_file)
    new_photo.save()

    resp = {'message':'success'}
    return HttpResponse(json.dumps(resp),mimetype="application/json")
