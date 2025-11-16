from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Registro de nuevo usuario
    Campos esperados: name, email, password
    """
    name = request.data.get('name', '')
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    
    # Validaciones
    if not email or not password:
        return Response(
            {'error': 'Email y contraseña son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(password) < 6:
        return Response(
            {'error': 'La contraseña debe tener al menos 6 caracteres'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar si el email ya existe
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Este correo ya está registrado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(username=email).exists():
        return Response(
            {'error': 'Este correo ya está registrado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Crear usuario
    try:
        # Separar nombre y apellido
        name_parts = name.split() if name else ['Usuario']
        first_name = name_parts[0]
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        user = User.objects.create_user(
            username=email,  # Usamos email como username
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Crear token de autenticación
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'username': user.username
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Error al crear usuario: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login de usuario
    Campos esperados: email, password
    """
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    
    if not email or not password:
        return Response(
            {'error': 'Email y contraseña son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Autenticar (username es el email)
    user = authenticate(username=email, password=password)
    
    if user is not None:
        # Obtener o crear token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'username': user.username
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Credenciales incorrectas'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_user(request):
    """
    Logout - elimina el token del usuario
    """
    try:
        request.user.auth_token.delete()
        return Response(
            {'message': 'Sesión cerrada exitosamente'}, 
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_user_info(request):
    """
    Obtener información del usuario autenticado
    """
    if request.user.is_authenticated:
        return Response({
            'user': {
                'id': request.user.id,
                'name': request.user.get_full_name() or request.user.username,
                'email': request.user.email,
                'username': request.user.username
            }
        })
    else:
        return Response(
            {'error': 'No autenticado'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )


# 🆕 NUEVOS ENDPOINTS PARA AJUSTES

@api_view(['PUT'])
def update_profile(request):
    """
    Actualizar información del perfil del usuario
    Campos: name
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'No autenticado'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    name = request.data.get('name', '').strip()
    
    if not name:
        return Response(
            {'error': 'El nombre no puede estar vacío'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = request.user
        
        # Separar nombre y apellido
        name_parts = name.split()
        first_name = name_parts[0] if name_parts else ''
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        
        return Response({
            'message': 'Perfil actualizado correctamente',
            'user': {
                'id': user.id,
                'name': user.get_full_name() or user.username,
                'email': user.email,
                'username': user.username
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error al actualizar perfil: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def change_password(request):
    """
    Cambiar contraseña del usuario
    Campos esperados: current_password, new_password
    """
    if not request.user.is_authenticated:
        return Response(
            {'error': 'No autenticado'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    current_password = request.data.get('current_password', '')
    new_password = request.data.get('new_password', '')
    
    # Validaciones
    if not current_password or not new_password:
        return Response(
            {'error': 'Contraseña actual y nueva son requeridas'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(new_password) < 6:
        return Response(
            {'error': 'La nueva contraseña debe tener al menos 6 caracteres'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar que la contraseña actual sea correcta
    user = request.user
    if not user.check_password(current_password):
        return Response(
            {'error': 'Contraseña actual incorrecta'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Cambiar contraseña
        user.set_password(new_password)
        user.save()
        
        # Actualizar el token (opcional, para mantener la sesión)
        Token.objects.filter(user=user).delete()
        new_token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Contraseña cambiada exitosamente',
            'token': new_token.key  # Nuevo token para mantener la sesión
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Error al cambiar contraseña: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )