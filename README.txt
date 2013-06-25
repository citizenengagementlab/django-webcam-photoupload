===========
Webcam Photo Upload
===========

Written mostly by Mike Vattuone at Citizen Engagement Laboratory, with support from Josh Levinger.

This webcam photo upload tool provides a tool for people to upload a picture of themselves, just as they are reading and learning about your campaign, and share their support or opposition to a cause or person.  

Installation
=========

Pretty dang simple:

* Add 'photo_upload' and 'ziplookup' to your INSTALLED_APPS.

* SyncDB

* Load fixtures from ziplookup.  This adds a ton of zip codes to a model 
in the database, which will convert your zip codes into a city and state.
(we will likely figure out a way to make this automatic in an upcoming release.)

* Add the app to your urls.py
urlpatterns = patterns('',
	url(r'^photo/', include('photo_upload.urls'))
)

* ...profit?  Not really sure what you'll have to do to make this work nicely, quite yet... 


Get involved
=========

We're still kind of figuring out how to organize this bad boy, so any and all suggestions to the structure of the project would be more than welcome.  :)


