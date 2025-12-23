import { useEffect, useState } from "react";
import { API_URL } from "./config";

export default function App() {
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState({
    Fecha: "",
    Comprador: "",
    Categorias: "",
    Total: "",
    Stock: true,
    Estado: "realizado",
  });
  const [loading, setLoading] = useState(false);

  const cargarVentas = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setVentas(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error API:", err));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      // si no pones fecha, Apps Script pone la actual
      Fecha: form.Fecha ? new Date(form.Fecha).toISOString() : "",
      Total: Number(form.Total || 0),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const out = await res.json();
      console.log("POST:", out);

      setForm({
        Fecha: "",
        Comprador: "",
        Categorias: "",
        Total: "",
        Stock: true,
        Estado: "realizado",
      });

      cargarVentas(); // recarga tabla
    } catch (err) {
      console.error("Error POST:", err);
      alert("Error guardando. Revisa consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900 }}>
      <h1>Gestinventa </h1>

      <form onSubmit={guardar} style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div>
            <label>Fecha</label>
            <input
              type="date"
              name="Fecha"
              value={form.Fecha}
              onChange={onChange}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label>Comprador</label>
            <input
              name="Comprador"
              value={form.Comprador}
              onChange={onChange}
              placeholder="Juan"
              style={{ width: "100%" }}
              required
            />
          </div>

          <div>
            <label>Categorías</label>
            <input
              name="Categorias"
              value={form.Categorias}
              onChange={onChange}
              placeholder="bebidas, snacks"
              style={{ width: "100%" }}
              required
            />
          </div>

          <div>
            <label>Total</label>
            <input
              type="number"
              name="Total"
              value={form.Total}
              onChange={onChange}
              placeholder="15"
              style={{ width: "100%" }}
              required
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" name="Stock" checked={form.Stock} onChange={onChange} />
            <label>Stock disponible</label>
          </div>

          <div>
            <label>Estado</label>
            <select name="Estado" value={form.Estado} onChange={onChange} style={{ width: "100%" }}>
              <option value="realizado">realizado</option>
              <option value="pendiente">pendiente</option>
              <option value="rechazado">rechazado</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? "Guardando..." : "Guardar venta"}
        </button>
      </form>

      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Comprador</th>
            <th>Categorías</th>
            <th>Total</th>
            <th>Stock</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((v, i) => (
            <tr key={i}>
              <td>{v.ID}</td>
              <td>{v.Fecha ? new Date(v.Fecha).toLocaleDateString() : ""}</td>
              <td>{v.Comprador}</td>
              <td>{v.Categorias}</td>
              <td>{v.Total}</td>
              <td>{v.Stock ? "Sí" : "No"}</td>
              <td>{v.Estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
