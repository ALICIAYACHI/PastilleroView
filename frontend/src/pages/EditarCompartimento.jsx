import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function EditarCompartimento() {
  const { id, compartimento } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    compartimento: compartimento ? parseInt(compartimento) : 1,
    nombre_pastilla: "",
    dosis: 1,
    stock: 0,
    repeticion: "DIARIO",
    intervalo_horas: "",
    hora_toma: "",
    dia_semana: "",
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
  });

  useEffect(() => {
    if (id && !compartimento) {
      api.get(`tratamientos/${id}/`).then((res) => setForm(res.data));
    }
  }, [id, compartimento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanForm = { ...form };

    // Convertir strings vacíos a null
    Object.keys(cleanForm).forEach((key) => {
      if (cleanForm[key] === "") {
        cleanForm[key] = null;
      }
    });

    // Eliminar campos que no correspondan según la repetición
    if (form.repeticion === "DIARIO") {
      cleanForm.intervalo_horas = null;
      cleanForm.dia_semana = null;
    }
    if (form.repeticion === "CADA_X_HORAS") {
      cleanForm.hora_toma = null;
      cleanForm.dia_semana = null;
    }
    if (form.repeticion === "SEMANAL") {
      cleanForm.intervalo_horas = null;
    }

    const request = id && !compartimento
      ? api.put(`tratamientos/${id}/`, cleanForm)
      : api.post("tratamientos/", cleanForm);

    request
      .then(() => navigate("/"))
      .catch((err) => {
        console.error("Error del backend:", err.response?.data);
        alert("Error: " + JSON.stringify(err.response?.data));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6 border border-blue-100"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">
            Compartimento {form.compartimento}
          </h1>
          <p className="text-gray-500 mt-1">
            Configura las pastillas, dosis y horarios
          </p>
        </div>

        {/* Nombre pastilla */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Nombre de la pastilla
          </label>
          <input
            type="text"
            name="nombre_pastilla"
            placeholder="Ej: Paracetamol"
            value={form.nombre_pastilla}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        {/* Dosis */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Dosis (cantidad por toma)
          </label>
          <input
            type="number"
            name="dosis"
            value={form.dosis}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            min="1"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Stock (número de pastillas)
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            min="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            El stock disminuirá automáticamente en cada toma
          </p>
        </div>

        {/* Repetición */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Repetición
          </label>
          <select
            name="repeticion"
            value={form.repeticion}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
          >
            <option value="DIARIO">Diario</option>
            <option value="CADA_X_HORAS">Cada X horas</option>
            <option value="SEMANAL">Semanal</option>
          </select>
        </div>

        {/* Condicionales */}
        {form.repeticion === "CADA_X_HORAS" && (
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Intervalo en horas
            </label>
            <input
              type="number"
              name="intervalo_horas"
              placeholder="Ej: cada 8 horas"
              value={form.intervalo_horas}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              min="1"
            />
          </div>
        )}

        {form.repeticion === "DIARIO" && (
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Hora de la toma
            </label>
            <input
              type="time"
              name="hora_toma"
              value={form.hora_toma}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        )}

        {form.repeticion === "SEMANAL" && (
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Día y hora
            </label>
            <select
              name="dia_semana"
              value={form.dia_semana}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white"
            >
              <option value="">Selecciona un día</option>
              <option value="0">Lunes</option>
              <option value="1">Martes</option>
              <option value="2">Miércoles</option>
              <option value="3">Jueves</option>
              <option value="4">Viernes</option>
              <option value="5">Sábado</option>
              <option value="6">Domingo</option>
            </select>
            <input
              type="time"
              name="hora_toma"
              value={form.hora_toma}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        )}

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Fecha inicio
            </label>
            <input
              type="date"
              name="fecha_inicio"
              value={form.fecha_inicio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Fecha fin
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={form.fecha_fin}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-md"
        >
          Guardar configuración
        </button>
      </form>
    </div>
  );
}
