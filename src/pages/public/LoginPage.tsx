import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../auth/AuthContext";

export function LoginPage() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const user = await login(String(data.get("username") || ""), String(data.get("password") || ""));
      navigate(user.role === "admin" ? "/admin" : "/company");
    } catch {
      setError("Login yoki parol noto'g'ri.");
    }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <Link className="brand" to="/">
          <span className="logo-mark">K</span>
          <span className="logo-text">Konglomerat</span>
        </Link>
        <h1>Войти</h1>
        <div className="form-group">
          <label>Login</label>
          <input className="form-control" name="username" required />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input className="form-control" name="password" type="password" required />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn btn-primary">Войти</button>
      </form>
    </main>
  );
}
