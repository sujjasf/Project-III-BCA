from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True, required=False)  # for upload flow

    class Meta:
        model = Student
        fields = ['id', 'roll_no', 'name', 'face_encoding', 'qr_code', 'created_at', 'image']
        read_only_fields = ['face_encoding', 'qr_code', 'created_at']
