from rest_framework import serializers
import pickle
import base64
from .models import Offer, Contract


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'offerType', 'sender', 'recipient', 'status', 'advert')
        read_only_fields = ['sender', 'status', 'recipient']


class ContractSerializer(serializers.ModelSerializer):
    parent = serializers.SlugRelatedField(
        read_only=True, slug_field='username')
    sitter = serializers.SlugRelatedField(
        read_only=True, slug_field='username')

    contractId = serializers.SerializerMethodField()

    parentEmail = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = ('id', 'parent', 'sitter', 'contractId', 'content', 'date',
                  'start_time', 'end_time', 'finished', 'parentEmail')

    def get_contractId(self, obj):
        return base64.b64encode(pickle.dumps(obj.id))

    def get_parentEmail(self, obj):
        return obj.parent.email
