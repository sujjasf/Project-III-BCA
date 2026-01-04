# scan_qr.py
import os
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"
os.environ["QT_QPA_PLATFORM"] = "xcb"
import cv2
import numpy as np
from pyzbar.pyzbar import decode

def scan_qr_from_camera():
    cap = cv2.VideoCapture(0)
    print("Press 'q' to quit.")
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        for barcode in decode(frame):
            qr_data = barcode.data.decode('utf-8')
            print(f"QR Code detected: {qr_data}")
            # Draw rectangle around QR code
            pts = barcode.polygon
            pts = [(pt.x, pt.y) for pt in pts]
            cv2.polylines(frame, [np.array(pts, dtype=np.int32)], True, (0,255,0), 2)
            # Optionally, break after first detection
            cap.release()
            cv2.destroyAllWindows()
            return qr_data
        cv2.imshow('QR Scanner', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()
    return None

if __name__ == "__main__":
    result = scan_qr_from_camera()
    if result:
        print("Scanned QR Code:", result)
    else:
        print("No QR code detected.")