DELETE FROM public.signals
WHERE match IN (
  'Manchester City vs Liverpool',
  'Real Madrid vs Barcelona',
  'Juventus vs AC Milan',
  'Bayern Munich vs Borussia Dortmund',
  'PSG vs Marseille'
);
