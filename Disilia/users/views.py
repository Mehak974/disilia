from django.shortcuts import render, redirect

def login_view(request):
    return render(request, 'auth/login.html')

def signup_view(request):
    return render(request, 'auth/signup.html')

def profile_view(request):
    return render(request, 'auth/profile.html')

def logout_view(request):
    return redirect('store:home')
