from django.contrib import admin
from whitepine.supplier.models import Supplier, Category

class CategoryAdmin(admin.ModelAdmin):
  list_display = ['title']
  prepopulated_fields = {'title_slug': ('title',)}
  search_fields = ['title','description']
  fieldsets = (
    (None, {
        'classes': ('',),
        'fields': ('title', 'title_slug',)
    }),
    ('Other', {
        'classes': ('',),
        'fields': ('image', 'description',)
    }),
  )

class SupplierAdmin(admin.ModelAdmin):
  list_display = ['title']
  prepopulated_fields = {'title_slug': ('title',)}
  search_fields = ['title','description']
  fieldsets = (
    (None, {
        'classes': ('',),
        'fields': ('title', 'title_slug','website','category',)
    }),
    ('Other', {
        'classes': ('',),
        'fields': ('image', 'description',)
    }),
  )


admin.site.register(Category, CategoryAdmin)
admin.site.register(Supplier, SupplierAdmin)