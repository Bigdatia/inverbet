UPDATE public.signals
SET 
  stake = ROUND(100 / NULLIF(odds, 0)),
  confidence = CASE 
                  WHEN ROUND(100 / NULLIF(odds, 0)) >= 80 THEN 'high'
                  ELSE 'medium'
               END
WHERE odds IS NOT NULL AND odds > 0;
