Project-III (BCA)
Smart Attendance System using Django & Face Recognition
1. Project Overview (What the Project Does)

The Smart Attendance System is a web-based Student Attendance Management System developed using Django that automatically marks student attendance using Face Recognition technology.

Instead of traditional manual attendance, the system verifies a student’s identity through:

Student ID verification (QR code or manual ID entry)

Live face scanning using a webcam

Only when both ID and face match, attendance is marked. This prevents proxy attendance and improves accuracy, efficiency, and security.

This project is designed as a solo Django project and focuses only on student attendance, making it ideal for BCA Project-III.

2. Problem Statement

Traditional attendance systems:

Are time-consuming

Allow proxy attendance

Require manual effort

Are difficult to manage for large classes

Proposed Solution:
Use Face Recognition + QR-based identification to automate attendance in a secure and reliable manner.

3. Objectives of the Project

To automate student attendance using face recognition

To prevent proxy attendance

To store attendance records digitally

To generate attendance reports easily

To provide a simple admin interface for managing students

4. Technologies Used
Category	Technology
Programming Language	Python
Web Framework	Django
Face Recognition	OpenCV + face_recognition
Database	SQLite / MySQL / MongoDB (Djongo)
Frontend	HTML, CSS, JavaScript
Webcam Access	WebRTC (getUserMedia)
QR Code	qrcode Python library
Export Reports	CSV / Excel
5. System Modules
5.1 Student Registration Module

Admin registers students

Stores:

Student ID (unique)

Name

Photo (used for face encoding)

Automatically generates:

QR code for each student

Face encoding from uploaded photo

5.2 Identification Module

Students identify themselves using:

QR code scan OR

Manual entry of student ID

The system fetches:

Student details

Stored face encoding

5.3 Face Recognition Module

Webcam captures live image

Face detected using OpenCV

Encoding generated using face_recognition

Encoding compared with stored encoding

Result:

✅ Match → Attendance marked

❌ No match → Attendance rejected

5.4 Attendance Management Module

Marks attendance automatically

Stores:

Student ID

Date & time

Optional captured photo

Prevents duplicate attendance on same day

5.5 Report Generation Module

Admin can:

View daily attendance

Export CSV / Excel files

Useful for records and evaluation

6. Complete System Workflow
Step 1: Student Registration

Admin uploads student photo

System:

Generates QR code

Extracts and stores face encoding

Step 2: Student Attendance

Student scans QR code or enters Student ID

Webcam starts automatically

Live face scan begins

System compares face with stored encoding

If matched → Attendance marked

If not matched → Error message displayed

Step 3: Attendance Storage

Attendance saved in database

Timestamp recorded

Optional snapshot stored

7. Database Design (Simple)
Student Model
Student
- id
- student_id (unique)
- name
- photo
- face_encoding
- qr_code

Attendance Model
Attendance
- id
- student (FK)
- date
- time
- captured_image (optional)

8. How to Start This Project from Beginning (Step-by-Step)
Step 1: Create Virtual Environment
python -m venv venv
source venv/bin/activate

Step 2: Install Dependencies
pip install django opencv-python face-recognition pillow qrcode numpy


⚠️ On Linux, install:

sudo pacman -S cmake dlib

Step 3: Create Django Project
django-admin startproject smart_attendance
cd smart_attendance
python manage.py startapp attendance

Step 4: Configure settings.py
INSTALLED_APPS = [
    'attendance',
    'django.contrib.admin',
    'django.contrib.auth',
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

Step 5: Create Models

Student model with photo & encoding

Attendance model with timestamp

Face encoding is automatically generated when photo is saved.

Step 6: Face Encoding on Registration

When admin uploads a photo:

System extracts face encoding

Saves encoding in database (JSON or Binary)

This ensures no repeated computation during attendance.

Step 7: Webcam Face Scan

JavaScript captures image from webcam

Sends image to Django via POST

Django:

Decodes image

Extracts face encoding

Compares with stored encoding

Step 8: Attendance Marking

If face matches:

Attendance record created

If already marked today:

Show “Attendance already recorded”

9. Automatic Face Scan & Save (Your Requirement)

✔ Face scan starts automatically after ID verification
✔ Live face captured from webcam
✔ Face encoding compared in backend
✔ Attendance saved automatically in database

This satisfies full automation.

10. Advantages of the System

Eliminates manual attendance

Prevents fake attendance

Fast and accurate

Scalable for large classes

Digital record keeping

11. Limitations

Requires camera and good lighting

Initial setup cost

Face recognition accuracy depends on image quality

12. Future Enhancements

Mobile app integration

Cloud deployment

Liveness detection (anti-spoofing)

SMS / Email notification

Class-wise attendance analytics

13. Conclusion

The Smart Attendance System is an intelligent and secure solution for managing student attendance using Django and Face Recognition.
It automates attendance, improves accuracy, and reduces manual effort, making it ideal for academic institutions.

