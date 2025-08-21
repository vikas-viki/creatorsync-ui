import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { api } from '../lib/clients';
import { UserType } from '../lib/types';
import { useChatStore } from './chatStore';
import { axiosErrorHandler } from '../lib/helpers';

type AuthInput = {
  accessToken: string,
  type: UserType
}

interface AuthStore {
  isAuthenticated: boolean;
  youtubeConnected: boolean;
  login: (data: AuthInput) => Promise<boolean>;
  signup: (data: AuthInput) => Promise<boolean>;
  logout: () => Promise<boolean>;
  session: () => Promise<boolean>;
  connectYouTube: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  (set, get) => ({
    isAuthenticated: false,
    youtubeConnected: false,
    login: async (data) => {
      try {
        await api.post("/auth/signin", data);
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
        const res = await api.get("/auth/session");
        useChatStore.getState().setUserData(res.data.username, res.data.userId, res.data.type, res.data.isYoutubeConnected);
        set({ isAuthenticated: true, youtubeConnected: res.data.isYoutubeConnected });
        return true;
      } catch { /* empty */ }
      return false;
    },
    logout: async () => {
      try {
        await api.get("/auth/logout");
        set({ isAuthenticated: false })
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
    },
    connectYouTube: axiosErrorHandler(async () => {
      const res = await api.get("/auth/youtube");
      const data = res.data as { url: string };
      window.location.href = data.url;
    }, "We couldn’t log you in right now. Please try again later.", ""),
  })
);