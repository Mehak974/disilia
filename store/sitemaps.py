from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Category, Product

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'monthly'

    def items(self):
        return ['store:home', 'store:about', 'store:contact', 'store:privacy', 'store:terms']

    def location(self, item):
        return reverse(item)

class CategorySitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Category.objects.all()

class ProductSitemap(Sitemap):
    changefreq = "daily"
    priority = 0.9

    def items(self):
        return Product.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.created_at # Or updated_at if you have it
