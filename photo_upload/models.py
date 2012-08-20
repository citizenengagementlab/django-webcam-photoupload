from django.db import models
from django.core.files.storage import FileSystemStorage

media = FileSystemStorage()

class PhotoCampaign(models.Model):
	title = models.CharField(max_length=50)
	slug = models.SlugField()
	logo = models.ImageField(upload_to='logos/', null=True, blank=True)
	description = models.TextField()
	default_message = models.TextField(null=True,blank=True)
	example_photo = models.ImageField(upload_to='examples/',null=True,blank=True)
	
	def __unicode__(self):
		return '%s, %s' % (self.title, self.description,)
	
	def get_title(self):
		return '%s' % self.title
	
	def get_description(self):
		return '%s' % self.description

class RawPhoto(models.Model):
	photo = models.ImageField(upload_to='raws/', storage=media)

class Photo(models.Model):
	campaign = models.ForeignKey(PhotoCampaign)
	name = models.CharField(max_length=50)
	zip_code = models.CharField(max_length=5)
	email = models.EmailField(max_length=75)
	message = models.TextField(null=True,blank=True)
	raw_photo = models.ForeignKey(RawPhoto, related_name="original_photo")
	captioned_photo = models.ImageField(upload_to='captioned/', storage=media)
	approved = models.BooleanField()

	def final_photo(self):
		return '<img src="/media/%s" width="320" height="240" />' % self.captioned_photo
	final_photo.allow_tags = True
		
	def __unicode__(self):
		return "%s, %s, %s" % (self.name, self.zip_code, self.email,)
