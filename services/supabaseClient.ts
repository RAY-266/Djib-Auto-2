
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dhjibffaytxlfwmskeml.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dm086Ipr0gLyTXa4DpKawg_Z0rDf4Cz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
