import express from "express";
import supabase from '../config/supabaseClient.js';
const router = express.Router();

router.post("/", async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase
    .from("skills")
    .insert([{ name }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("skills").select("*").order("id");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: error.message || "Skill not found" });
  }
  res.json(data);
});

export default router;
