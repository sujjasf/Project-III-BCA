# Project-III-BCA
Smart Attendance System

---

Steps of Identification
- Students must enter their unique studentId or if student has id card then scan Qr of id card in camera and then face scan starts.
- After face scan it checks if student face matches the entered id entered or scanned then the ui will say matched or unmatched
- if matched update attendance (Optional photo stored in database).
- 

---
### How Your System Would Work (Workflow)
Student Scans Their ID Card

Could be QR code, RFID, or just typing student ID.

System fetches student details and face encoding.

Face Detection via Webcam

Capture face of the person standing in front of camera.

Use face_recognition to compare with stored encoding of that student.

Match Found → Attendance Marked

If face matches the student ID → Mark attendance ✅

If not → Show "Face does not match ID" ❌

---
| Category                 | Tool/Tech                                         |
| ------------------------ | ------------------------------------------------- |
| **Programming Language** | Python                                            |
| **Face Recognition**     | OpenCV + `face_recognition` library               |
| **Database**             | SQLite / MySQL / Firebase                         |
| **Frontend (optional)**  | Tkinter (GUI), Flask/Django (Web), or Android app |
| **Hardware (optional)**  | Raspberry Pi + Camera, or just Laptop webcam      |
| **Cloud (optional)**     | Google Firebase, AWS, etc.                        |
| **Other**                | Excel export for attendance report                |



Features to Include

Student Registration (Name, ID, Photo capture)

Face Detection & Recognition

Auto Attendance Marking with Timestamp

Attendance Report (CSV/Excel)

Admin Panel (optional for GUI/Web App)

Notification system (email/SMS) – optional


