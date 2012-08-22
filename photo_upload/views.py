from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,HttpResponseBadRequest,HttpResponseServerError
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
    campaigns = PhotoCampaign.objects.all()
    return render(request, "list.html", dictionary={'list':campaigns})

def campaign_render(request,slug):
    campaign = get_object_or_404(PhotoCampaign,slug=slug)
    form = PhotoForm(request.POST or None)
    logo = PhotoCampaign.objects.get().logo
    raw_form = RawPhotoForm(request.POST or None)
    if form.is_valid():
        new_photo = form.save()

    response_data = {
        'form': form,
    }

    form = PhotoForm(request.POST or None, request.FILES or None)

    if form.is_valid():
        new_upload = form.save()
    else:
        print form.errors

    context = {
        "photos": Photo.objects.filter(campaign=campaign,approved=True),
        'form': form,
        'raw_form': raw_form,
        "campaign": campaign,
        'logo': logo,
    }

    return render(request, "index.html", dictionary=context)
    
@csrf_exempt
def upload_raw_photo(request,slug):
    if request.method == 'POST':
        raw_photo = RawPhoto()
        if request.FILES and request.FILES['photo']:
            raw_content_file = request.FILES['photo']
        else:
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
        data = {'success': False, 'message':"must post to this url"}
    return HttpResponse(json.dumps(data),mimetype="text/html")
    
@csrf_exempt
def submit(request,slug):
    required_fields = ['name','zip_code','email','captioned_photo','raw_photo_id']
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
    try:
        campaign = PhotoCampaign.objects.get(slug=slug)
        raw_photo = RawPhoto.objects.get(id=request.POST.get('raw_photo_pk'))
    except PhotoCampaign.DoesNotExist:
        resp = {'message':'no such campaign %s' % slug}
        return HttpResponseServerError(json.dumps(resp),mimetype="application/json")

    except RawPhoto.DoesNotExist:
        resp = {'message':'raw photo upload failed','field':""}
        return HttpResponseServerError(json.dumps(resp),mimetype="application/json")

    new_photo = Photo.objects.create(name=request.POST.get('name'),
                                    zip_code=request.POST.get('zip_code'),
                                    email=request.POST.get('email'),
                                    message = request.POST.get('message'),
                                    campaign=campaign,
                                    raw_photo=raw_photo)
    try:
        new_photo.captioned_photo.save(captioned_file_name,captioned_content_file)
        new_photo.save()
        resp = {'message':'success'}
    except Exception:
        resp = {"message":"error"}

    return HttpResponse(json.dumps(resp),mimetype="application/json")
