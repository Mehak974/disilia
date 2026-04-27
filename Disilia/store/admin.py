from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Category, Subcategory, Product, Order, OrderItem

@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Subcategory)
class SubcategoryAdmin(ModelAdmin):
    list_display = ['name', 'category', 'slug']
    list_filter = ['category']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = ['name', 'subcategory', 'price', 'stock', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'subcategory__category', 'subcategory']
    list_editable = ['price', 'stock', 'is_active']
    prepopulated_fields = {'slug': ('name',)}

class OrderItemInline(TabularInline):
    model = OrderItem
    raw_id_fields = ['product']

@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ['id', 'user', 'first_name', 'last_name', 'email', 'address', 'city', 'paid', 'created_at']
    list_filter = ['paid', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
