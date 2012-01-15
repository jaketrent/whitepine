from django.conf.urls.defaults import patterns, include, url
from whitepine.supplier.views import *

urlpatterns = patterns('',
  url(r'^$', list, name="suppliers"),
)
