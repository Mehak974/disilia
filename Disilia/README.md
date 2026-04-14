# Disilia - 3D E-Commerce Platform

Welcome to **Disilia** ("From essentials to extra."), a premium 3D e-commerce website built with Django, Tailwind CSS, and Three.js.

## Project Structure

The project has been refactored from a single `index.html` file into a robust, secure Django web application.
- `disilia_core/` - Django configuration, settings, and main URLs.
- `store/` - E-commerce logic (Products, Categories, Cart views, Orders).
- `users/` - Authentication and User Profiles.
- `templates/` - 19 separate HTML templates using Tailwind CSS for responsive UI.
- `static/` - Shared static assets including `js/main.js` for the interactive 3D background.

## Technology Stack

- **Backend:** Django (Python)
- **Frontend CSS:** Tailwind CSS (via CDN)
- **Frontend JS:** Vanilla JS with Three.js (for immersive 3D background & animations) and GSAP (for scroll/entrance animations).
- **Database:** SQLite (default for development; safely configurable to PostgreSQL for production).

## Setup Instructions

### 1. Prerequisites
Ensure you have Python 3.10+ installed on your system.
Verify by running:
```bash
python --version
```

### 2. Environment Setup
Navigate to the project root:
```bash
cd Disilia
```
Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

### 3. Environment Configuration
Create a `.env` file in the project root based on the provided `.env.example`:
```bash
cp .env.example .env
```
Open `.env` and configure your `SECRET_KEY`, `DEBUG` mode, and `ALLOWED_HOSTS`.

### 4. Install Dependencies
Install the required packages from the manifest:
```bash
pip install -r requirements.txt
```

### 5. Database Migrations
Initialize the baseline database structure:
```bash
python manage.py migrate
```

### 5. Create a Superuser
Create an admin user to manage your robust `store` and `users` data via the Django Admin panel.
```bash
python manage.py createsuperuser
```

### 6. Run the Server
Launch the application.
```bash
python manage.py runserver
```

You can now visit:
- **Storefront:** `http://127.0.0.1:8000/`
- **Admin Panel:** `http://127.0.0.1:8000/executive-registry-portal/`

## Security Notes

The application uses standard Django features securely configured:
- CSRF tokens are enforced on all `POST` forms (Login, Signup, Address, etc.).
- Robust user authentication and session management via `django.contrib.auth`.
- XSS prevention is handled organically by Django templates. 
- In production, ensure `DEBUG = False` in `disilia_core/settings.py` and enforce HTTPS routing variables.

Developed in 2026.
