from django.contrib.auth import get_user_model
import graphene
from graphene import relay
from graphene_django import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
import graphql_jwt
from graphql_jwt.decorators import login_required


class UserNode(DjangoObjectType):
    class Meta:
        model = get_user_model()
        filter_fields = {
            "username": ["exact", "icontains"],
        }
        interfaces = (relay.Node,)


class CreateUserMutation(relay.ClientIDMutation):
    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)

    user = graphene.Field(UserNode)

    def mutate_and_get_payload(root, info, **input):
        user = get_user_model()(
            username=input.get("username"),
            email=input.get("email"),
        )
        user.set_password(input.get("password"))
        user.save()

        return CreateUserMutation(user=user)


class Mutation(graphene.AbstractType):
    create_user = CreateUserMutation.Field()
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()


class Query(graphene.ObjectType):
    all_users = DjangoFilterConnectionField(UserNode)

    @login_required
    def resolve_all_users(self, info, **kwargs):
        return get_user_model().objects.all()
