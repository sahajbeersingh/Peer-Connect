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

router.get("/:student_id", async (req, res) => {
  const { student_id } = req.params;

  const { data, error } = await supabase
    .from("student_skills")
    .select(`
      level,
      skills(name)
    `)
    .eq("student_id", student_id);

  if (error) return res.status(400).json({ error: error.message });

  // Flatten skill name for cleaner frontend display
  const formatted = data.map(item => ({
    skill_name: item.skills.name,
    level: item.level
  }));

  res.json(formatted);
});

export default router;
