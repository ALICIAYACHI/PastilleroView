import React, { useEffect, useState } from "react";
import api from "../api";
import CompartimentoCard from "../components/CompartimentoCard";

export default function Home() {
  const [tratamientos, setTratamientos] = useState([]);

  useEffect(() => {
    api.get("tratamientos/").then((res) => {
      setTratamientos(res.data);
    });
  }, []);

  const getTratamiento = (comp) =>
    tratamientos.find((t) => t.compartimento === comp);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center drop-shadow">
        Compartimentos del Pastillero
      </h1>
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((comp) => (
          <CompartimentoCard
            key={comp}
            compartimento={comp}
            tratamiento={getTratamiento(comp)}
          />
        ))}
      </section>
    </main>
  );
}
