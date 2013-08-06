===========
Webcam Photo Upload
===========

Written mostly by Mike Vattuone at Citizen Engagement Laboratory, with support from Josh Levinger.

This is a tool that allows people to take a photo from the browser, add a caption that will attach a logo of your choice, and submit it.  When an admin approves the image, it will render on the photo campaign index page.  Think of this as an out of the box 'wearethe99percent', without having to sign up for Tumblr and deal with their limits on photo submissions.

In the future, there may or may not be integration using the Actionkit CRM, as that is what we use at CEL, and this might allow people to instantly see their image upload without requiring approval.

Installation
=========

Pretty dang easy:

* Add 'photo_upload' and 'ziplookup' to your INSTALLED_APPS. Yes, we will merge these at some point.

* SyncDB (this will load fixtures from ziplookup, which might take a sec since it's a json file full of zipcodes)

* Add the app to your urls.py
urlpatterns = patterns('',
	url(r'^photo/', include('photo_upload.urls'))
)

* In the admin, create a Photo Campaign, including an example photo and logo, and view the campaign index page or take a picture at yourdomain.com/photo/campaign_slug

* ...profit?  

While I am imagining a system that will easily integrate with your base template and make it so that you don't have to do any front-end to get this to play nicely, this is probably idealistic.  One thing we could try to do is create a TEMPLATE_PATH in which you would render your photo_upload views to, but this will be something for later on...


Get involved
=========

Have an idea for how to make this more useful?  A handy abstraction?  Please let me know!  I will have this in a public repo on Github at some point.


