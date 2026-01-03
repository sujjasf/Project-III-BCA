import face_recognition
import numpy as np

def get_face_encoding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    return encodings[0].tobytes()
import face_recognition
import numpy as np

def get_face_encoding(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if not encodings:
        return None
    return encodings[0].tobytes()

def match_face(unknown_image_path, known_students):
    unknown_image = face_recognition.load_image_file(unknown_image_path)
    unknown_enc = face_recognition.face_encodings(unknown_image)
    if not unknown_enc:
        return None
    unknown_enc = unknown_enc[0]

    for student in known_students:
        known_enc = np.frombuffer(student.face_encoding, dtype=np.float64)
        match = face_recognition.compare_faces([known_enc], unknown_enc)
        if match[0]:
            return student
    return None
