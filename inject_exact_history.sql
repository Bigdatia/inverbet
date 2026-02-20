-- Inyección exacta de datos proporcionados por el usuario
-- Periodo: 11 de feb al 15 de feb (Año: 2026)
-- No se modifica ni se borra la data existente

INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  -- 11 feb
  ('futbol', '', 'Man. City vs. Fulham', 'prematch', 'Over 0.5 Goles 1T', 1.33, ROUND(100/1.33), CASE WHEN ROUND(100/1.33) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-11 15:00:00', '3 - 0 (HT: 3-0)'),
  ('futbol', '', 'Aston Villa vs. Brighton', 'prematch', 'Over 1.5 Goles Totales', 1.25, ROUND(100/1.25), CASE WHEN ROUND(100/1.25) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-11 16:00:00', '1 - 0'),
  ('futbol', '', 'Bayern vs. RB Leipzig', 'prematch', 'Ambos Equipos Anotan', 1.57, ROUND(100/1.57), CASE WHEN ROUND(100/1.57) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-11 17:00:00', '2 - 0'),
  ('futbol', '', 'Sunderland vs. Liverpool', 'prematch', 'Over 0.5 Goles 1T', 1.3, ROUND(100/1.3), CASE WHEN ROUND(100/1.3) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-11 18:00:00', '0 - 1 (HT: 0-0)'),
  ('futbol', '', 'Sunderland vs. Liverpool', 'prematch', 'Más de 7.5 Córners', 1.4, ROUND(100/1.4), CASE WHEN ROUND(100/1.4) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-11 18:05:00', '14 Córners'),
  ('futbol', '', 'Inter Bogotá vs. Cali', 'prematch', 'Over 1.5 Goles Totales', 1.45, ROUND(100/1.45), CASE WHEN ROUND(100/1.45) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-11 19:00:00', '3 - 2'),

  -- 12 feb
  ('futbol', '', 'Thun vs. Lausanne', 'prematch', 'Ambos Equipos Anotan', 1.62, ROUND(100/1.62), CASE WHEN ROUND(100/1.62) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-12 15:00:00', '5 - 1'),
  ('futbol', '', 'Atleti vs. Barcelona', 'prematch', 'Over 0.5 Goles 1T', 1.36, ROUND(100/1.36), CASE WHEN ROUND(100/1.36) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-12 16:00:00', '4 - 0 (HT: 4-0)'),
  ('futbol', '', 'Brentford vs. Arsenal', 'prematch', 'Over 1.5 Goles Totales', 1.22, ROUND(100/1.22), CASE WHEN ROUND(100/1.22) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-12 17:00:00', '1 - 1'),
  ('futbol', '', 'Once Caldas vs. Junior', 'prematch', 'Over 1.5 Goles Totales', 1.5, ROUND(100/1.5), CASE WHEN ROUND(100/1.5) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-12 18:00:00', '2 - 1'),
  ('futbol', '', 'Nacional vs. Fortaleza', 'prematch', 'Over 0.5 Goles 1T', 1.38, ROUND(100/1.38), CASE WHEN ROUND(100/1.38) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-12 19:00:00', '4 - 1 (HT: 1-0)'),

  -- 13 feb
  ('futbol', '', 'Dortmund vs. Mainz', 'prematch', 'Over 0.5 Goles 1T', 1.28, ROUND(100/1.28), CASE WHEN ROUND(100/1.28) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-13 15:00:00', '4 - 0 (HT: 3-0)'),
  ('futbol', '', 'Hull vs. Chelsea', 'prematch', 'Gana Chelsea (ML)', 1.53, ROUND(100/1.53), CASE WHEN ROUND(100/1.53) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-13 16:00:00', '0 - 4'),
  ('futbol', '', 'Al-Ittihad vs. Al Fayha', 'prematch', 'Over 1.5 Goles Totales', 1.25, ROUND(100/1.25), CASE WHEN ROUND(100/1.25) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-13 17:00:00', '2 - 1'),
  ('futbol', '', 'Pisa vs. AC Milan', 'prematch', 'Más de 7.5 Córners', 1.44, ROUND(100/1.44), CASE WHEN ROUND(100/1.44) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-13 18:00:00', '4 Córners'),
  ('futbol', '', 'América vs. Santa Fe', 'prematch', 'Over 1.5 Goles Totales', 1.48, ROUND(100/1.48), CASE WHEN ROUND(100/1.48) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-13 19:00:00', '1 - 0'),

  -- 14 feb
  ('futbol', '', 'Leverkusen vs. St. Pauli', 'prematch', 'Over 1.5 Goles Totales', 1.2, ROUND(100/1.2), CASE WHEN ROUND(100/1.2) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 10:00:00', '4 - 0'),
  ('futbol', '', 'Hoffenheim vs. Friburgo', 'prematch', 'Over 0.5 Goles 1T', 1.33, ROUND(100/1.33), CASE WHEN ROUND(100/1.33) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-14 11:00:00', '3 - 0 (HT: 0-0)'),
  ('futbol', '', 'Bremen vs. Bayern', 'prematch', 'Over 2.5 Goles Totales', 1.4, ROUND(100/1.4), CASE WHEN ROUND(100/1.4) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 12:00:00', '0 - 3'),
  ('futbol', '', 'Marsella vs. Estrasburgo', 'prematch', 'Over 1.5 Goles Totales', 1.28, ROUND(100/1.28), CASE WHEN ROUND(100/1.28) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 13:00:00', '2 - 2'),
  ('futbol', '', 'St. Gallen vs. Grasshoppers', 'prematch', 'Over 1.5 Goles Totales', 1.22, ROUND(100/1.22), CASE WHEN ROUND(100/1.22) >= 80 THEN 'high' ELSE 'medium' END, 'lost', true, '2026-02-14 14:00:00', '0 - 0'),
  ('futbol', '', 'Zúrich vs. Lucerna', 'prematch', 'Over 0.5 Goles 1T', 1.36, ROUND(100/1.36), CASE WHEN ROUND(100/1.36) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 15:00:00', '1 - 4 (HT: 0-2)'),
  ('futbol', '', 'Inter vs. Juventus', 'prematch', 'Más de 7.5 Córners', 1.4, ROUND(100/1.4), CASE WHEN ROUND(100/1.4) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 16:00:00', '11 Córners'),
  ('futbol', '', 'Real Madrid vs. R. Sociedad', 'prematch', 'Gana Real Madrid (ML)', 1.57, ROUND(100/1.57), CASE WHEN ROUND(100/1.57) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 17:00:00', '4 - 1'),
  ('futbol', '', 'Liverpool vs. Brighton', 'prematch', 'Over 0.5 Goles 1T', 1.3, ROUND(100/1.3), CASE WHEN ROUND(100/1.3) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 18:00:00', '3 - 0 (HT: 1-0)'),
  ('futbol', '', 'Medellín vs. Pereira', 'prematch', 'Over 1.5 Goles Totales', 1.45, ROUND(100/1.45), CASE WHEN ROUND(100/1.45) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-14 19:00:00', '1 - 1'),

  -- 15 feb
  ('futbol', '', 'Udinese vs. Sassuolo', 'prematch', 'Over 0.5 Goles 1T', 1.4, ROUND(100/1.4), CASE WHEN ROUND(100/1.4) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 15:00:00', '2 - 1 (HT: 1-1)'),
  ('futbol', '', 'Cercle vs. Club Brujas', 'prematch', 'Over 1.5 Goles Totales', 1.25, ROUND(100/1.25), CASE WHEN ROUND(100/1.25) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 16:00:00', '1 - 2'),
  ('futbol', '', 'Thun vs. Sion', 'prematch', 'Over 1.5 Goles Totales', 1.22, ROUND(100/1.22), CASE WHEN ROUND(100/1.22) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 17:00:00', '2 - 1'),
  ('futbol', '', 'Oxford Utd vs. Sunderland', 'prematch', 'Over 0.5 Goles 1T', 1.44, ROUND(100/1.44), CASE WHEN ROUND(100/1.44) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 18:00:00', '0 - 2 (HT: 0-1)'),
  ('futbol', '', 'Stoke vs. Fulham', 'prematch', 'Over 0.5 Goles 1T', 1.44, ROUND(100/1.44), CASE WHEN ROUND(100/1.44) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 18:30:00', '0 - 1 (HT: 0-1)'),
  ('futbol', '', 'Rayo vs. Atleti', 'prematch', 'Over 1.5 Goles Totales', 1.33, ROUND(100/1.33), CASE WHEN ROUND(100/1.33) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 19:00:00', '1 - 3'),
  ('futbol', '', 'Leipzig vs. Wolfsburgo', 'prematch', 'Over 0.5 Goles 1T', 1.3, ROUND(100/1.3), CASE WHEN ROUND(100/1.3) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 19:30:00', '2 - 0 (HT: 1-0)'),
  ('futbol', '', 'Cali vs. Nacional', 'prematch', 'Doble Op. (Cali o Empate)', 1.62, ROUND(100/1.62), CASE WHEN ROUND(100/1.62) >= 80 THEN 'high' ELSE 'medium' END, 'won', true, '2026-02-15 20:00:00', '1 - 1');
