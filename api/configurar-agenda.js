export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  return res.status(200).json({
    ok: true,
    message: "Agenda recibida correctamente",
  });
}
