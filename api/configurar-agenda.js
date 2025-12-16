import { createClient } from "@supabase/supabase-js";

/**
 * CONFIGURAR AGENDA - NOCODIA MVP
 * Guarda configuración básica de agenda por médico
 */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  console.log("CONFIGURAR AGENDA EJECUTADA");

  // 1. Validar método
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 2. Validar variables de entorno
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Variables de entorno de Supabase no configuradas");
    }

    // 3. Leer body
    const {
      nombre_medico,
      especialidad,
      contacto,
      dias_atencion,
      hora_inicio,
      hora_fin,
      duracion_cita,
      dias_adelanto,
    } = req.body;

    // 4. Validaciones mínimas
    if (!nombre_medico || !especialidad || !dias_atencion?.length) {
      throw new Error("Datos incompletos");
    }

    // 5. Crear o buscar médico
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .insert({
        nombre: nombre_medico,
        especialidad: especialidad,
        contacto: contacto || null,
      })
      .select()
      .single();

    if (doctorError) {
      console.error("ERROR DOCTOR:", doctorError);
      throw doctorError;
    }

    // 6. Guardar reglas de agenda
    const { error: agendaError } = await supabase
      .from("doctor_schedule_rules")
      .insert({
        doctor_id: doctor.id,
        dias_atencion: dias_atencion,
        hora_inicio: hora_inicio,
        hora_fin: hora_fin,
        duracion_minutos: duracion_cita,
        dias_adelanto: dias_adelanto,
      });

    if (agendaError) {
      console.error("ERROR AGENDA:", agendaError);
      throw agendaError;
    }

    // 7. Respuesta OK
    return res.status(200).json({
      ok: true,
      message: "Agenda configurada correctamente",
      doctor_id: doctor.id,
    });
  } catch (error) {
    console.error("SUPABASE ERROR FINAL:", error);

    return res.status(500).json({
      error:
        error?.message ||
        error?.details ||
        "Error interno al guardar agenda",
    });
  }
}
