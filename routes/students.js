import express from "express";
import supabase from '../config/supabaseClient.js';
const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("students").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Update student skills
router.put("/:id/skills", async (req, res) => {
  const { id } = req.params;
  const { skills } = req.body;
  const inserts = skills.map((s) => ({ student_id: id, ...s }));
  const { error } = await supabase.from("student_skills").upsert(inserts);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Skills updated" });
});

router.post("/", async (req, res) => {
  const { data, error } = await supabase.from("students").insert([req.body]).select();
  if (error) return res.status(400).json(error);
  res.json(data[0]);
});

// Get a single student by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

export default router;
