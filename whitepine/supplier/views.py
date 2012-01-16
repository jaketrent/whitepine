from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from whitepine.supplier.models import Supplier, Category

def list(request):
  suppliers = Supplier.objects.all().order_by('title')
  categories = Category.objects.all().order_by('title')
  if (len(categories) > 0):
    first_cat = categories[0]
  return render_to_response("supplier.html", locals(), context_instance=RequestContext(request))
