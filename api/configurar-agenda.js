import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const {
      doctor_name,
      specialty,
      contact,
      days_of_week,
      start_time,
      end_time,
      slot_duration_minutes,
      days_ahead,
    } = req.body;

    const { error } = await supabase
      .from("doctor_schedule_rules")
      .insert([
        {
          doctor_name,
          specialty,
          contact,
          days_of_week,
          start_time,
          end_time,
          slot_duration_minutes: Number(slot_duration_minutes),
          days_ahead: Number(days_ahead),
        },
      ]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al guardar agenda" });
    }

    return res.status(200).json({
      ok: true,
      message: "Agenda guardada correctamente",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error inesperado" });
  }
}
