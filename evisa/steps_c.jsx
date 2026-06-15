/* Travel Pals e-Visa — Steps C: documents, review, payment, confirmation */
/* global React, TPDATA, TPI, Eyebrow, Group, Note, Field, Text, Area, Select, Check */
const { useState: useStateC, useRef: useRefC } = React;

/* ---------- uploaders ---------- */
function PhotoUpload({ f, set }) {
  const ref = useRefC(null);
  const [checks, setChecks] = useStateC(f.photoChecks || null);
  function onFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      const square = Math.abs(im.width - im.height) / Math.max(im.width, im.height) < 0.06;
      const c = {
        jpeg: file.type === "image/jpeg",
        size: file.size >= 10000 && file.size <= 1048576,
        square: square
      };
      setChecks(c);
      set("photoPreview", url);
      set("photoName", file.name);
      set("photoChecks", c);
      set("photoValid", c.jpeg && c.size && c.square);
    };
    im.src = url;
    const r = new FileReader(); r.onload = () => { set("photoB64", r.result); set("photoType", file.type); }; r.readAsDataURL(file);
  }
  const specs = [
    ["JPEG format", checks && checks.jpeg],
    ["Between 10 KB and 1 MB", checks && checks.size],
    ["Square — equal height & width", checks && checks.square],
    ["Plain white/light background, face centred", null]
  ];
  return (
    <div className="tp-photo">
      <div className="frame" onClick={() => ref.current.click()} style={{ cursor: "pointer" }}>
        {f.photoPreview ? <img src={f.photoPreview} alt="applicant" /> : TPI.user}
      </div>
      <div style={{ flex: 1, minWidth: 220 }}>
        <ul className="tp-specs">
          {specs.map(([t, ok], i) => (
            <li key={i} className={ok === true ? "ok" : ok === false ? "no" : "no"}>
              {ok === true ? TPI.checkc : ok === false ? TPI.warn : TPI.info}{t}
            </li>
          ))}
        </ul>
        <button type="button" className="tp-btn ghost" style={{ marginTop: 14 }} onClick={() => ref.current.click()}>
          {TPI.upload}{f.photoPreview ? "Replace photo" : "Upload photograph"}
        </button>
        <input ref={ref} type="file" accept="image/jpeg" className="hidden" onChange={(e) => onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

function DocUpload({ f, set, field, label, accept, hint }) {
  const ref = useRefC(null);
  const name = f[field + "Name"];
  function onFile(file) {
    if (!file) return;
    set(field + "Name", file.name);
    set(field + "Size", Math.round(file.size / 1024));
    set(field, true);
    const r = new FileReader(); r.onload = () => { set(field + "B64", r.result); set(field + "Type", file.type); }; r.readAsDataURL(file);
  }
  return (
    <div>
      <div className={"tp-drop"} style={{ padding: name ? "18px" : "30px" }} onClick={() => ref.current.click()}>
        {name
          ? <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", color: "var(--ok)" }}>
              {TPI.checkc}<div style={{ textAlign: "left" }}><div style={{ fontWeight: 600, color: "var(--ink)" }}>{name}</div><div className="muted" style={{ fontSize: 12 }}>{f[field + "Size"]} KB · uploaded · click to replace</div></div>
            </div>
          : <React.Fragment>
              <div className="ic">{TPI.upload}</div>
              <h4>{label}</h4>
              <p>{hint}</p>
            </React.Fragment>}
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onFile(e.target.files[0])} />
      </div>
    </div>
  );
}

function StepDocs({ f, set }) {
  return (
    <div className="tp-fade">
      <Group title="Recent photograph">
        <PhotoUpload f={f} set={set} />
      </Group>
      <Group title="Passport bio page">
        <DocUpload f={f} set={set} field="docPassport"
          label="Upload passport photo page" accept="application/pdf,image/*"
          hint="Clear scan showing photo & details · PDF or any image (JPG, PNG, HEIC, WebP…)" />
        {f._ppPreview && !f.docPassportName &&
          <div style={{ marginTop: 10 }}><Note kind="info">We can reuse the passport image you scanned earlier — or upload the official PDF here for lodging.</Note></div>}
      </Group>
      <Note kind="warn">Applications are rejected if images aren't clear or to-spec. We review every upload before lodging and will ask you to re-send anything that won't pass.</Note>
    </div>
  );
}

/* ---------- review ---------- */
function val(v) { return (v === undefined || v === null || v === "") ? null : v; }
function Row({ k, v }) {
  return <div><span className="k">{k}</span><span className={"v" + (val(v) ? "" : " empty")}>{val(v) || "Not provided"}</span></div>;
}
function ReviewSec({ ix, title, onEdit, children }) {
  return (
    <div className="tp-review-sec">
      <div className="tp-review-h"><span className="ix">{ix}</span>{title}
        <a className="edit" onClick={onEdit}>{TPI.edit} Edit</a></div>
      <div className="tp-dl">{children}</div>
    </div>
  );
}
function StepReview({ f, set, go }) {
  const vt = TPDATA.VISA_TYPES.find((v) => v.id === f.visaType);
  return (
    <div className="tp-fade">
      <Note kind="info">Review every detail against your passport. You are responsible for accuracy — discrepancies can lead to refusal at immigration. Tap <b>Edit</b> on any section to fix it.</Note>
      <div style={{ marginTop: 16 }}>
        <ReviewSec ix="1" title="Visa & arrival" onEdit={() => go(1)}>
          <Row k="Visa type" v={vt && vt.name} />
          <Row k="Port of arrival" v={f.arrivalPort} />
          <Row k="Date of arrival" v={TPDATA.fmtDate(f.arrivalDate)} />
          <Row k="Email" v={f.email} />
        </ReviewSec>
        <ReviewSec ix="2" title="Applicant" onEdit={() => go(2)}>
          <Row k="Surname" v={f.surname} />
          <Row k="Given name(s)" v={f.given} />
          <Row k="Sex" v={f.sex} />
          <Row k="Date of birth" v={TPDATA.fmtDate(f.dob)} />
          <Row k="Place of birth" v={f.birthCity} />
          <Row k="Nationality" v={f.nationality} />
          <Row k="Religion" v={f.religion} />
          <Row k="Education" v={f.education} />
        </ReviewSec>
        <ReviewSec ix="3" title="Passport" onEdit={() => go(3)}>
          <Row k="Passport no." v={f.passportNo} />
          <Row k="Place of issue" v={f.passportPlace} />
          <Row k="Date of issue" v={TPDATA.fmtDate(f.passportIssue)} />
          <Row k="Date of expiry" v={TPDATA.fmtDate(f.passportExpiry)} />
        </ReviewSec>
        <ReviewSec ix="4" title="Contact & address" onEdit={() => go(4)}>
          <Row k="Address" v={f.addrStreet} />
          <Row k="City" v={f.addrCity} />
          <Row k="Country" v={f.addrCountry} />
          <Row k="Mobile" v={f.mobile} />
        </ReviewSec>
        <ReviewSec ix="5" title="Family" onEdit={() => go(5)}>
          <Row k="Father" v={f.fatherName} />
          <Row k="Mother" v={f.motherName} />
          <Row k="Marital status" v={f.marital} />
          {f.marital === "Married" && <Row k="Spouse" v={f.spouseName} />}
        </ReviewSec>
        <ReviewSec ix="6" title="Occupation" onEdit={() => go(6)}>
          <Row k="Occupation" v={f.occupation} />
          <Row k="Employer" v={f.employer} />
        </ReviewSec>
        <ReviewSec ix="7" title="Trip" onEdit={() => go(7)}>
          <Row k="Purpose" v={f.purpose} />
          <Row k="Places to visit" v={f.placesToVisit} />
          <Row k="Stay in India" v={f.indiaCity} />
        </ReviewSec>
        <ReviewSec ix="8" title="Documents" onEdit={() => go(10)}>
          <Row k="Photograph" v={f.photoName} />
          <Row k="Passport page" v={f.docPassportName} />
        </ReviewSec>
      </div>
    </div>
  );
}

/* ---------- payment ---------- */
function feeNum(s) { return parseInt((s || "$0").replace(/[^0-9]/g, ""), 10) || 0; }
function money(n) { return "$" + (Number.isInteger(n) ? n : n.toFixed(2)); }
function StepPay({ f, set, serviceFee, onPay, paying }) {
  const vt = TPDATA.VISA_TYPES.find((v) => v.id === f.visaType) || TPDATA.VISA_TYPES[1];
  const govt = feeNum(vt.fee);
  const svc = serviceFee || 39;
  const bank = Math.round(govt * 0.03 * 100) / 100;
  const total = govt + svc + bank;
  const [card, setCard] = useStateC({ num: "", exp: "", cvc: "", name: "" });
  const fmtCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };
  const ready = card.num.replace(/\s/g, "").length >= 15 && card.exp.length === 5 && card.cvc.length >= 3 && card.name && f.consent;
  return (
    <div className="tp-fade">
      <div className="tp-pay">
        <div>
          <Group title="Cardholder & payment">
            <Note kind="info" >You're paying Travel Pals' assisted-service charge plus the government e-Visa fee, collected together. Your details are sent to our visa team to lodge the application on your behalf.</Note>
            <div className="tp-grid" style={{ marginTop: 16 }}>
              <Field col={12} label="Name on card" req>
                <input className="tp-input" value={card.name} placeholder="As printed on the card"
                  onChange={(e) => setCard({ ...card, name: e.target.value })} />
              </Field>
              <Field col={12} label="Card number" req>
                <div className="tp-card-input">
                  {TPI.card}
                  <input inputMode="numeric" value={card.num} placeholder="1234 1234 1234 1234"
                    onChange={(e) => setCard({ ...card, num: fmtCard(e.target.value) })} />
                  <div className="tp-card-brands"><span>VISA</span><span>MC</span><span>AMEX</span></div>
                </div>
              </Field>
              <Field col={6} label="Expiry" req>
                <input className="tp-input" value={card.exp} placeholder="MM/YY"
                  onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} />
              </Field>
              <Field col={6} label="CVC" req>
                <input className="tp-input" inputMode="numeric" value={card.cvc} placeholder="123"
                  onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
              </Field>
            </div>
            <div style={{ marginTop: 18 }}>
              <Check checked={f.consent} onChange={(v) => set("consent", v)}>
                I confirm the information is true and complete, and I authorise Travel Pals to lodge my Indian e-Visa application and charge the amount shown. I understand the government fee is non-refundable.
              </Check>
            </div>
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
              <input tabIndex={-1} autoComplete="off" value={f._hp_company || ""} onChange={(e) => set("_hp_company", e.target.value)} placeholder="Company" />
              <input tabIndex={-1} autoComplete="off" value={f._hp_url || ""} onChange={(e) => set("_hp_url", e.target.value)} placeholder="Website" />
            </div>
          </Group>
        </div>
        <div>
          <div className="tp-summary">
            <h3>Order summary</h3>
            <div className="tp-line">{vt.name}<span className="amt">{money(govt)}</span></div>
            <div className="tp-line">Travel Pals assisted service<span className="amt">{money(svc)}</span></div>
            <div className="tp-line">Bank &amp; processing (3%)<span className="amt">{money(bank)}</span></div>
            <div className="tp-line total">Total due<span className="amt">{money(total)}</span></div>
            <button type="button" className="tp-btn primary lg block" style={{ marginTop: 18 }} disabled={!ready || paying} onClick={() => onPay(total)}>
              {paying ? <React.Fragment><span className="tp-spin" style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,.4)", borderTopColor: "#fff" }} />Processing…</React.Fragment> : <React.Fragment>{TPI.lock} Pay {money(total)} securely</React.Fragment>}
            </button>
            <div className="tp-stripe-badge">{TPI.lock} Encrypted · powered by Stripe</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- confirmation ---------- */
function Confirmation({ f, refNo, onDownload, submitState, teamEmail }) {
  const st = (submitState && submitState.status) || "local";
  const ticketNo = (submitState && submitState.ticket) || refNo;
  const statusLine =
    st === "sent" ? <React.Fragment>Your application PDF is attached to service ticket <b style={{ color: "var(--ink)" }}>{ticketNo}</b> and emailed to <b style={{ color: "var(--ink)" }}>{f.email || "your email"}</b>.</React.Fragment>
    : st === "error" ? <React.Fragment>We couldn't reach the ticket system just now — please download your PDF below; our team will retry and follow up at <b style={{ color: "var(--ink)" }}>{f.email || "your email"}</b>.</React.Fragment>
    : <React.Fragment>Your full application PDF is ready to download below. Once your ticket endpoint is connected it will also be attached to a service ticket and emailed automatically.</React.Fragment>;
  return (
    <div className="tp-done tp-fade">
      <div className="seal">{TPI.checkc}</div>
      <h2 className="tp-h" style={{ textAlign: "center" }}>Payment received — we're on it</h2>
      <p className="tp-sub" style={{ margin: "0 auto 4px" }}>
        Thank you, {f.given || "traveller"}. Your application has been received by the Travel Pals visa team.
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="tp-ref">{TPI.shield}<span>REF&nbsp;{refNo}</span></div>
      </div>
      <p className="muted" style={{ fontSize: 13, maxWidth: 460, margin: "0 auto" }}>{statusLine}</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
        <button type="button" className="tp-btn primary" onClick={onDownload}>{TPI.upload} Download application PDF</button>
      </div>
      <ul className="tp-timeline">
        <li><span className="n">1</span><div className="tx"><h5>We review your details & documents</h5><p>Within a few hours our team checks everything against e-Visa specs and flags anything that needs fixing.</p></div></li>
        <li><span className="n">2</span><div className="tx"><h5>We lodge your official application</h5><p>We submit to the Government of India e-Visa portal and pay the government fee on your behalf.</p></div></li>
        <li><span className="n">3</span><div className="tx"><h5>ETA arrives by email</h5><p>Your Electronic Travel Authorisation is typically granted in 3–5 business days. We forward it the moment it's issued.</p></div></li>
        <li><span className="n">4</span><div className="tx"><h5>Print & fly</h5><p>Carry the ETA printout and your passport. The visa is stamped on arrival at your chosen port.</p></div></li>
      </ul>
    </div>
  );
}

Object.assign(window, { StepDocs, StepReview, StepPay, Confirmation });
