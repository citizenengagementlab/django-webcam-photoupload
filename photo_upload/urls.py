from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url (r'^usps/',include('ziplookup.urls')),
)

urlpatterns += patterns('photo_upload.views',
    (r'^$', 'index'),
    (r'^(?P<slug>[\w-]+)/$', 'campaign_render'),
    (r'^(?P<slug>[\w-]+)/upload_raw_photo$', 'upload_raw_photo'), #make sure no trailing slash
    (r'^(?P<slug>[\w-]+)/submit$', 'submit')

)

if settings.DEBUG:
    # quick fix for the fact that my media files are being served by static URL
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT}))