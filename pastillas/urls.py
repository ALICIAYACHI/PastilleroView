from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TratamientoViewSet, HistorialTomaViewSet, registrar_toma, test_telegram, notificar_recordatorio

router = DefaultRouter()
router.register(r"tratamientos", TratamientoViewSet)
router.register(r"historial", HistorialTomaViewSet)

urlpatterns = router.urls + [
    path('registrar-toma/', registrar_toma, name='registrar-toma'),
    path('test-telegram/', test_telegram, name='test-telegram'),
    path('notificar-recordatorio/', notificar_recordatorio, name='notificar-recordatorio'),
]