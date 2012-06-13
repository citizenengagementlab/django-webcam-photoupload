from django.db import models


class Photo(models.Model):
	name = models.CharField(max_length=50)
	zip_code =  models.CharField(max_length=5)
	email = models.EmailField(max_length=75)
	message = models.TextField(max_length=255)
	raw_photo = models.FileField(upload_to="raws/")
	captioned_photo = models.FileField(upload_to="captioned/")
	approved = models.BooleanField()
	#Set up model now that you have added an additional image upload field.  Make sure you hide the new field from the form.

	def __unicode__(self):
		return "%s, %s, %s, %s, %s" % (self.name, self.zip_code, self.email, self.message, self.photo)
		