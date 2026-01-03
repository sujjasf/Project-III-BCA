# Proposal — Smart Attendance System (Project-III BCA)

## 1. Project Overview
The Smart Attendance System is a web-based solution that automates student attendance by combining QR code identification and face recognition. Backend is built with Django REST Framework; optional frontend uses React.js. Attendance records are stored in MariaDB (or SQLite for development).

## 2. Problem Statement
Traditional attendance is manual, time-consuming and vulnerable to proxy/fake entries. This system enforces identity by requiring a scanned QR / student ID plus live face verification.

## 3. Proposed Solution
- Student scans QR or enters roll number.
- Frontend captures a webcam image.
- Backend compares the live face with the stored encoding for that student.
- On match, attendance is recorded with timestamp and optional snapshot.

## 4. Objectives
- Automate attendance workflow.
- Prevent proxy attendance.
- Keep digital, exportable attendance records.
- Provide an admin interface for student management and report export.

## 5. Technology Stack
- Python 3.10, Django 4.2 + Django REST Framework
- MariaDB (production) / SQLite (dev)
- face_recognition (dlib) or client-side face-api.js
- OpenCV, Pillow, qrcode
- React.js (optional frontend)
- mysqlclient for Django MySQL connectivity

## 6. System Architecture (high level)
React Frontend (QR + Webcam)
  ↕
Django REST API (Student verification, face matching, attendance storage)
  ↕
MariaDB / SQLite (attendance + student data)

## 7. Features
- Student registration (photo upload, face encoding, QR generation)
- QR-based check-in with live face verification
- Timestamped attendance records and duplicate prevention
- Admin export (CSV/Excel) and management UI

## 8. Models (example)
Use these as guidance — adjust fields to your app.

```python
# filepath: /home/sujjalbtw/Projects/Project-III-BCA/backend/smart_attendance/accounts/models.py
class Student(models.Model):
    roll_no = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    face_encoding = models.BinaryField()
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

```python
# filepath: /home/sujjalbtw/Projects/Project-III-BCA/backend/smart_attendance/attendance/models.py
class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    captured_image = models.ImageField(upload_to='attendance_images/', null=True, blank=True)
```

## 9. Key utilities (examples)
- Face matching (server-side):
```python
# filepath: /home/sujjalbtw/Projects/Project-III-BCA/backend/smart_attendance/attendance/utils/face_utils.py
import face_recognition
import numpy as np

def match_face(unknown_image_path, student_list):
    unknown_image = face_recognition.load_image_file(unknown_image_path)
    unknown_encodings = face_recognition.face_encodings(unknown_image)
    if not unknown_encodings:
        return None
    unknown_enc = unknown_encodings[0]
    for student in student_list:
        known_enc = np.frombuffer(student.face_encoding, dtype=np.float64)
        if face_recognition.compare_faces([known_enc], unknown_enc)[0]:
            return student
    return None
```

- QR generation:
```python
# filepath: /home/sujjalbtw/Projects/Project-III-BCA/backend/smart_attendance/attendance/utils/qr_utils.py
import qrcode
from io import BytesIO
from django.core.files import File

def generate_qr_code(roll_no):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(roll_no)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return File(buffer, name=f"{roll_no}_qr.png")
```

## 10. Endpoints (examples)
- POST /register/ — form-data: roll_no, name, image → register student, compute face encoding, save QR.
- POST /attendance/ — form-data: roll_no, image → verify face and mark attendance.

## 11. Development steps (quick)
1. Create venv, activate it.
2. Install requirements (see backend/requirements.txt).
3. Configure DB in settings or .env.
4. Run migrations and create superuser.
5. Start server and test endpoints with Postman or frontend.

## 12. Risks & Limitations
- Face recognition requires good lighting and frontal images.
- dlib builds can be heavy; prefer client-side face-api.js if building dlib is impractical.

## 13. Future Enhancements
- Real-time WebRTC capture (no file upload)
- Liveness detection
- Mobile app integration
- Class/subject analytics with reports

## 14. Conclusion
This proposal defines scope, architecture and the main deliverables for a robust Smart Attendance System using QR + face recognition. It is suitable for a BCA final project and can be extended to production with Docker and proper CI/CD.