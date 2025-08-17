import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { api } from '../lib/clients';
import { UserType } from '../lib/types';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'editor';
  editorId?: string;
  youtubeConnected?: boolean;
}

type AuthInput = {
  accessToken: string,
  type: UserType
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: AuthInput) => Promise<boolean>;
  signup: (data: AuthInput) => Promise<boolean>;
  logout: () => Promise<boolean>;
  session: () => Promise<boolean>;
  connectYouTube: () => void;
}

export const useAuthStore = create<AuthStore>()(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    login: async (data) => {
      try {
        await api.post("/auth/login", data);
        await get().session();
        toast.success("Authentication successful!");
        return true;
      } catch (e) {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message);
        } else {
          toast.error("Error authenticating please try again!");
        }
      }
      return false;
    },
    signup: async (data) => {
      try {
        await api.post("/auth/signup", data);
        await get().session();
        toast.success("Authentication successful!");
        return true;
      } catch (e) {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message);
        } else {
          toast.error("Error authenticating please try again!");
        }
      }
      return false;
    },
    session: async () => {
      try {
        const data = await api.get("/auth/session");
        console.log("session data: ", data);
        set({ isAuthenticated: true });
        return true;
      } catch { /* empty */ }
      return false;
    },
    logout: async () => {
      try {
        await api.get("/auth/logout");
        set({ user: null, isAuthenticated: false })
        toast.success("Logout successful!");
        return true;
      } catch (e) {
        if (isAxiosError(e)) {
          toast.error(e.response?.data.message);
        } else {
          toast.error("Error logging out please try again!");
        }
      }
      return false;
    }
    ,
    connectYouTube: () => set((state) => ({
      user: state.user ? { ...state.user, youtubeConnected: true } : null
    })),
  })
);