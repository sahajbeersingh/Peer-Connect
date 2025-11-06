import express from "express";
import supabase from '../config/supabaseClient.js';
const router = express.Router();

router.post("/", async (req, res) => {
  const { requester_email, title, description, skill_name, preferred_mode, meeting_link } = req.body;

  try {
    const { data: requester, error: requesterError } = await supabase
      .from("students")
      .select("id")
      .eq("email", requester_email)
      .single();

    if (requesterError) throw new Error("Requester not found");
    const requester_id = requester.id;

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

    const { data, error } = await supabase
      .from("help_requests")
      .insert([
        {
          requester_id,
          title,
          description,
          skill_id,
          preferred_mode,
          meeting_link,
          status: "Open",
        },
      ])
      .select();

    if (error) throw error;

    res.json({
      message: "Help request created successfully",
      requester_email,
      skill_name,
      request: data[0],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("help_requests")
    .select("id, title, description, status, meeting_link, skill_id, requester_id")
    .order("id", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
