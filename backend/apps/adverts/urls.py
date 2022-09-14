from rest_framework.routers import DefaultRouter
from apps.adverts import views

router = DefaultRouter()

router.register('api/adverts/needsitter',
                views.NeedSitterAdvertViewSet, basename='needsitter')
router.register('api/adverts/issitter',
                views.IsSitterAdvertViewSet, basename='issitter')
router.register('api/adverts',
                views.AdvertViewSet, basename='adverts')


urlpatterns = [*router.urls]
