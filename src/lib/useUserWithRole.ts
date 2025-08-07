import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useUserWithRole() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Auth user:', user, userError);
      setUser(user);
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        console.log('Profile fetch:', data, error);
        setRole(data?.role || '');
      } else {
        setRole('');
      }
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => getUser());
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return { user, role, loading };
}
