from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from whitepine.supplier.models import Supplier, Category

def list(request):
  suppliers = Supplier.objects.all()
  categories = Category.objects.all()
  return render_to_response("supplier.html", locals(), context_instance=RequestContext(request))
