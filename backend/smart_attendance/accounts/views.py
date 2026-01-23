from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Student
from attendance.utils.face_utils import get_face_encoding
from django.http import JsonResponse
from .models import Department, Batch, ClassGroup

def departments_list(request):
    qs = Department.objects.order_by('name').values('id', 'name')
    return JsonResponse(list(qs), safe=False)

def department_batches(request, dept_id):
    qs = Batch.objects.filter(classgroup__department_id=dept_id).distinct().values('id', 'name')
    # Also include batches directly linked to department via ClassGroup
    return JsonResponse(list(qs), safe=False)

def batch_classgroups(request, batch_id):
    qs = ClassGroup.objects.filter(batch_id=batch_id).values('id', 'name', 'department_id')
    return JsonResponse(list(qs), safe=False)

class RegisterStudent(APIView):
    def post(self, request):
        image = request.FILES['image']
        path = f"media/{image.name}"

        with open(path, 'wb+') as f:
            for chunk in image.chunks():
                f.write(chunk)

        encoding = get_face_encoding(path)
        print(f"Encoding returned from get_face_encoding: {encoding}")

        if encoding is None:
            return Response({"error": "No face detected or encoding error"}, status=400)

        # Save student with encoding and image
        student = Student.objects.create(
            roll_no=request.data['roll_no'],
            name=request.data['name'],
            face_encoding=encoding
        )
        student.image.save(image.name, image, save=True)
        print(f"Registered student {student.roll_no} with encoding shape: {encoding and len(encoding)}")

        return Response({"message": "Student registered successfully"})


