import type { User } from '@supabase/supabase-js';

export interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  rol: 'admin' | 'empleado';
  empresa_id: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  usuario: Usuario | null;
  loading: boolean;
  logout: () => Promise<void>;
}
