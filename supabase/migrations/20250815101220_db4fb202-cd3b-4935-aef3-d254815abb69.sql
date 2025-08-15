-- Clean up question text by removing topic prefixes like "Mechanics Q1:", "Alcohols Q2:", etc.
UPDATE public.questions 
SET question = REGEXP_REPLACE(
  question, 
  '^[A-Za-z\s&]+\s+Q\d+:\s*', 
  '', 
  'g'
)
WHERE question ~ '^[A-Za-z\s&]+\s+Q\d+:\s*';