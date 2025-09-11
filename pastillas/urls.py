from rest_framework.routers import DefaultRouter
from .views import TratamientoViewSet

router = DefaultRouter()
router.register(r"tratamientos", TratamientoViewSet)

urlpatterns = router.urls