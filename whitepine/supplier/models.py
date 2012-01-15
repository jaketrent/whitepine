from django.db import models

class Category(models.Model):
  title = models.CharField(max_length=200)
  title_slug = models.SlugField(unique=True)
  image = models.CharField(max_length=500, blank=True, null=True)
  description = models.TextField(max_length=1000, blank=True, null=True)
  class Meta:
    ordering = ["title"]
  def __unicode__(self):
    return u'%s' % (self.title)

class Supplier(models.Model):
  title = models.CharField(max_length=200)
  title_slug = models.SlugField(unique=True)
  category = models.ForeignKey(Category)
  image = models.CharField(max_length=500, blank=True, null=True)
  description = models.TextField(max_length=1000, blank=True, null=True)
  class Meta:
    ordering = ["title"]
  def __unicode__(self):
    return u'%s' % (self.title)
