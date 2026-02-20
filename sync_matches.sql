-- Primero, vamos a configurar todas las señales existentes a las fechas/horas enviadas.
-- Luego, vamos a insertar aquellas que faltan (o usar UPSERT si coinciden en nombre y fecha).

-- Dia 20 Feb
UPDATE public.signals SET created_at = '2024-02-20 14:00:00' WHERE match = 'Sittard vs. Excélsior' AND CAST(created_at AS DATE) = '2024-02-20';
UPDATE public.signals SET created_at = '2024-02-20 14:30:00' WHERE match = 'Mainz vs. Hamburgo' AND CAST(created_at AS DATE) = '2024-02-20';
UPDATE public.signals SET created_at = '2024-02-20 14:45:00' WHERE match = 'Sassuolo vs. Verona' AND CAST(created_at AS DATE) = '2024-02-20';

-- Faltantes del 20 Feb
INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  ('futbol', 'Ligue 1', 'Brest vs. Marsella', 'prematch', 'Over 1.5 goles', 1.28, 78, 'medium', 'won', true, '2024-02-20 14:45:00', ''),
  ('futbol', 'Pro League', 'Gent vs. Cercle Brujas', 'prematch', 'Over 1.5 goles', 1.25, 80, 'high', 'won', true, '2024-02-20 14:45:00', '');

-- Dia 21 Feb
-- Faltantes
INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  ('futbol', 'Bundesliga', 'Bayern vs. Frankfurt', 'prematch', 'Ambos marcan', 1.50, 67, 'medium', 'pending', true, '2024-02-21 09:30:00', ''),
  ('futbol', 'Bundesliga', 'Wolfsburgo vs. Augsburgo', 'prematch', 'Over 1.5 goles', 1.25, 80, 'high', 'pending', true, '2024-02-21 09:30:00', ''),
  ('futbol', 'Premier League', 'Chelsea vs. Burnley', 'prematch', 'Over 0.5 Goles 1T', 1.30, 77, 'medium', 'pending', true, '2024-02-21 10:00:00', ''),
  ('futbol', 'Bundesliga', 'Leipzig vs. Dortmund', 'prematch', 'Gol en el 1T', 1.28, 78, 'medium', 'pending', true, '2024-02-21 11:30:00', ''),
  ('futbol', 'La Liga', 'Osasuna vs. Real Madrid', 'prematch', 'Gana Visitante', 1.57, 64, 'medium', 'pending', true, '2024-02-21 12:30:00', '');

-- Existentes
UPDATE public.signals SET created_at = '2024-02-21 14:00:00', market = 'Over 1.5 goles' WHERE match ILIKE '%Once Caldas%Fortaleza%' AND CAST(created_at AS DATE) = '2024-02-21';
-- Notar el ILIKE debido a Man. City
UPDATE public.signals SET created_at = '2024-02-21 15:00:00', market = '0.5 goles 1T' WHERE match ILIKE '%City%Newcastle%' AND CAST(created_at AS DATE) = '2024-02-21';
UPDATE public.signals SET created_at = '2024-02-21 18:20:00' WHERE match ILIKE '%Nacional%Alianza FC%' AND CAST(created_at AS DATE) = '2024-02-21';

-- Dia 22 Feb
-- Faltantes
INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  ('futbol', 'Eredivisie', 'AZ Alkmaar vs. Rotterdam', 'prematch', 'Over 0.5 Goles 1T', 1.33, 75, 'medium', 'pending', true, '2024-02-22 07:45:00', ''),
  ('futbol', 'La Liga', 'Barcelona vs. Levante', 'prematch', 'Over 2.5 Goles', 1.44, 69, 'medium', 'pending', true, '2024-02-22 10:15:00', ''),
  ('futbol', 'Super League', 'Sion vs. Young Boys', 'prematch', 'Over 0.5 Goles 1T', 1.33, 75, 'medium', 'pending', true, '2024-02-22 10:30:00', '');

-- Existentes
UPDATE public.signals SET created_at = '2024-02-22 11:30:00' WHERE match ILIKE '%Tottenham%Arsenal%' AND CAST(created_at AS DATE) = '2024-02-22';

-- Faltantes extra del 22 Feb
INSERT INTO public.signals (sport, league, match, type, market, odds, stake, confidence, status, is_premium, created_at, analysis) 
VALUES 
  ('futbol', 'Premier', 'Forest vs. Liverpool', 'prematch', 'Over 8.5 Córners', 1.40, 71, 'medium', 'pending', true, '2024-02-22 11:30:00', ''),
  ('futbol', 'Eerste Divisie', 'Telstar vs. Feyenoord', 'prematch', 'Over 0.5 Goles 1T', 1.30, 77, 'medium', 'pending', true, '2024-02-22 14:00:00', ''),
  ('futbol', 'La Liga', 'Villarreal vs. Valencia', 'prematch', 'Over 1.5 goles', 1.28, 78, 'medium', 'pending', true, '2024-02-22 15:00:00', '');

-- Existente 
UPDATE public.signals SET created_at = '2024-02-22 16:00:00' WHERE match ILIKE '%Santa Fe%Junior%' AND CAST(created_at AS DATE) = '2024-02-22';
