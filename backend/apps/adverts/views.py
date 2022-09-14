from rest_framework import permissions, viewsets
from .models import Advert, AdvertType
from .serializers import AdvertSerializer
from .permissions import IsOwnerOrReadOnly

class NeedSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.raw(
        'SELECT * FROM adverts_advert WHERE advertType = %s', [AdvertType.NEED_SITTER])

    serializer_class = AdvertSerializer
    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.NEED_SITTER)


class IsSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.raw(
        'SELECT * FROM adverts_advert WHERE advertType = %s', [AdvertType.IS_SITTER])

    serializer_class = AdvertSerializer

    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.IS_SITTER)

# ViewSet for all the Adverts
class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.all()
    serializer_class = AdvertSerializer
    http_method_names = ['get', 'head', 'patch', 'delete']
    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]

    def get_queryset(self):
        '''
        This function overrides the default get_queryset and is called by get requests.
        
        Returns:
            Ordered queryset specified by URL parameter.
        '''
        order_by = self.request.query_params.get('order_by', 'id')
        queryset = self.queryset.order_by(order_by)
        return queryset


