from rest_framework.routers import DefaultRouter
from django.urls import path, include
from apps.offers import views

router = DefaultRouter()

router.register('api/offers',
                views.OfferViewSet, basename='offers')
router.register('api/contracts',
                views.ContractViewSet, basename='contracts')


urlpatterns = [*router.urls, path('api/offer_answer/',
                                  views.AnswerOfferView.as_view(), name='offer_answer'),
               path('api/finish_contract/', views.FinishContractView.as_view(), name='finish_contract')]
