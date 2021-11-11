import graphene
from graphene import relay
from graphql_relay import from_global_id
from graphene_django.types import DjangoObjectType
from graphene_django.filter import DjangoFilterConnectionField
from graphql_jwt.decorators import login_required
from .models import Department, Employee


class DepartmentNode(DjangoObjectType):
    class Meta:
        model = Department
        django_filters = {
            'employees': ['exact'],
            'dept_name': ['exact']
        }
        interfaces = (relay.Node,)


class EmployeeNode(DjangoObjectType):
    class Meta:
        node = Employee
        filter_fields = {
            'name': ['exact', 'icontains'],
            'join_year': ['exact', 'icontains'],
            'department_name': ['icontains'],
        }
        interfaces = (relay.Node,)


class Query(graphene.ObjectType):
    employee = graphene.Field(EmployeeNode, id=graphene.NonNull(graphene.ID))
    all_employee = DjangoFilterConnectionField(EmployeeNode)
    all_departments = DjangoFilterConnectionField(DepartmentNode)

    @login_required
    def resolve_employee(self, info, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return Employee.objects.get(id=from_global_id(id)[1])

    @login_required
    def resolve_all_employees(self, info, **kwargs):
        return Employee.objects.all()

    @login_required
    def resolve_all_departments(self, info, **kwargs):
        return Department.objects.all()
