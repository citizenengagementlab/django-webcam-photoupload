from django.db import models


class Photo(models.Model):
	name = models.CharField(max_length=50)
	zip_code =  models.CharField(max_length=5)
	email = models.EmailField(max_length=75)
	message = models.TextField(max_length=255)
	photo = models.FileField(upload_to="uploads/")
	approved = models.BooleanField()
	
	def __unicode__(self):
		return "%s, %s: %s" % (self.name, self.zip_code, self.email)
		
