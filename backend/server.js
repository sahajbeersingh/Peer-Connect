import 'dotenv/config';
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

import studentRoutes from "./routes/students.js";
import requestRoutes from "./routes/requests.js";
import assignmentRoutes from "./routes/assignments.js";
import ratingRoutes from "./routes/ratings.js";
import skillRoutes from "./routes/skills.js";
import studentSkillRoutes from "./routes/studentskills.js";

app.use("/api/student-skills", studentSkillRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/ratings", ratingRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
