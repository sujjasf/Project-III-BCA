# backend/readme.md

This is the backend part of the Smart Attendance System project.

---

## Quick backend steps:
1. Create and activate venv (use python 3.10 per ForMe.md).
2. pip install -r requirements.txt (or requirementsplan.txt for plan).
3. Configure env vars (DJANGO_SECRET_KEY, DEBUG, MEDIA_ROOT).
4. python manage.py migrate && python manage.py createsuperuser
5. Run dev server: python manage.py runserver

For React migration and guidance when dlib is not available, see ../CODEBASE.md

Current venv summary & what you still need
- From your pip list you already have:
  - Django (5.2.8), dlib, face-recognition, OpenCV, numpy, pillow, qrcode.
- Missing Python packages you should install into this venv for the Django+React flow:
  - djangorestframework
  - django-cors-headers
  - (optional) gunicorn, whitenoise, django-environ for production

Quick install commands (inside your activated venv)
1. Install missing backend packages:
   pip install djangorestframework django-cors-headers python-dotenv

2. (Optional production helpers)
   pip install gunicorn whitenoise django-environ

3. Run migrations and create admin:
   python manage.py migrate
   python manage.py createsuperuser

4. Start dev server:
   python manage.py runserver

Frontend (React) requirements
- Install Node.js (>=16) and npm/yarn on your machine.
- Create React app (in repo root or parallel folder):
  npx create-react-app frontend
- Install client face library:
  cd frontend
  npm install face-api.js axios

Choose recognition strategy
- Client-side (recommended if dlib is hard to build on other machines):
  - Use face-api.js in React. No server dlib needed. Server exposes simple APIs:
    - GET /api/students/<id>/ (metadata and optionally stored descriptor)
    - POST /api/mark-attendance/<id>/
  - Host face-api.js models in frontend public/models or use CDN.

- Server-side (if you prefer current face_recognition on backend):
  - Ensure dlib builds on target machine (see ../SETUP.md for system packages).
  - Use existing face-recognition code paths and expose DRF endpoints for uploads.

Notes & troubleshooting
- Browser camera often requires HTTPS (or use localhost).
- If you plan to expose stored descriptors to the browser, make sure it's acceptable for your privacy/security model.
- If you need, I can generate:
  - DRF view skeletons for API endpoiUtilitiesnts
  - Minimal React components (QRScanner, FaceScan) using face-api.js
  - Commands to export existing encodings from the old project into JSON