from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Feedback

@api_view(["POST"])
def submit_feedback(request):
    d = request.data
    if not all(k in d for k in ("user_email", "item_name", "rating")):
        return Response({"error": "Invalid data"}, status=400)

    Feedback.objects.create(**d)
    return Response({"message": "Saved"}, status=201)
