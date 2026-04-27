from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import SignUpForm, ProfileForm
from .models import Wishlist
from store.models import Order

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.first_name or user.username}!")
            return redirect('store:home')
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    return render(request, 'auth/login.html', {'form': form})

def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registry successful! Welcome to Disilia.")
            return redirect('store:home')
        else:
            messages.error(request, "Registration failed. Please check the details.")
    else:
        form = SignUpForm()
    return render(request, 'auth/signup.html', {'form': form})

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated.")
            return redirect('users:profile')
    else:
        form = ProfileForm(instance=request.user)
    return render(request, 'auth/profile.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('store:home')

@login_required
def orders_view(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'auth/orders.html', {'orders': orders})

@login_required
def wishlist_view(request):
    wishlist_items = Wishlist.objects.filter(user=request.user).order_by('-added_at')
    return render(request, 'auth/wishlist.html', {'wishlist_items': wishlist_items})

@login_required
def toggle_wishlist(request, product_id):
    from store.models import Product
    product = get_object_or_404(Product, id=product_id)
    wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
    if not created:
        wishlist_item.delete()
        messages.info(request, f"{product.name} removed from wishlist.")
    else:
        messages.success(request, f"{product.name} added to wishlist.")
    return redirect(request.META.get('HTTP_REFERER', 'store:home'))
