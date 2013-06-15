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

#from ak_support.views import ak_connect,validate_token

from models import *
from forms import *

#TODO:  use os and change directory to parent presente_vote, so that from racewatch.models CampaignPartners 
#can be imported, subsequently allowing us to add partner links into the base template without hardcoding.

    
def index(request):
    campaigns = PhotoCampaign.objects.all()
    return render(request, "list.html", dictionary={'list':campaigns})

def campaign_render(request,slug):
    campaign = get_object_or_404(PhotoCampaign,slug=slug)
    form = PhotoForm(request.POST or None)
    logo = PhotoCampaign.objects.get().logo
    raw_form = RawPhotoForm(request.POST or None)
    context = {}

#    akid = request.GET.get('akid')

#    if akid:
#        ak = ak_connect()
#        user = ak.User.get({'akid':request.GET.get('akid')})
#        if user:
#            context['user'] = user
#            context['recognized'] = True
#        else:
#            context['recognized'] = False

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
            raw_content_file = ContentFile(request.body)
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
                                    raw_photo=raw_photo,)
                                    #akid=request.POST.get('akid'))
    try:
        new_photo.captioned_photo.save(captioned_file_name,captioned_content_file)
#        if new_photo.akid:
#           new_photo.approved = True
        new_photo.save()
        resp = {'message':'success'}
    except Exception:
        resp = {"message":"error"}

#
#    if new_photo.campaign.ak_page_name:
#        #now act on the user
#        ak = ak_connect()
#        act_dict = {'email': new_photo.email,
#                    'postal':new_photo.zip_code,
#                    'page': new_photo.campaign.ak_page_name}
#        if not new_photo.akid:
#            act_dict['name'] = new_photo.name
#        else:
#            pass
#            #because we are shortening the displayed name for recognized users
#            #don't want to overwrite good data with bad
#
#        #some issues with Python 2.7 and xmlrpc... I am not adept enough at Python to know what to fix here, sadly.
#   
#        ak.act(act_dict)


    return HttpResponse(json.dumps(resp),mimetype="application/json")
