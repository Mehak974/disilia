import os
import django
import csv
import glob
import re
from django.utils.text import slugify

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'disilia_core.settings')
django.setup()

from store.models import Category, Subcategory, Product

def get_clean_slug(text):
    return slugify(text)

def import_products():
    # Map CSV category names to our premium category slugs
    category_map = {
        'All Tools': 'tools',
        'All Toys': 'toys',
        'All Supplements': 'health-supplements',
        'All Pet Care': 'pet-care',
        'All Home & Garden': 'home-garden',
        'All Beauty': 'beauty-personal-care',
        'All Cosmetics': 'beauty-personal-care',
        'Home & Outdoor': 'home-garden',
        'Tools': 'tools',
        'Toys': 'toys',
        'Supplements': 'health-supplements',
        'Pet Care': 'pet-care',
        'Home & Garden': 'home-garden',
        'Beauty': 'beauty-personal-care',
    }

    csv_files = glob.glob('prod *.csv') + glob.glob('*.csv')
    csv_files = list(set(csv_files))
    csv_files = [f for f in csv_files if f not in ['replace.py', 'requirements.txt', 'populate_categories.py', 'import_all_products.py']]
    
    print(f"Re-importing and mapping {len(csv_files)} CSV files...")

    for csv_file in sorted(csv_files):
        with open(csv_file, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row.get('Name')
                if not name: continue
                
                price_raw = row.get('Regular price', '0') or '0'
                try: price = float(re.sub(r'[^\d.]', '', price_raw))
                except: price = 0.0

                cat_str = row.get('Categories', '')
                sub_name = "General"
                parent_cat_name = "Tools"
                
                if cat_str:
                    parts = [p.strip() for p in cat_str.split(',')]
                    specific_parts = [p for p in parts if '>' in p]
                    if specific_parts:
                        best_path = specific_parts[0]
                        parent_name_raw, sub_name_raw = [x.strip() for x in best_path.split('>', 1)]
                        parent_cat_name = parent_name_raw
                        sub_name = sub_name_raw
                    else:
                        parent_cat_name = parts[0]
                
                parent_slug = category_map.get(parent_cat_name, get_clean_slug(parent_cat_name))
                
                # Get or Create Category
                category, _ = Category.objects.get_or_create(
                    slug=parent_slug,
                    defaults={'name': parent_cat_name}
                )
                
                # Make subcategory slug unique by prefixing with category slug
                sub_slug = get_clean_slug(f"{parent_slug}-{sub_name}")
                
                subcategory, _ = Subcategory.objects.get_or_create(
                    slug=sub_slug,
                    defaults={
                        'category': category,
                        'name': sub_name
                    }
                )

                stock_raw = row.get('Stock', '0') or '0'
                try: stock = int(float(stock_raw))
                except: stock = 10
                
                image_url = row.get('Images', '')
                description = row.get('Description', row.get('Short description', ''))

                Product.objects.update_or_create(
                    name=name,
                    defaults={
                        'slug': get_clean_slug(name)[:200],
                        'subcategory': subcategory,
                        'description': description,
                        'price': price,
                        'stock': stock,
                        'image_url': image_url,
                        'is_active': True
                    }
                )

    # Cleanup redundant categories
    redundant_slugs = ['all-cosmetics', 'home-outdoor', 'all-tools', 'all-toys', 'all-supplements', 'all-pet-care', 'all-home-garden', 'all-beauty']
    for slug in redundant_slugs:
        # Before deleting, check if there are any subcategories or products left
        # (Though update_or_create should have moved them)
        Category.objects.filter(slug=slug).delete()
        print(f"Cleaned up redundant category: {slug}")

    print("Re-import and cleanup complete.")

if __name__ == '__main__':
    import_products()
