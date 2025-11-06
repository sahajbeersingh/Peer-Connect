import express from "express";
import supabase from '../config/supabaseClient.js';
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, skill_name, level } = req.body;

  try {
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id")
      .eq("email", email)
      .single();
    if (studentError) throw new Error("Student not found");
    const student_id = student.id;

    let { data: skill, error: skillError } = await supabase
      .from("skills")
      .select("id")
      .ilike("name", skill_name)
      .single();
    if (skillError && skillError.code !== "PGRST116") throw skillError;

    let skill_id = skill?.id;
    if (!skill_id) {
      const { data: newSkill, error: insertErr } = await supabase
        .from("skills")
        .insert([{ name: skill_name }])
        .select("id")
        .single();
      if (insertErr) throw insertErr;
      skill_id = newSkill.id;
    }

    const { data: link, error: linkErr } = await supabase
      .from("student_skills")
      .upsert([{ student_id, skill_id, level }])
      .select();
    if (linkErr) throw linkErr;

    res.json({
      message: "Skill linked successfully",
      student_id,
      skill_id,
      skill_name,
      level,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
