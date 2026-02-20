import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const index = line.indexOf('=');
    if (index > 0) {
      const key = line.substring(0, index).trim();
      const val = line.substring(index + 1).trim().replace(/^"|"$/g, '');
      process.env[key] = val;
    }
  });
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Based on the user's Excel image provided
// Columns: Date (11 feb - 15 feb), Match, Market, Odds, Result, Won/Lost

const historicalSignals = [
  // 11 Feb
  { match: "Man. City vs. Fulham", date: "2024-02-11T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.33, status: "won" },
  { match: "Aston Villa vs. Brighton", date: "2024-02-11T12:05:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "lost" },
  { match: "Bayern vs. RB Leipzig", date: "2024-02-11T12:10:00Z", market: "Ambos Equipos Anotan", odds: 1.57, status: "lost" },
  { match: "Sunderland vs. Liverpool", date: "2024-02-11T12:15:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "lost" },
  { match: "Sunderland vs. Liverpool", date: "2024-02-11T12:20:00Z", market: "Más de 7.5 Córners", odds: 1.40, status: "won" },
  { match: "Inter Bogotá vs. Cali", date: "2024-02-11T12:25:00Z", market: "Over 1.5 Goles Totales", odds: 1.45, status: "won" },
  
  // 12 Feb
  { match: "Thun vs. Lausanne", date: "2024-02-12T12:00:00Z", market: "Ambos Equipos Anotan", odds: 1.62, status: "won" },
  { match: "Atleti vs. Barcelona", date: "2024-02-12T12:05:00Z", market: "Over 0.5 Goles 1T", odds: 1.36, status: "won" },
  { match: "Brentford vs. Arsenal", date: "2024-02-12T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "won" },
  { match: "Once Caldas vs. Junior", date: "2024-02-12T12:15:00Z", market: "Over 1.5 Goles Totales", odds: 1.50, status: "won" },
  { match: "Nacional vs. Fortaleza", date: "2024-02-12T12:20:00Z", market: "Over 0.5 Goles 1T", odds: 1.38, status: "won" },

  // 13 Feb
  { match: "Dortmund vs. Mainz", date: "2024-02-13T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.28, status: "won" },
  { match: "Hull vs. Chelsea", date: "2024-02-13T12:05:00Z", market: "Gana Chelsea (ML)", odds: 1.53, status: "won" },
  { match: "Al-Ittihad vs. Al Fayha", date: "2024-02-13T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "won" },
  { match: "Pisa vs. AC Milan", date: "2024-02-13T12:15:00Z", market: "Más de 7.5 Córners", odds: 1.44, status: "lost" },
  { match: "América vs. Santa Fe", date: "2024-02-13T12:20:00Z", market: "Over 1.5 Goles Totales", odds: 1.48, status: "lost" },

  // 14 Feb
  { match: "Leverkusen vs. St. Pauli", date: "2024-02-14T12:00:00Z", market: "Over 1.5 Goles Totales", odds: 1.20, status: "won" },
  { match: "Hoffenheim vs. Friburgo", date: "2024-02-14T12:05:00Z", market: "Over 0.5 Goles 1T", odds: 1.33, status: "lost" },
  { match: "Bremen vs. Bayern", date: "2024-02-14T12:10:00Z", market: "Over 2.5 Goles Totales", odds: 1.40, status: "won" },
  { match: "Marsella vs. Estrasburgo", date: "2024-02-14T12:15:00Z", market: "Over 1.5 Goles Totales", odds: 1.28, status: "won" },
  { match: "St. Gallen vs. Grasshoppers", date: "2024-02-14T12:20:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "lost" },
  { match: "Zúrich vs. Lucerna", date: "2024-02-14T12:25:00Z", market: "Over 0.5 Goles 1T", odds: 1.36, status: "won" },
  { match: "Inter vs. Juventus", date: "2024-02-14T12:30:00Z", market: "Más de 7.5 Córners", odds: 1.40, status: "won" },
  { match: "Real Madrid vs. R. Sociedad", date: "2024-02-14T12:35:00Z", market: "Gana Real Madrid (ML)", odds: 1.57, status: "won" },
  { match: "Liverpool vs. Brighton", date: "2024-02-14T12:40:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "won" },
  { match: "Medellín vs. Pereira", date: "2024-02-14T12:45:00Z", market: "Over 1.5 Goles Totales", odds: 1.45, status: "won" },

  // 15 Feb
  { match: "Udinese vs. Sassuolo", date: "2024-02-15T12:00:00Z", market: "Over 0.5 Goles 1T", odds: 1.40, status: "won" },
  { match: "Cercle vs. Club Brujas", date: "2024-02-15T12:05:00Z", market: "Over 1.5 Goles Totales", odds: 1.25, status: "won" },
  { match: "Thun vs. Sion", date: "2024-02-15T12:10:00Z", market: "Over 1.5 Goles Totales", odds: 1.22, status: "won" },
  { match: "Oxford Utd vs. Sunderland", date: "2024-02-15T12:15:00Z", market: "Over 0.5 Goles 1T", odds: 1.44, status: "won" },
  { match: "Stoke vs. Fulham", date: "2024-02-15T12:20:00Z", market: "Over 0.5 Goles 1T", odds: 1.44, status: "won" },
  { match: "Rayo vs. Atleti", date: "2024-02-15T12:25:00Z", market: "Over 1.5 Goles Totales", odds: 1.33, status: "won" },
  { match: "Leipzig vs. Wolfsburgo", date: "2024-02-15T12:30:00Z", market: "Over 0.5 Goles 1T", odds: 1.30, status: "won" },
  { match: "Cali vs. Nacional", date: "2024-02-15T12:35:00Z", market: "Doble Op. (Cali o Empate)", odds: 1.62, status: "won" }
];

async function seedSignals() {
  console.log("Preparing to insert", historicalSignals.length, "signals...");

  for (const signal of historicalSignals) {
    const payload = {
      sport: "futbol",
      league: "Histórico", // Placeholder
      match: signal.match,
      type: "prematch",
      market: signal.market,
      odds: signal.odds,
      stake: 85, // Default probability mock for UI
      confidence: "high", 
      status: signal.status,
      analysis: "Señal histórica importada de Excel",
      is_premium: true,
      created_at: signal.date,
    };

    const { error } = await supabase.from("signals").insert([payload]);

    if (error) {
      console.error(`❌ Failed to insert: ${signal.match}`, error.message);
    } else {
      console.log(`✅ Inserted: ${signal.match} - ${signal.status}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seedSignals();
