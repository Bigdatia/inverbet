-- Seed initial signals
INSERT INTO public.signals (sport, league, match, type, market, odds, stake, status, analysis, is_premium, confidence, created_at)
VALUES 
(
  'futbol', 
  'Premier League', 
  'Manchester City vs Liverpool', 
  'prematch', 
  'Valor en Over 2.5 Goles', 
  2.1, 
  3, 
  'pending', 
  'El algoritmo ha detectado una discrepancia entre las cuotas del mercado y la probabilidad real basada en datos históricos. Ambos equipos han marcado en el 87% de sus últimos enfrentamientos, y el promedio de goles es de 3.2 por partido.', 
  false, 
  'high',
  NOW()
),
(
  'futbol', 
  'La Liga', 
  'Real Madrid vs Barcelona', 
  'prematch', 
  'Ambos Equipos Marcan: Sí', 
  1.95, 
  2, 
  'pending', 
  'En los últimos 10 clásicos, ambos equipos han marcado en 8 ocasiones. Las cuotas actuales sugieren una oportunidad de valor dado el rendimiento ofensivo de ambos equipos esta temporada.', 
  true, 
  'high',
  NOW() - interval '1 hour'
),
(
  'futbol', 
  'Serie A', 
  'Juventus vs AC Milan', 
  'prematch', 
  'Más de 1.5 Goles Primera Parte', 
  2.45, 
  1, 
  'pending', 
  'Ambos equipos tienen un inicio de partido agresivo. El 65% de los goles de Juventus y el 58% de los goles de Milan se producen en la primera mitad.', 
  false, 
  'medium',
  NOW() - interval '2 hours'
),
(
  'futbol', 
  'Bundesliga', 
  'Bayern Munich vs Borussia Dortmund', 
  'prematch', 
  'Victoria Local', 
  1.75, 
  4, 
  'pending', 
  'Bayern Munich tiene un 78% de victorias en casa esta temporada. Contra rivales directos, su rendimiento sube al 85%. Las cuotas actuales ofrecen valor.', 
  true, 
  'high',
  NOW() - interval '3 hours'
);
