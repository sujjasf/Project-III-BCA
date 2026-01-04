import face_recognition
import numpy as np

def get_face_encoding(image_path):
    # Extracts a 128-dim float64 encoding from the image for storage
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        print("No face found in registration image.")
        return None
    encoding = np.asarray(encodings[0], dtype=np.float64)
    print(f"Registration encoding (shape={encoding.shape}, dtype={encoding.dtype}): {encoding}")
    if encoding.shape[0] != 128:
        print("Warning: Registration encoding is not 128-dim!")
        return None
    return encoding.tobytes()

def match_face(unknown_image_path, known_students):
    # Loads the student's stored encoding and compares it to the new image's encoding
    unknown_image = face_recognition.load_image_file(unknown_image_path)
    unknown_encs = face_recognition.face_encodings(unknown_image)
    if not unknown_encs:
        print("No face detected in attendance image.")
        return "no_face"
    unknown_enc = np.asarray(unknown_encs[0], dtype=np.float64)
    print(f"Unknown encoding (shape={unknown_enc.shape}, dtype={unknown_enc.dtype}): {unknown_enc}")

    for student in known_students:
        if not student.face_encoding:
            print(f"Student {student.roll_no} has no face_encoding stored.")
            continue
        known_enc = np.frombuffer(student.face_encoding, dtype=np.float64)
        print(f"Known encoding for {student.roll_no} (shape={known_enc.shape}, dtype={known_enc.dtype}): {known_enc}")
        if known_enc.shape[0] != 128:
            print(f"Skipping student {student.roll_no}: encoding shape {known_enc.shape}")
            continue
        # This is the actual linkage: compare the stored encoding (from registration) to the new encoding (from attendance)
        match = face_recognition.compare_faces([known_enc], unknown_enc)
        print(f"Compare result for {student.roll_no}: {match}")
        if match[0]:
            print(f"Face matched for {student.roll_no}")
            return student
    print("No matching face found.")
    return None