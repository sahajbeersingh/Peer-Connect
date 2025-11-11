import express from "express";
import supabase from '../config/supabaseClient.js';

const router = express.Router();

router.post("/", async (req, res) => {
  const { request_id, helper_email, remarks } = req.body;

  try {
    const { data: helper, error: helperError } = await supabase
      .from("students")
      .select("id")
      .eq("email", helper_email)
      .single();
    if (helperError) throw new Error("Helper not found");

    const helper_id = helper.id;

    const { data, error } = await supabase
      .from("assignments")
      .insert([{ request_id, helper_id, status: "Active", remarks  }])
      .select();
    if (error) throw error;

    await supabase
      .from("help_requests")
      .update({ status: "Assigned" })
      .eq("id", request_id);

    res.json({
      message: "Helper assigned successfully",
      request_id,
      helper_id,
      helper_email,
      assignment: data[0],
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/request/:request_id", async (req, res) => {
  const { request_id } = req.params;
  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("request_id", request_id)
      .order("assigned_at", { ascending: false });

    if (error) throw error;
    if (data.length === 0) throw new Error("No assignment found for this request.");

    res.json(data[0]);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

export default router;
