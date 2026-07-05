import { Moon, Sun } from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Theme">
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
