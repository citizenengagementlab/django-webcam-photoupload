from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage

class TextBox(models.Model):
	title = models.CharField(max_length=50)
	description = models.CharField(max_length=460)
	
	def __unicode__(self):
		return '%s, %s' % (self.title, self.description,)
	
	def get_title(self):
		return '%s' % self.title
	
	def get_description(self):
		return '%s' % self.description


media = FileSystemStorage()

class RawPhoto(models.Model):
	photo = models.ImageField(upload_to='raws/', storage=media)

class CaptionedPhoto(models.Model):
	photo = models.ImageField(upload_to='captioned/', storage=media)

class Photo(models.Model):
	name = models.CharField(max_length=50)
	zip_code = models.CharField(max_length=5)
	email = models.EmailField(max_length=75)
	raw_photo = models.ForeignKey(RawPhoto, related_name='raw_photo')
	captioned_photo = models.ForeignKey(CaptionedPhoto, related_name='captioned_photo')
	approved = models.BooleanField()

	def __unicode__(self):
		return "%s, %s, %s" % (self.name, self.zip_code, self.email,)
	