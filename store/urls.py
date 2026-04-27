from django.urls import path
from . import views

app_name = 'store'

urlpatterns = [
    path('', views.home, name='home'),
    path('search/', views.search, name='search'),
    path('catalog/', views.catalog, name='catalog_all'),
    path('catalog/<slug:category_slug>/', views.catalog, name='catalog_category'),
    path('catalog/<slug:category_slug>/<slug:product_slug>/', views.product_detail, name='product_detail'),
    path('cart/', views.cart_detail, name='cart_detail'),
    path('checkout/', views.checkout, name='checkout'),
    
    # Static pages
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('privacy-policy/', views.page_privacy, name='privacy'),
    path('cookies-policy/', views.page_cookies, name='cookies'),
    path('terms-conditions/', views.page_terms, name='terms'),
    path('return-policy/', views.page_return, name='return'),
    
    # Specific category pages
    path('supplements/', views.supplements, name='supplements'),
    path('pet-care/', views.pet_care, name='pet_care'),
    path('home-garden/', views.home_garden, name='home_garden'),
    path('beauty/', views.beauty, name='beauty'),
    path('tools/', views.tools, name='tools'),
    path('toys/', views.toys, name='toys'),
]
