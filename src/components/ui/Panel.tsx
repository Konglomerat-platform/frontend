import type { ReactNode } from "react";

export function Panel({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h3>{title}</h3>
        {count !== undefined ? <span className="tag">{count}</span> : null}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}
