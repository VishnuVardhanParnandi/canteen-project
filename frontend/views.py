from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Feedback

@api_view(['POST'])
def submit_feedback(request):
    Feedback.objects.create(**request.data)
    return Response({"message": "Feedback submitted"})
