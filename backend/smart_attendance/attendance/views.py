from rest_framework.views import APIView
from rest_framework.response import Response
from .utils.face_utils import match_face
from accounts.models import Student
from .models import Attendance
from django.utils import timezone

class MarkAttendance(APIView):
    def post(self, request):
        roll_pno = request.data.get('roll_no')
        image = request.FILES.get('image')

        if not roll_no or not image:
            return Response({"error": "Roll number and image are required"}, status=400)

        try:
            student = Student.objects.get(roll_no=roll_no)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=404)

        # Save uploaded image temporarily
        path = f"media/temp/{roll_no}.jpg"
        with open(path, 'wb+') as f:
            for chunk in image.chunks():
                f.write(chunk)

        # Match face with student
        matched_student = match_face(path, [student])

        if matched_student:
            today = timezone.now().date()
            if Attendance.objects.filter(student=student, date=today).exists():
                return Response({"message": "Attendance already marked today"})
            Attendance.objects.create(student=student)
            return Response({"message": f"Attendance marked for {student.name}"})
        else:
            return Response({"error": "Face did not match"}, status=400)
