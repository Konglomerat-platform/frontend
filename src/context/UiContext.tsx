import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Toast = { id: number; title: string; message?: string; type?: "success" | "error" | "info" };
type ConfirmState = { title: string; danger?: boolean; resolve: (value: boolean) => void };
type PromptState = { title: string; value?: string; placeholder?: string; ok?: string; resolve: (value: string | null) => void };

type UiState = {
  toast: (title: string, message?: string, type?: Toast["type"]) => void;
  confirm: (options: Omit<ConfirmState, "resolve">) => Promise<boolean>;
  prompt: (options: Omit<PromptState, "resolve">) => Promise<string | null>;
};

const UiContext = createContext<UiState | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);

  const toast = useCallback((title: string, message?: string, type: Toast["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, title, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  }, []);

  const confirm = useCallback((options: Omit<ConfirmState, "resolve">) => {
    return new Promise<boolean>((resolve) => setConfirmState({ ...options, resolve }));
  }, []);

  const prompt = useCallback((options: Omit<PromptState, "resolve">) => {
    return new Promise<string | null>((resolve) => setPromptState({ ...options, resolve }));
  }, []);

  const value = useMemo(() => ({ toast, confirm, prompt }), [toast, confirm, prompt]);

  return (
    <UiContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onClose={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
      <ConfirmDialog state={confirmState} onClose={() => setConfirmState(null)} />
      <PromptDialog state={promptState} onClose={() => setPromptState(null)} />
    </UiContext.Provider>
  );
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error("useUi must be used within UiProvider");
  return value;
}

function ToastHost({ toasts, onClose }: { toasts: Toast[]; onClose: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((toast) => (
        <button key={toast.id} className={`toast ${toast.type || ""}`} type="button" onClick={() => onClose(toast.id)}>
          <span className="t-ico">{toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}</span>
          <span>
            <span className="t-title">{toast.title}</span>
            {toast.message ? <span className="t-msg">{toast.message}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}

function ConfirmDialog({ state, onClose }: { state: ConfirmState | null; onClose: () => void }) {
  if (!state) return null;
  return (
    <div className="modal-overlay open">
      <div className="modal-card dialog-card">
        <h3 className="modal-title">{state.title}</h3>
        <div className="modal-actions">
          <button
            className={`btn ${state.danger ? "btn-danger" : "btn-primary"}`}
            onClick={() => {
              state.resolve(true);
              onClose();
            }}
          >
            OK
          </button>
          <button
            className="btn btn-soft"
            onClick={() => {
              state.resolve(false);
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PromptDialog({ state, onClose }: { state: PromptState | null; onClose: () => void }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(state?.value || "");
  }, [state]);

  if (!state) return null;
  return (
    <div className="modal-overlay open">
      <form
        className="modal-card dialog-card"
        onSubmit={(event) => {
          event.preventDefault();
          state.resolve(value);
          onClose();
        }}
      >
        <h3 className="modal-title">{state.title}</h3>
        <input
          autoFocus
          className="form-control modal-input"
          value={value}
          placeholder={state.placeholder}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="modal-actions">
          <button className="btn btn-primary">{state.ok || "OK"}</button>
          <button
            type="button"
            className="btn btn-soft"
            onClick={() => {
              state.resolve(null);
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
