from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('photo_upload.views',
    (r'^$', 'index'),
    (r'^upload_raw_photo', 'upload_raw_photo'),
    (r'^submit', 'submit')

)

if settings.DEBUG:
    # quick fix for the fact that my media files are being served by static URL
    urlpatterns += patterns('',
        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
        'document_root': settings.MEDIA_ROOT}))