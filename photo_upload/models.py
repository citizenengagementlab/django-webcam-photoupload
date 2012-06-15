from django.db import models

class TextBox(models.Model):
	title = models.CharField(max_length=50)
	description = models.CharField(max_length=460)
	
	def __unicode__(self):
		return "%s, %s" % (self.title, self.description,)
	
	def get_title(self):
		return "%s" % self.title
	
	def get_description(self):
		return "%s" % self.description

class Photo(models.Model):
	name = models.CharField(max_length=50)
	zip_code =  models.CharField(max_length=5)
	email = models.EmailField(max_length=75)
	# message = models.TextField(max_length=255)
	raw_photo = models.FileField(upload_to="raws/")
	captioned_photo = models.FileField(upload_to="captioned/")
	approved = models.BooleanField()

	def __unicode__(self):
		return "%s, %s, %s" % (self.name, self.zip_code, self.email,)
		