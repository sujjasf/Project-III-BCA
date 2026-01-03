from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True, required=True)

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'date', 'time', 'captured_image', 'image']
        read_only_fields = ['date', 'time', 'captured_image']
