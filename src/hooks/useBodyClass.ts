import { useEffect } from "react";

export function useBodyClass(className: string, active = true) {
  useEffect(() => {
    document.body.classList.toggle(className, active);
    return () => document.body.classList.remove(className);
  }, [active, className]);
}
