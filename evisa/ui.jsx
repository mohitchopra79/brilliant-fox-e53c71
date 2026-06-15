/* Travel Pals e-Visa — UI primitives (exports components to window) */
/* global React */
const { useState, useRef, useEffect } = React;

/* ---------------- icons ---------------- */
const I = {
  lock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  checkc:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>,
  arrowR:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  arrowL:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>,
  upload:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></svg>,
  scan:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/></svg>,
  info:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  warn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  edit:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>,
  user:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
  spark:   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z"/></svg>,
  card:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
};

function Eyebrow({ n, children }) {
  return <div className="tp-eyebrow"><span className="n">{n}</span>{children}</div>;
}
function Group({ title, children }) {
  return (
    <div className="tp-group">
      {title && <h4 className="tp-group-h">{title}</h4>}
      {children}
    </div>
  );
}
function Note({ kind = "info", children }) {
  return <div className={"tp-note " + kind}>{kind === "warn" ? I.warn : I.info}<div>{children}</div></div>;
}

/* ---------------- field wrapper ---------------- */
function Field({ label, req, opt, hint, error, col = 6, children }) {
  return (
    <div className={"tp-field col-" + col + (error ? " err" : "")}>
      {label && (
        <label className="tp-label">
          {label}{req && <span className="req">*</span>}
          {opt && <span className="opt">(optional)</span>}
        </label>
      )}
      {children}
      {hint && !error && <div className="tp-hint">{hint}</div>}
      {error && <div className="tp-err">{I.warn}{error}</div>}
    </div>
  );
}

function Text({ value, onChange, placeholder, autofilled, type = "text", disabled, ...p }) {
  return (
    <Field {...p}>
      <input
        className={"tp-input" + (autofilled ? " autofilled" : "")}
        type={type} value={value || ""} placeholder={placeholder} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function Area({ value, onChange, placeholder, rows, ...p }) {
  return (
    <Field {...p}>
      <textarea className="tp-textarea" rows={rows} value={value || ""} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function Select({ value, onChange, options, placeholder = "Select…", autofilled, ...p }) {
  return (
    <Field {...p}>
      <select className={"tp-select" + (autofilled ? " autofilled" : "")} value={value || ""}
        onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lab = typeof o === "string" ? o : o.label;
          return <option key={val} value={val}>{lab}</option>;
        })}
      </select>
    </Field>
  );
}

function DateF({ value, onChange, min, max, autofilled, ...p }) {
  return (
    <Field {...p}>
      <input className={"tp-input" + (autofilled ? " autofilled" : "")} type="date"
        value={value || ""} min={min} max={max} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

/* segmented chips (single select) */
function Seg({ value, onChange, options, yn, col = 6, ...p }) {
  return (
    <Field col={col} {...p}>
      <div className={"tp-seg" + (yn ? " yn" : "")}>
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lab = typeof o === "string" ? o : o.label;
          const on = value === val;
          return (
            <button type="button" key={val} className="tp-chip" aria-pressed={on}
              onClick={() => onChange(val)}>
              {on && <span className="tick">{I.check}</span>}{lab}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function YesNo({ value, onChange, label, req, hint, error, col = 12 }) {
  return (
    <Seg col={col} label={label} req={req} hint={hint} error={error}
      yn value={value} onChange={onChange} options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} />
  );
}

function Check({ checked, onChange, children }) {
  return (
    <label className="tp-check">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="box">{I.check}</span>
      <span>{children}</span>
    </label>
  );
}

/* radio cards (visa sub-type) */
function RadioCards({ value, onChange, items }) {
  return (
    <div className="tp-cards c3">
      {items.map((it) => (
        <div key={it.id} className={"tp-radio-card" + (it.popular ? " is-pop" : "")} role="button" tabIndex={0}
          aria-pressed={value === it.id} onClick={() => onChange(it.id)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onChange(it.id)}>
          <span className="mark" />
          {it.popular && <span className="rc-pop">Popular</span>}
          <div className="rc-t">{it.name}</div>
          <div className="rc-d">{it.entries} · {it.duration}</div>
          <div className="rc-d" style={{ marginTop: 6, fontWeight: 600, color: "var(--ink)" }}>
            Govt fee {it.fee}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  TPI: I, Eyebrow, Group, Note, Field, Text, Area, Select, DateF, Seg, YesNo, Check, RadioCards
});
