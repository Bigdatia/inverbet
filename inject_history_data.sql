-- Inyección de historial de señales finalizadas para Estadísticas
-- Rango de fechas: 11 de febrero 2026 al 19 de febrero 2026

INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  -- 11 de Febrero
  ('futbol', 'Premier League', 'Aston Villa vs. Chelsea', 'prematch', 'Ambos marcan', 1.75, 57, 'medium', 'won', true, '2026-02-11 15:00:00', ''),
  ('futbol', 'La Liga', 'Sevilla vs. Real Sociedad', 'prematch', 'Over 1.5 goles', 1.35, 74, 'medium', 'won', true, '2026-02-11 16:30:00', ''),
  
  -- 12 de Febrero
  ('futbol', 'Serie A', 'Napoli vs. AS Roma', 'prematch', 'Gana Local', 2.10, 48, 'medium', 'lost', true, '2026-02-12 14:45:00', ''),
  ('futbol', 'Bundesliga', 'Stuttgart vs. Leverkusen', 'prematch', 'Over 2.5 goles', 1.65, 61, 'medium', 'won', true, '2026-02-12 15:30:00', ''),
  
  -- 13 de Febrero
  ('futbol', 'Ligue 1', 'Lyon vs. Mónaco', 'prematch', 'Over 0.5 Goles 1T', 1.40, 71, 'medium', 'won', true, '2026-02-13 15:00:00', ''),
  ('futbol', 'Eredivisie', 'Ajax vs. PSV', 'prematch', 'Ambos marcan', 1.55, 65, 'medium', 'won', true, '2026-02-13 14:00:00', ''),
  
  -- 14 de Febrero
  ('futbol', 'Premier League', 'Arsenal vs. Man United', 'prematch', 'Gana Local', 1.85, 54, 'medium', 'won', true, '2026-02-14 11:30:00', ''),
  ('futbol', 'La Liga', 'Athletic Club vs. Betis', 'prematch', 'Doble Op. (1X)', 1.25, 80, 'high', 'won', true, '2026-02-14 16:00:00', ''),
  ('futbol', 'Serie A', 'Lazio vs. Inter', 'prematch', 'Over 1.5 goles', 1.32, 76, 'medium', 'lost', true, '2026-02-14 14:45:00', ''),
  
  -- 15 de Febrero
  ('futbol', 'Bundesliga', 'Werder Bremen vs. Bayern', 'prematch', 'Gana Visitante', 1.30, 77, 'medium', 'won', true, '2026-02-15 09:30:00', ''),
  ('futbol', 'Ligue 1', 'PSG vs. Lille', 'prematch', 'Over 2.5 Goles', 1.50, 67, 'medium', 'won', true, '2026-02-15 11:00:00', ''),
  
  -- 16 de Febrero
  ('futbol', 'Champions League', 'Real Madrid vs. Napoli', 'prematch', 'Gana Local', 1.65, 61, 'medium', 'won', true, '2026-02-16 15:00:00', ''),
  ('futbol', 'Champions League', 'Arsenal vs. Inter', 'prematch', 'Over 1.5 goles', 1.28, 78, 'medium', 'won', true, '2026-02-16 15:00:00', ''),
  ('futbol', 'Champions League', 'Dortmund vs. PSG', 'prematch', 'Ambos marcan', 1.60, 63, 'medium', 'lost', true, '2026-02-16 15:00:00', ''),
  
  -- 17 de Febrero
  ('futbol', 'Champions League', 'Man City vs. Bayern', 'prematch', 'Over 2.5 goles', 1.55, 65, 'medium', 'won', true, '2026-02-17 15:00:00', ''),
  ('futbol', 'Champions League', 'Barcelona vs. Juventus', 'prematch', 'Doble Op. (1X)', 1.22, 82, 'high', 'won', true, '2026-02-17 15:00:00', ''),
  
  -- 18 de Febrero
  ('futbol', 'Europa League', 'Liverpool vs. Roma', 'prematch', 'Gana Local', 1.45, 69, 'medium', 'won', true, '2026-02-18 15:00:00', ''),
  ('futbol', 'Europa League', 'Bayer Leverkusen vs. Milan', 'prematch', 'Ambos marcan', 1.70, 59, 'medium', 'won', true, '2026-02-18 15:00:00', ''),
  ('futbol', 'Europa League', 'Sporting CP vs. Villarreal', 'prematch', 'Over 1.5 goles', 1.30, 77, 'medium', 'lost', true, '2026-02-18 13:45:00', ''),
  
  -- 19 de Febrero
  ('futbol', 'La Liga', 'Girona vs. Atlético Madrid', 'prematch', 'Over 0.5 Goles 1T', 1.45, 69, 'medium', 'won', true, '2026-02-19 15:00:00', ''),
  ('futbol', 'Premier', 'Brighton vs. Tottenham', 'prematch', 'Ambos marcan', 1.50, 67, 'medium', 'won', true, '2026-02-19 16:00:00', ''),
  ('futbol', 'Serie A', 'Juventus vs. Fiorentina', 'prematch', 'Gana Local', 1.80, 56, 'medium', 'lost', true, '2026-02-19 14:45:00', '');
