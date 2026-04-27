from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Category, Subcategory, Product

def search(request):
    query = request.GET.get('q', '')
    products = Product.objects.filter(is_active=True)
    
    if query:
        products = products.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) |
            Q(subcategory__name__icontains=query) |
            Q(subcategory__category__name__icontains=query)
        )
    
    context = {
        'products': products,
        'query': query,
    }
    return render(request, 'catalog/search_results.html', context)


def home(request):
    """Render the immersive home page with featured products."""
    featured_products = Product.objects.select_related('subcategory__category').filter(is_active=True, is_featured=True)[:12]
    elite_collection = Product.objects.select_related('subcategory__category').filter(is_active=True).order_by('?')[:8]
    categories = Category.objects.all()
    return render(request, 'home.html', {
        'featured_products': featured_products,
        'elite_collection': elite_collection,
        'all_categories': categories,
        'cursor_emoji': '✨',
    })


def catalog(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(is_active=True)
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(subcategory__category=category)
    return render(request, 'catalog/catalog.html', {
        'category': category,
        'all_categories': categories,
        'products': products,
    })


def product_detail(request, category_slug, product_slug):
    product = get_object_or_404(Product, slug=product_slug, is_active=True)
    similar = Product.objects.filter(
        subcategory=product.subcategory, is_active=True
    ).exclude(pk=product.pk)[:8]
    return render(request, 'catalog/product_detail.html', {
        'product': product,
        'similar_products': similar,
    })


def cart_detail(request):
    return render(request, 'catalog/cart.html')


def checkout(request):
    return render(request, 'catalog/checkout.html')


def about(request):
    return render(request, 'pages/about.html', {'cursor_emoji': 'ℹ️'})


def contact(request):
    return render(request, 'pages/contact.html', {'cursor_emoji': '✉️'})


def page_privacy(request):
    return render(request, 'pages/privacy.html', {'cursor_emoji': '⚖️'})


def page_cookies(request):
    return render(request, 'pages/cookies.html', {'cursor_emoji': '🍪'})


def page_terms(request):
    return render(request, 'pages/terms.html', {'cursor_emoji': '📋'})


def page_return(request):
    return render(request, 'pages/return.html', {'cursor_emoji': '📦'})


# ── Category views ──────────────────────────────────────────────────────────

from django.core.paginator import Paginator

def _category_view(request, cat_slug, template, cursor='👟'):
    """Helper to render category collection pages."""
    category   = get_object_or_404(Category, slug=cat_slug)
    subcats    = Subcategory.objects.filter(category=category)
    active_sub = request.GET.get('sub', '')
    all_products = Product.objects.select_related('subcategory__category').filter(
        subcategory__category=category, is_active=True
    ).order_by('-created_at')
    
    if active_sub:
        all_products = all_products.filter(subcategory__slug=active_sub)
    
    # Pagination
    paginator = Paginator(all_products, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)

    most_selling = Product.objects.select_related('subcategory__category').filter(
        subcategory__category=category, is_active=True, is_featured=True
    )[:8]
    
    return render(request, template, {
        'category':      category,
        'subcategories': subcats,
        'active_sub':    active_sub,
        'products':      products,
        'most_selling':  most_selling,
        'all_categories': Category.objects.all(),
        'cursor_emoji':  cursor,
    })


def supplements(request):
    return _category_view(request, 'health-supplements', 'catalog/category_base.html', '💊')

def pet_care(request):
    return _category_view(request, 'pet-care', 'catalog/category_base.html', '🐾')

def home_garden(request):
    return _category_view(request, 'home-garden', 'catalog/category_base.html', '🏡')

def beauty(request):
    return _category_view(request, 'beauty-personal-care', 'catalog/category_base.html', '💆‍♀️')

def tools(request):
    return _category_view(request, 'tools', 'catalog/category_base.html', '🔧')

def toys(request):
    return _category_view(request, 'toys', 'catalog/category_base.html', '🧸')
