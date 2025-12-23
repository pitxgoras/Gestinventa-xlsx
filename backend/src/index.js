import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SHEET_URL = "https://script.google.com/macros/s/AKfycbywwRnOmt5hy7XZx2FbJRrEzGUojc6zxShlKbFZ0mDJvcmQWlEzuWBdUXHMC8mdGTJjjg/exec";

app.use(cors());
app.use(express.json());

// ======================
// ROOT
// ======================
app.get("/", (req, res) => {
  res.json({ message: "API OK - VERSION NUEVA" });
});

// ======================
// GET ventas
// ======================
app.get("/ventas", async (req, res) => {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error GET /ventas:", error);
    res.status(500).json({ error: "Error obteniendo ventas" });
  }
});

// ======================
// POST ventas
// ======================
app.post("/ventas", async (req, res) => {
  try {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error POST /ventas:", error);
    res.status(500).json({ error: "Error guardando venta" });
  }
});

// ======================
// DELETE venta por ID
// ======================
app.delete("/ventas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `${SHEET_URL}?action=delete&id=${encodeURIComponent(id)}`,
      { method: "POST" }
    );

    const data = await response.json().catch(() => ({}));

    res.json({ ok: true, data });
  } catch (error) {
    console.error("Error DELETE /ventas:", error);
    res.status(500).json({ error: "Error eliminando venta" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});
