import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if(!supabaseUrl || !supabaseKey) {
  console.error("Please set SUPABASE_URL and SUPABASE_KEY in env");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;


