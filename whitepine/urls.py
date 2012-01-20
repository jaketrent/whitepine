from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', direct_to_template, {'template': 'index.html'}, name="index"),
    url(r'^favicon\.ico$', 'django.views.generic.simple.redirect_to', {'url': '/static/img/favicon.ico'}),
    url(r'^portfolio/$', direct_to_template, {'template': 'portfolio.html'}, name="portfolio"),
    url(r'^suppliers/$', include('supplier.urls')),
    url(r'^about/$', direct_to_template, {'template': 'about.html'}, name="about"),
    url(r'^contact/$', direct_to_template, {'template': 'contact.html'}, name="contact"),
    url(r'^policies/$', direct_to_template, {'template': 'policies.html'}, name="policies"),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)


if settings.DEBUG is False:
    urlpatterns += patterns('',
        url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    )
elif settings.DEBUG is True:
    urlpatterns += staticfiles_urlpatterns()