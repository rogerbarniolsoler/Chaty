import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export const useUsuariStore = create((set) => ({
  sessio: null,
  carregant: true,

  setSessio: (sessio) => set({ sessio, carregant: false }),

  inicialitzar: async () => {
    // Agafem 'session' de Supabase i ho assignem explícitament a 'sessio'
    const { data: { session } } = await supabase.auth.getSession();
    set({ sessio: session, carregant: false });
  },

  tancarSessio: async () => {
    await supabase.auth.signOut();
    set({ sessio: null });
  },
}));