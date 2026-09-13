import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "day" | "night";

interface ThemeContextType {
  theme: Theme;
  isNight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "bharat-kirana-theme-v1";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("day");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme;
      if (saved === "day" || saved === "night") {
        setThemeState(saved);
        if (saved === "night") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("night");
        document.documentElement.classList.add("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      if (newTheme === "night") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "day" ? "night" : "day");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isNight: theme === "night",
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
