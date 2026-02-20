-- Script para insertar los partidos solicitados (17 al 22 de Febrero)

INSERT INTO public.signals (
    created_at, 
    match, 
    market, 
    sport, 
    league, 
    odds, 
    confidence, 
    status, 
    analysis, 
    is_premium,
    type
) VALUES 
-- 17 Feb 
('2026-02-17 12:00:00+00', 'Benfica vs. Real Madrid', 'Ambos marcan', 'Fútbol', 'Europa', 1.57, 'medium', 'lost', 'Análisis general', true, 'prematch'),
('2026-02-17 13:00:00+00', 'Dortmund vs. Atalanta', 'Doble Op. (1X)', 'Fútbol', 'Europa', 1.33, 'medium', 'won', 'Análisis general', true, 'prematch'),
('2026-02-17 14:00:00+00', 'Mónaco vs. PSG', 'Ambos marcan', 'Fútbol', 'Europa', 1.61, 'medium', 'won', 'Análisis general', true, 'prematch'),

-- 18 Feb
('2026-02-18 12:00:00+00', 'Wolves vs. Arsenal', 'Gana Arsenal', 'Fútbol', 'Inglaterra', 1.29, 'high', 'won', 'Análisis general', true, 'prematch'),
('2026-02-18 13:00:00+00', 'Bodo/Glimt vs. Inter', 'Ambos marcan', 'Fútbol', 'Europa', 1.65, 'medium', 'won', 'Análisis general', true, 'prematch'),

-- 19 Feb
('2026-02-19 12:00:00+00', 'AC Milán vs. Como', 'Gana Milán', 'Fútbol', 'Italia', 1.30, 'high', 'won', 'Análisis general', true, 'prematch'),
('2026-02-19 13:00:00+00', 'Jagiellonia vs. Fiorentina', 'Ambos marcan', 'Fútbol', 'Europa', 1.66, 'medium', 'lost', 'Análisis general', true, 'prematch'),

-- 20 Feb (En Vivo / Por empezar -> status: pending)
('2026-02-20 12:00:00+00', 'Sittard vs. Excelsior', 'Over 0.5 Goles 1T', 'Fútbol', 'Holanda', 1.36, 'medium', 'pending', 'Análisis general', true, 'live'),
('2026-02-20 13:00:00+00', 'Mainz vs. Hamburgo', 'Doble Op. (1X)', 'Fútbol', 'Alemania', 1.30, 'high', 'pending', 'Análisis general', true, 'live'),
('2026-02-20 14:00:00+00', 'Sassuolo vs. Verona', 'Gana Local', 'Fútbol', 'Italia', 1.83, 'medium', 'pending', 'Análisis general', true, 'live'),

-- 21 Feb (Futuros -> status: pending)
('2026-02-21 12:00:00+00', 'Leverkusen vs. Frankfurt', 'Ambos marcan', 'Fútbol', 'Alemania', 1.50, 'medium', 'pending', 'Análisis general', true, 'prematch'),
('2026-02-21 13:00:00+00', 'Once Caldas vs. Fortaleza', 'Over 1.5 Goles', 'Fútbol', 'Colombia', 1.40, 'medium', 'pending', 'Análisis general', true, 'prematch'),
('2026-02-21 14:00:00+00', 'Nacional vs. Alianza FC', 'Over 1.5 Goles', 'Fútbol', 'Colombia', 1.36, 'medium', 'pending', 'Análisis general', true, 'prematch'),

-- 22 Feb (Futuros -> status: pending)
('2026-02-22 12:00:00+00', 'Man. City vs. Newcastle', 'Over 0.5 Goles 1T', 'Fútbol', 'Inglaterra', 1.28, 'high', 'pending', 'Análisis general', true, 'prematch'),
('2026-02-22 13:00:00+00', 'Tottenham vs. Arsenal', 'Over 1.5 Goles', 'Fútbol', 'Inglaterra', 1.22, 'high', 'pending', 'Análisis general', true, 'prematch'),
('2026-02-22 14:00:00+00', 'Barcelona vs. Levante', 'Over 2.5 Goles', 'Fútbol', 'España', 1.23, 'high', 'pending', 'Análisis general', true, 'prematch'),
('2026-02-22 15:00:00+00', 'Santa Fe vs. Junior', 'Over 1.5 Goles', 'Fútbol', 'Colombia', 1.45, 'medium', 'pending', 'Análisis general', true, 'prematch');
