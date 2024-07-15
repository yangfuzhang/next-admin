import { create } from "zustand";
import { getThemeConfig, setThemeConfig } from "@/lib/client";
import { ThemeConfig } from "@/types";
import { User } from "@/types/user";

interface InitialStateType {
  user: User | null;
  themeConfig: ThemeConfig;
}

const initialState: InitialStateType = {
  user: null,
  themeConfig: getThemeConfig() ?? { theme: "blue", radius: 0.5 },
};

const store = create(() => ({ ...initialState }));

export function setUser(user: User | null) {
  store.setState({ user });
}

export function setAdminTheme(themeConfig: ThemeConfig) {
  setThemeConfig(themeConfig);
  store.setState({ themeConfig });
}

export default store;
