from .models import Category

def categories(request):
    """
    Returns all categories with their pre-fetched subcategories 
    to be used in the global navigation mega-menu.
    """
    return {
        'nav_categories': Category.objects.all().prefetch_related('subcategories')
    }
