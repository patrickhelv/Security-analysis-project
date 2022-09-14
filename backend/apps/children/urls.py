from rest_framework.routers import DefaultRouter
from apps.children import views
from django.urls import path

router = DefaultRouter()

router.register('api/children',
                views.ChildViewSet, basename='children')
router.register('api/child-file', views.ChildFileViewSet,
                basename='child-file')

urlpatterns = [*router.urls, path("api/child-file-download/<int:pk>/",
                                  views.ChildFileDownloadView.as_view(), name="child-file-download"),
               path("api/remove-guardian/",
                    views.RemoveGuardianView.as_view(), name="remove-guardian"),
               path("api/active-contract-children/", views.ActiveContractChildView.as_view(), name="active-contract")]
