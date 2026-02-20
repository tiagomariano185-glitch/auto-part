
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = 'https://uooojpqikvntlqfnchil.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_hZ9CfPf12d8u6QgEPfJmvg_wldEd9gt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
