from django.core.management.base import BaseCommand
from store.models import Category, Subcategory, Product


SEED = [
    {
        "name": "Health & Supplements",
        "slug": "health-supplements",
        "emoji": "💊",
        "tagline": "Fuel your body with science-backed daily essentials.",
        "hero_gradient": "135deg,#fff7e6 0%,#ffe4b0 50%,#ffd580 100%",
        "subcategories": [
            {
                "name": "Vitamins & Minerals",
                "slug": "vitamins-minerals",
                "products": [
                    ("Vitamin D3 5000 IU", 18.99, True),
                    ("Magnesium Glycinate 400mg", 22.49, True),
                    ("Zinc & Copper Complex", 14.99, False),
                    ("B-Complex Energy Blend", 19.99, True),
                ],
            },
            {
                "name": "Protein & Sports",
                "slug": "protein-sports",
                "products": [
                    ("Whey Protein Isolate – Vanilla", 49.99, True),
                    ("Creatine Monohydrate 500g", 29.99, False),
                    ("Pre-Workout Formula", 34.99, True),
                    ("BCAA Recovery Powder", 27.99, False),
                ],
            },
            {
                "name": "Herbal & Adaptogens",
                "slug": "herbal-adaptogens",
                "products": [
                    ("Ashwagandha KSM-66 600mg", 24.99, True),
                    ("Lions Mane Mushroom Extract", 31.50, False),
                    ("Turmeric & Black Pepper", 16.99, True),
                    ("Rhodiola Rosea 500mg", 19.99, False),
                ],
            },
            {
                "name": "Omega & Heart Health",
                "slug": "omega-heart",
                "products": [
                    ("Omega-3 Fish Oil 1000mg", 21.99, False),
                    ("CoQ10 Ubiquinol 200mg", 38.99, True),
                    ("Krill Oil Premium", 42.00, True),
                ],
            },
        ],
    },
    {
        "name": "Pet Care",
        "slug": "pet-care",
        "emoji": "🐾",
        "tagline": "Everything your furry family deserves.",
        "hero_gradient": "135deg,#e8f5e9 0%,#c8e6c9 50%,#a5d6a7 100%",
        "subcategories": [
            {
                "name": "Dog Essentials",
                "slug": "dog-essentials",
                "products": [
                    ("Premium Dry Dog Food 5kg", 39.99, True),
                    ("Dental Chews Variety Pack", 14.99, True),
                    ("Retractable Dog Leash", 19.99, False),
                    ("Orthopedic Memory Foam Bed", 64.99, True),
                ],
            },
            {
                "name": "Cat Essentials",
                "slug": "cat-essentials",
                "products": [
                    ("Grain-Free Cat Food 2kg", 29.99, True),
                    ("Interactive Laser Toy", 12.49, False),
                    ("Self-Cleaning Litter Box", 89.99, True),
                    ("Cat Tree & Scratching Post", 54.99, False),
                ],
            },
            {
                "name": "Pet Grooming",
                "slug": "pet-grooming",
                "products": [
                    ("Deshedding Brush Pro", 22.99, True),
                    ("Natural Pet Shampoo", 11.99, False),
                    ("Pet Nail Grinder", 18.99, True),
                ],
            },
        ],
    },
    {
        "name": "Home & Garden",
        "slug": "home-garden",
        "emoji": "🏡",
        "tagline": "Transform your space into a sanctuary.",
        "hero_gradient": "135deg,#e3f2fd 0%,#bbdefb 50%,#90caf9 100%",
        "subcategories": [
            {
                "name": "Indoor Decor",
                "slug": "indoor-decor",
                "products": [
                    ("Minimalist Ceramic Vase Set", 34.99, True),
                    ("Linen Throw Pillow 2-Pack", 27.99, True),
                    ("Geometric Wall Art Print", 19.99, False),
                    ("Handwoven Jute Area Rug", 89.99, True),
                ],
            },
            {
                "name": "Garden & Outdoor",
                "slug": "garden-outdoor",
                "products": [
                    ("Solar LED Path Lights 8-Pack", 32.99, True),
                    ("Stainless Steel Planters Set", 44.99, False),
                    ("Vertical Pocket Garden Planter", 24.99, True),
                    ("Teak Outdoor Garden Bench", 199.99, True),
                ],
            },
            {
                "name": "Scents & Candles",
                "slug": "scents-candles",
                "products": [
                    ("Soy Wax Candle – Amber & Oud", 22.99, True),
                    ("Reed Diffuser Set Vanilla", 18.99, False),
                    ("Aromatherapy Essential Oil Kit", 29.99, True),
                ],
            },
        ],
    },
    {
        "name": "Beauty & Personal Care",
        "slug": "beauty-personal-care",
        "emoji": "✨",
        "tagline": "Radiant, confident, effortlessly you.",
        "hero_gradient": "135deg,#fce4ec 0%,#f8bbd0 50%,#f48fb1 100%",
        "subcategories": [
            {
                "name": "Skin Care",
                "slug": "skin-care",
                "products": [
                    ("Hyaluronic Acid Serum 30ml", 28.99, True),
                    ("Vitamin C Brightening Cream", 34.99, True),
                    ("SPF 50 Daily Moisturiser", 21.99, False),
                    ("Retinol Night Recovery Cream", 42.99, True),
                ],
            },
            {
                "name": "Hair Care",
                "slug": "hair-care",
                "products": [
                    ("Argan Oil Repair Shampoo", 16.99, False),
                    ("Keratin Deep Conditioning Mask", 22.99, True),
                    ("Ionic Hair Dryer Pro", 79.99, True),
                    ("Bamboo Paddle Brush", 14.99, False),
                ],
            },
            {
                "name": "Makeup Essentials",
                "slug": "makeup-essentials",
                "products": [
                    ("Longwear Foundation SPF 15", 31.99, True),
                    ("Velvet Matte Lip Collection", 19.99, True),
                    ("Precision Brow Kit", 17.99, False),
                ],
            },
        ],
    },
    {
        "name": "Tools",
        "slug": "tools",
        "emoji": "🔧",
        "tagline": "Built for those who build things.",
        "hero_gradient": "135deg,#eceff1 0%,#cfd8dc 50%,#b0bec5 100%",
        "subcategories": [
            {
                "name": "Hand Tools",
                "slug": "hand-tools",
                "products": [
                    ("Pro 40-Piece Socket Set", 64.99, True),
                    ("Ergonomic Screwdriver Kit 12pc", 29.99, True),
                    ("Heavy Duty Utility Knife", 12.99, False),
                    ("Magnetic Wristband Tool Holder", 9.99, True),
                ],
            },
            {
                "name": "Power Tools",
                "slug": "power-tools",
                "products": [
                    ("Cordless Drill 18V Brushless", 119.99, True),
                    ("Orbital Sander 220W", 59.99, False),
                    ("Rotary Multi-Tool Kit", 74.99, True),
                ],
            },
            {
                "name": "Storage & Organization",
                "slug": "storage-organization",
                "products": [
                    ("Rolling Tool Cabinet 4-Drawer", 149.99, True),
                    ("Pegboard Wall Organizer Kit", 34.99, False),
                    ("Stackable Tool Tray Set", 19.99, True),
                ],
            },
        ],
    },
    {
        "name": "Toys",
        "slug": "toys",
        "emoji": "🧸",
        "tagline": "Playful, educational, endlessly fun.",
        "hero_gradient": "135deg,#ede7f6 0%,#d1c4e9 50%,#b39ddb 100%",
        "subcategories": [
            {
                "name": "Educational Toys",
                "slug": "educational-toys",
                "products": [
                    ("STEM Robotics Kit for Kids 8+", 49.99, True),
                    ("Magnetic Tiles Building Set 64pc", 39.99, True),
                    ("Junior Chess & Strategy Games", 22.99, False),
                    ("Globe with LED Night Light", 29.99, True),
                ],
            },
            {
                "name": "Outdoor Play",
                "slug": "outdoor-play",
                "products": [
                    ("Beginner Skateboard Complete", 44.99, True),
                    ("Water Balloon Launcher Kit", 14.99, False),
                    ("Balance Bike for Toddlers", 69.99, True),
                ],
            },
            {
                "name": "Plush & Collectibles",
                "slug": "plush-collectibles",
                "products": [
                    ("Giant Plush Teddy Bear 60cm", 34.99, True),
                    ("Dinosaur Collectible Figure Set", 19.99, False),
                    ("Soft Sensory Fidget Cube", 9.99, True),
                ],
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed the database with demo categories, subcategories, and products."

    def handle(self, *args, **options):
        created_cats = 0
        created_subs = 0
        created_prods = 0

        for cat_data in SEED:
            cat, new = Category.objects.get_or_create(
                slug=cat_data["slug"],
                defaults={
                    "name": cat_data["name"],
                    "emoji": cat_data["emoji"],
                    "tagline": cat_data["tagline"],
                    "hero_gradient": cat_data["hero_gradient"],
                    "description": cat_data["tagline"],
                },
            )
            if new:
                created_cats += 1
            else:
                # Update fields if category already exists
                cat.emoji = cat_data["emoji"]
                cat.tagline = cat_data["tagline"]
                cat.hero_gradient = cat_data["hero_gradient"]
                cat.save()

            for sub_data in cat_data["subcategories"]:
                sub, new = Subcategory.objects.get_or_create(
                    slug=sub_data["slug"],
                    defaults={"category": cat, "name": sub_data["name"]},
                )
                if new:
                    created_subs += 1

                for prod_name, price, featured in sub_data["products"]:
                    from django.utils.text import slugify
                    slug = slugify(prod_name)
                    # Make slug unique if collision
                    base_slug = slug
                    n = 1
                    while Product.objects.filter(slug=slug).exclude(name=prod_name).exists():
                        slug = f"{base_slug}-{n}"
                        n += 1

                    prod, new = Product.objects.get_or_create(
                        name=prod_name,
                        defaults={
                            "slug": slug,
                            "subcategory": sub,
                            "description": f"Premium quality {prod_name.lower()} from Disilia.",
                            "price": price,
                            "stock": 50,
                            "is_active": True,
                            "is_featured": featured,
                        },
                    )
                    if new:
                        created_prods += 1

        self.stdout.write(self.style.SUCCESS(
            f"OK Seeded {created_cats} categories, {created_subs} subcategories, {created_prods} products."
        ))
