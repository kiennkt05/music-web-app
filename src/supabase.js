import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mtwoqmnswxvrvpoxbcgw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d29xbW5zd3h2cnZwb3hiY2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Mzc1MjcsImV4cCI6MjA1ODAxMzUyN30.dwTLWaQvoB7XMhv-Jepo8GaS1RkCXcQgVNLlQoMuAiY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
