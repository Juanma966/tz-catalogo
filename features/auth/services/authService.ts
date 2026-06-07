import { createClient } from '@/lib/supabase/client';
import type { Usuario } from '../types/auth.types';

export const authService = {
  async login(email: string, contrasena: string) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: contrasena,
    });
    if (error) throw new Error(error.message);
    return data;
  },

  async logout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) return null;
    return data as Usuario;
  },
};
