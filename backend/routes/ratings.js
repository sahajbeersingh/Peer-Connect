import express from "express";
import supabase from "../config/supabaseClient.js";
const router = express.Router();

// router.post("/", async (req, res) => {
//   const { assignment_id, rater_email, score, comment } = req.body;

//   try {
//     const { data: rater, error: raterError } = await supabase
//       .from("students")
//       .select("id")
//       .eq("email", rater_email)
//       .single();
//     if (raterError) throw new Error("Rater not found");
//     const rater_id = rater.id;

//     const { data, error } = await supabase
//       .from("ratings")
//       .insert([{ assignment_id, rater_id, score, comment }])
//       .select();
//     if (error) throw error;

//     await supabase
//       .from("help_requests")
//       .update({ status: "Closed" })
//       .eq("id", assignment_id);

//     res.json({
//       message: "Rating added successfully",
//       rater_email,
//       rater_id,
//       rating: data[0],
//     });
// });

router.post("/", async (req, res) => {
  const { assignment_id, rater_email, score, comment } = req.body;

  try {
    const { data: rater, error: raterError } = await supabase
      .from("students")
      .select("id")
      .eq("email", rater_email)
      .single();
    if (raterError) throw new Error("Rater not found");
    const rater_id = rater.id;
    const { data, error } = await supabase
      .from("ratings")
      .insert([{ assignment_id, rater_id, score, comment }])
      .select();
    if (error) throw error;
    const { data: assignmentRow, error: assignErr } = await supabase
      .from("assignments")
      .select("request_id")
      .eq("id", assignment_id)
      .single();

    if (assignErr) {
      console.error("Failed to fetch assignment for rating:", assignErr);
    } else {
      const requestIdToClose = assignmentRow.request_id;
      const { error: updateErr } = await supabase
        .from("help_requests")
        .update({ status: "Closed" })
        .eq("id", requestIdToClose);

      if (updateErr) console.error("Failed to close help_request:", updateErr);
    }

    res.json({
      message: "Rating added successfully",
      rater_email,
      rater_id,
      rating: data[0],
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  const { data, error } = await supabase
    .from("students")
    .select("id, name, email, rating_avg")
    .order("rating_avg", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
