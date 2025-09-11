import React from "react";
import { Link } from "react-router-dom";

const colors = ["#f28b82", "#fbbc04", "#34a853", "#4285f4"];

export default function CompartimentoCard({ compartimento, tratamiento }) {
  return (
    <div
      className="p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between"
      style={{ backgroundColor: colors[compartimento - 1] }}
    >
      <div>
        <h2 className="text-xl font-bold mb-2">Compartimento {compartimento}</h2>
        {tratamiento ? (
          <>
            <p><b>Pastilla:</b> {tratamiento.nombre_pastilla}</p>
            <p><b>Dosis:</b> {tratamiento.dosis}</p>
            <p><b>Stock:</b> {tratamiento.stock}</p>
            <p><b>Repetición:</b> {tratamiento.repeticion}</p>
            {tratamiento.repeticion === "DIARIO" && (
              <p><b>Hora:</b> {tratamiento.hora_toma}</p>
            )}
            {tratamiento.repeticion === "SEMANAL" && (
              <p>
                <b>Día:</b> {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"][tratamiento.dia_semana]} <br />
                <b>Hora:</b> {tratamiento.hora_toma}
              </p>
            )}
            {tratamiento.repeticion === "CADA_X_HORAS" && (
              <p><b>Cada:</b> {tratamiento.intervalo_horas} horas</p>
            )}
          </>
        ) : (
          <p>No configurado</p>
        )}
      </div>

      <Link
        to={tratamiento ? `/editar/${tratamiento.id}` : `/editar/nuevo/${compartimento}`}
        className="mt-4 bg-white text-black px-4 py-2 rounded-lg text-center font-semibold"
      >
        {tratamiento ? "Editar" : "Configurar"}
      </Link>
    </div>
  );
}
