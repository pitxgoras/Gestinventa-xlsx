import { useEffect, useState } from "react";
import { API_URL } from "./config";

export default function App() {
  // ======================
  // ESTADOS
  // ======================
  const [form, setForm] = useState({
    ID: "",
    Fecha: "",
    Comprador: "",
    Categorias: "",
    Total: "",
    Stock: true,
    Estado: "realizado",
  });

  const [ventas, setVentas] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================
  // GET /ventas
  // ======================
  const cargarVentas = async () => {
    try {
      const res = await fetch(`${API_URL}/ventas`);
      const data = await res.json();
      setVentas(data);
    } catch (err) {
      console.error("Error cargando ventas:", err);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // ======================
  // FORMULARIO
  // ======================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ======================
  // POST /ventas
  // ======================
  const guardarVenta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/ventas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setMsg("✅ Venta guardada correctamente");

      setForm({
        ID: "",
        Fecha: "",
        Comprador: "",
        Categorias: "",
        Total: "",
        Stock: true,
        Estado: "realizado",
      });

      await cargarVentas();
    } catch (err) {
      console.error(err);
      setMsg("❌ Error guardando la venta");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DELETE /ventas/:id
  // ======================
  const eliminarVenta = async (id) => {
    if (!confirm("¿Eliminar esta venta?")) return;

    try {
      await fetch(`${API_URL}/ventas/${id}`, {
        method: "DELETE",
      });

      await cargarVentas();
    } catch (err) {
      console.error("Error eliminando venta:", err);
    }
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h1>Gestinventa</h1>

      {/* FORMULARIO */}
      <form onSubmit={guardarVenta} style={{ marginBottom: 30 }}>
        <input name="ID" placeholder="ID" value={form.ID} onChange={handleChange} required />
        <input name="Fecha" type="date" value={form.Fecha} onChange={handleChange} required />
        <input name="Comprador" placeholder="Comprador" value={form.Comprador} onChange={handleChange} required />
        <input name="Categorias" placeholder="Categorías" value={form.Categorias} onChange={handleChange} required />
        <input name="Total" type="number" placeholder="Total" value={form.Total} onChange={handleChange} required />

        <label style={{ marginLeft: 10 }}>
          <input type="checkbox" name="Stock" checked={form.Stock} onChange={handleChange} />
          Stock
        </label>

        <select name="Estado" value={form.Estado} onChange={handleChange}>
          <option value="realizado">realizado</option>
          <option value="pendiente">pendiente</option>
          <option value="rechazado">rechazado</option>
        </select>

        <button type="submit" disabled={loading} style={{ marginLeft: 10 }}>
          {loading ? "Guardando..." : "Guardar venta"}
        </button>
      </form>

      {msg && <p>{msg}</p>}

      {/* TABLA */}
      <h2>Ventas registradas</h2>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Comprador</th>
            <th>Categoría</th>
            <th>Total</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.ID}>
              <td>{v.ID}</td>
              <td>{v.Fecha}</td>
              <td>{v.Comprador}</td>
              <td>{v.Categorias}</td>
              <td>{v.Total}</td>
              <td>{v.Stock ? "Sí" : "No"}</td>
              <td>{v.Estado}</td>
              <td>
                <button onClick={() => eliminarVenta(v.ID)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
