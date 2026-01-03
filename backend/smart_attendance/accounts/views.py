from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Student
from attendance.utils.face_utils import get_face_encoding

class RegisterStudent(APIView):
    def post(self, request):
        image = request.FILES['image']
        path = f"media/{image.name}"

        with open(path, 'wb+') as f:
            for chunk in image.chunks():
                f.write(chunk)

        encoding = get_face_encoding(path)

        if encoding is None:
            return Response({"error": "No face detected"}, status=400)

        Student.objects.create(
            roll_no=request.data['roll_no'],
            name=request.data['name'],
            face_encoding=encoding
        )

        return Response({"message": "Student registered successfully"})
