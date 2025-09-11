from django.db import models

# Create your models here.

class Tratamiento(models.Model):
    REPETICION_CHOICES = [
        ("DIARIO", "Diario"),
        ("SEMANAL", "Semanal"),
        ("CADA_X_HORAS", "Cada X horas"),
    ]

    compartimento = models.IntegerField(choices=[(i, f"Compartimento {i}") for i in range(1, 5)])
    nombre_pastilla = models.CharField(max_length=100)
    dosis = models.PositiveIntegerField(default=1)  # número de pastillas a tomar
    stock = models.PositiveIntegerField(default=0)  # stock actual en el compartimento
    repeticion = models.CharField(max_length=20, choices=REPETICION_CHOICES)
    intervalo_horas = models.PositiveIntegerField(null=True, blank=True)
    hora_toma = models.TimeField(null=True, blank=True)
    dia_semana = models.IntegerField(null=True, blank=True, choices=[(i, day) for i, day in enumerate(["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"])])
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)