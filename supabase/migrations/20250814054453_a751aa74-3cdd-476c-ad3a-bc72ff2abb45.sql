-- Create RLS policies for the questions table to secure it properly
-- The existing RPC functions are SECURITY DEFINER so they will bypass these policies

-- Policy to deny direct SELECT access to regular users
-- Questions should only be accessed through the secure RPC functions
CREATE POLICY "Deny direct access to questions" 
ON public.questions 
FOR SELECT 
USING (false);

-- Policy to deny INSERT operations to regular users
CREATE POLICY "Deny insert to questions" 
ON public.questions 
FOR INSERT 
WITH CHECK (false);

-- Policy to deny UPDATE operations to regular users  
CREATE POLICY "Deny update to questions" 
ON public.questions 
FOR UPDATE 
USING (false);

-- Policy to deny DELETE operations to regular users
CREATE POLICY "Deny delete to questions" 
ON public.questions 
FOR DELETE 
USING (false);