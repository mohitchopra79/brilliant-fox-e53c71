/* Travel Pals e-Visa — App orchestrator */
/* global React, ReactDOM, TPDATA, TPI, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakNumber,
   StepScan, StepVisa, StepPersonal, StepPassport, StepContact, StepFamily, StepOccupation, StepTrip, StepHistory, StepSecurity,
   StepDocs, StepReview, StepPay, Confirmation, Eyebrow */
const { useState, useEffect, useRef } = React;

const STEPS = [
  { key: "scan", label: "Scan passport", title: "Let's start with your passport", sub: "Scan the photo page and we'll auto-fill the form. Everything stays editable and on your device." },
  { key: "visa", label: "Visa & arrival", title: "Your visa & travel", sub: "Pick the e-Tourist visa that fits your trip and tell us when you arrive." },
  { key: "personal", label: "Applicant", title: "Personal details", sub: "Enter your details exactly as they appear on your passport." },
  { key: "passport", label: "Passport", title: "Passport details", sub: "The numbers and dates printed on your passport's photo page." },
  { key: "contact", label: "Contact", title: "Contact & address", sub: "Where we and the authorities can reach you." },
  { key: "family", label: "Family", title: "Family details", sub: "Parents and, if applicable, spouse — required by the e-Visa form." },
  { key: "occupation", label: "Occupation", title: "Profession & occupation", sub: "Your current work, as the application requires." },
  { key: "trip", label: "Trip", title: "Trip details", sub: "Why you're visiting and where you'll go." },
  { key: "history", label: "History", title: "Travel history & references", sub: "Previous travel plus a contact in India and at home." },
  { key: "security", label: "Declarations", title: "Background declarations", sub: "Standard yes/no questions every applicant must answer truthfully." },
  { key: "docs", label: "Documents", title: "Photo & documents", sub: "Upload a compliant photograph and your passport page." },
  { key: "review", label: "Review", title: "Review your application", sub: "Check everything carefully before payment — you're responsible for accuracy." },
  { key: "pay", label: "Payment", title: "Service fee & payment", sub: "Pay our assisted-service charge and the government fee together." }
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "heritage",
  "accent": "#1F6F5C",
  "serviceFee": 39
}/*EDITMODE-END*/;

/* ─────────────────────────────────────────────────────────────
   INTEGRATION — where a completed application is delivered.
   On payment the form builds the application PDF and emails it,
   together with the uploaded passport bio-page and photograph,
   to `formEmail` via FormSubmit (https://formsubmit.co) — the
   same free service the site's Contact form already uses, so the
   address is pre-activated and submissions arrive immediately.
   To change the destination, edit `formEmail` below.
   ───────────────────────────────────────────────────────────── */
const INTEGRATION = {
  formEmail: "mohit@travelpals.in",   // ← e-Visa applications are emailed here
  teamEmail: "mohit@travelpals.in"
};

const LS = "tp_evisa_v1";
function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(LS) || "{}");
    if (s && s.form) { delete s.form.photoPreview; delete s.form._ppPreview; }
    return s;
  } catch (e) { return {}; }
}

/* required-field schema → returns array of missing labels */
function missingFor(step, f) {
  const need = [];
  const R = (cond, label) => { if (cond) need.push(label); };
  const e = (k) => !f[k] || String(f[k]).trim() === "";
  switch (STEPS[step].key) {
    case "visa":
      R(!f.visaType, "Visa type"); R(e("arrivalPort"), "Port of arrival"); R(e("arrivalDate"), "Arrival date");
      R(e("email"), "Email"); R(e("emailConfirm") || (f.email || "").toLowerCase() !== (f.emailConfirm || "").toLowerCase(), "Matching confirm email"); break;
    case "personal":
      ["surname:Surname", "given:Given name(s)", "sex:Sex", "dob:Date of birth", "birthCity:Town of birth", "birthCountry:Country of birth", "nationality:Nationality", "natBy:Acquired nationality by", "religion:Religion", "education:Education", "idMarks:Identification marks"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); });
      R(!f.changedName, "Changed name? (yes/no)"); R(f.changedName === "Yes" && e("prevName"), "Previous name"); break;
    case "passport":
      ["passportNo:Passport number", "passportPlace:Place of issue", "passportCountry:Country of issue", "passportIssue:Date of issue", "passportExpiry:Date of expiry"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); });
      R(!f.otherPassport, "Other passport? (yes/no)"); break;
    case "contact":
      ["addrStreet:Street", "addrCity:City", "addrState:State", "addrZip:Postal code", "addrCountry:Country", "mobile:Mobile"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); }); break;
    case "family":
      ["fatherName:Father's name", "fatherNat:Father's nationality", "fatherBirthPlace:Father's birthplace", "fatherBirthCountry:Father's birth country", "motherName:Mother's name", "motherNat:Mother's nationality", "motherBirthPlace:Mother's birthplace", "motherBirthCountry:Mother's birth country"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); });
      R(!f.marital, "Marital status"); R(f.marital === "Married" && e("spouseName"), "Spouse's name"); R(!f.pakLink, "Pakistan-link declaration"); break;
    case "occupation":
      R(e("occupation"), "Occupation");
      R(["Retired", "Unemployed", "Homemaker", "Student"].indexOf(f.occupation) < 0 && e("employer"), "Employer"); break;
    case "trip":
      ["purpose:Purpose", "placesToVisit:Places to visit", "indiaAddr:Address in India", "indiaCity:City in India", "indiaState:State in India"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); }); break;
    case "history":
      R(!f.visitedBefore, "Visited before? (yes/no)"); R(!f.refusedBefore, "Previously refused? (yes/no)"); R(e("countriesVisited"), "Countries visited"); R(!f.saarc, "SAARC travel? (yes/no)");
      ["refIndiaName:Reference in India (name)", "refIndiaPhone:Reference in India (phone)", "refIndiaAddr:Reference in India (address)", "refHomeName:Home reference (name)", "refHomePhone:Home reference (phone)", "refHomeAddr:Home reference (address)"].forEach(p => { const [k, l] = p.split(":"); R(e(k), l); }); break;
    case "security": {
      const ans = f.security || {};
      const unanswered = TPDATA.SECURITY.some((_, i) => !ans["q" + i]);
      R(unanswered, "Answer every declaration");
      const anyYes = TPDATA.SECURITY.some((_, i) => ans["q" + i] === "Yes");
      R(anyYes && e("securityDetail"), "Details for 'Yes' answers"); break;
    }
    case "docs":
      R(!f.photoName, "Photograph"); R(!f.docPassportName && !f._ppPreview, "Passport page"); break;
    default: break;
  }
  return need;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const saved = useRef(loadState());
  const [step, setStep] = useState(saved.current.step || 0);
  const [form, setForm] = useState(saved.current.form || { permSame: true, security: {} });
  const [autoKeys, setAutoKeys] = useState({});
  const [errs, setErrs] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);
  const [pdfRef, setPdfRef] = useState(null);
  const [submitState, setSubmitState] = useState({ status: "idle" });
  const [ref] = useState(() => "TP-" + Math.random().toString(36).slice(2, 7).toUpperCase() + "-IN");
  const topRef = useRef(null);

  // theme + accent
  useEffect(() => { document.documentElement.dataset.theme = t.theme; }, [t.theme]);
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-tint", t.accent + "1f");
  }, [t.accent]);

  // persist
  useEffect(() => {
    const f = Object.assign({}, form); delete f.photoPreview; delete f._ppPreview; delete f.photoB64; delete f.docPassportB64;
    try { localStorage.setItem(LS, JSON.stringify({ step, form: f })); } catch (e) {}
  }, [form, step]);

  const set = (k, v) => setForm((p) => Object.assign({}, p, { [k]: v }));
  const a = (k) => !!autoKeys[k] && !!form[k];

  function onParsed(parsed, url) {
    const map = { surname: "surname", given: "given", passportNo: "passportNo", nationality: "nationality", dob: "dob", sex: "sex", expiry: "passportExpiry" };
    setForm((p) => {
      const nx = Object.assign({}, p);
      Object.keys(map).forEach((src) => { if (parsed[src]) nx[map[src]] = parsed[src]; });
      if (url) nx._ppPreview = url;
      return nx;
    });
    const ak = {}; Object.keys(map).forEach((src) => { if (parsed[src]) ak[map[src]] = true; });
    setAutoKeys((p) => Object.assign({}, p, ak));
  }

  function goto(n) { setErrs([]); setStep(n); if (topRef.current) topRef.current.scrollIntoView ? window.scrollTo({ top: 0, behavior: "smooth" }) : null; window.scrollTo({ top: 0, behavior: "smooth" }); }
  function next() {
    const miss = missingFor(step, form);
    if (miss.length) { setErrs(miss); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    goto(Math.min(step + 1, STEPS.length - 1));
  }
  function back() { goto(Math.max(step - 1, 0)); }

  const e2u = (blob) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
  const configured = () => !!INTEGRATION.formEmail;

  // base64 / data-URL → Blob (for emailing the uploaded passport & photo as files)
  function b64ToBlob(b64, type) {
    try {
      var s = b64.indexOf(",") >= 0 ? b64.split(",")[1] : b64;
      var bin = atob(s), len = bin.length, arr = new Uint8Array(len);
      for (var i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: type || "application/octet-stream" });
    } catch (e) { return null; }
  }

  async function submitToApp(blob, fname) {
    if (!configured() || !blob) { setSubmitState({ status: configured() ? "error" : "local" }); return; }
    try {
      const vt = TPDATA.VISA_TYPES.find((v) => v.id === form.visaType) || {};
      const fd = new FormData();
      // FormSubmit control fields
      fd.append("_subject", "e-Visa application \u2014 " + (form.surname || "applicant") + " (" + ref + ")");
      fd.append("_template", "table");
      fd.append("_captcha", "false");
      if (form.email) fd.append("_cc", form.email);   // send the applicant a copy
      fd.append("_honey", form._hp_company || "");   // honeypot — real users leave blank
      // Readable summary in the email body
      fd.append("Reference", ref);
      fd.append("Applicant", (((form.given || "") + " " + (form.surname || "")).trim()) || "e-Visa applicant");
      fd.append("Applicant email", form.email || "");
      fd.append("Mobile", form.mobile || "");
      fd.append("Nationality", form.nationality || "");
      fd.append("Passport number", form.passportNo || "");
      fd.append("Visa type", vt.name || "");
      fd.append("Arrival", (form.arrivalPort || "") + (form.arrivalDate ? " on " + form.arrivalDate : ""));
      fd.append("Address in India", [form.indiaAddr, form.indiaCity, form.indiaState].filter(Boolean).join(", "));
      fd.append("Note", "Full application form attached as a PDF. Passport bio-page and photograph attached where provided.");
      // Attachments: application PDF + uploaded passport scan + photo
      fd.append("attachment", blob, fname);
      if (form.docPassportB64) { const pb = b64ToBlob(form.docPassportB64, form.docPassportType); if (pb) fd.append("attachment", pb, form.docPassportName || "passport-page"); }
      if (form.photoB64) { const ph = b64ToBlob(form.photoB64, form.photoType); if (ph) fd.append("attachment", ph, form.photoName || "photo.jpg"); }
      // Deliver. no-cors keeps the browser from blocking the cross-origin POST;
      // FormSubmit still receives and emails it. We can't read the opaque response,
      // so we optimistically mark it sent (network failures are caught below).
      await fetch("https://formsubmit.co/" + INTEGRATION.formEmail, { method: "POST", mode: "no-cors", body: fd });
      setSubmitState({ status: "sent", ticket: ref });
    } catch (e) { setSubmitState({ status: "error" }); }
  }

  function downloadPdf() {
    if (pdfRef && pdfRef.doc) pdfRef.doc.save(pdfRef.fname);
    else { try { const d = window.TPPDF.build(form, ref); d.save(window.TPPDF.filename(form, ref)); } catch (e) {} }
  }

  function pay(total) {
    // Open Stripe's hosted payment link in a NEW TAB (the real charge). This must
    // run synchronously inside the click handler so the browser doesn't block it.
    const vt = TPDATA.VISA_TYPES.find((v) => v.id === form.visaType) || TPDATA.VISA_TYPES[0];
    if (vt && vt.stripeUrl) { try { window.open(vt.stripeUrl, "_blank", "noopener"); } catch (e) {} }
    setPaying(true);
    setTimeout(async () => {
      let blob = null, fname = "application.pdf";
      try { const doc = window.TPPDF.build(form, ref); blob = doc.output("blob"); fname = window.TPPDF.filename(form, ref); setPdfRef({ doc, blob, fname }); } catch (e) {}
      await submitToApp(blob, fname);
      setPaying(false); setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  }

  const cur = STEPS[step];
  const pct = submitted ? 100 : Math.round((step) / (STEPS.length - 1) * 100);

  function renderStep() {
    switch (cur.key) {
      case "scan": return <StepScan f={form} set={set} onParsed={onParsed} />;
      case "visa": return <StepVisa f={form} set={set} a={a} />;
      case "personal": return <StepPersonal f={form} set={set} a={a} />;
      case "passport": return <StepPassport f={form} set={set} a={a} />;
      case "contact": return <StepContact f={form} set={set} />;
      case "family": return <StepFamily f={form} set={set} />;
      case "occupation": return <StepOccupation f={form} set={set} />;
      case "trip": return <StepTrip f={form} set={set} />;
      case "history": return <StepHistory f={form} set={set} />;
      case "security": return <StepSecurity f={form} set={set} />;
      case "docs": return <StepDocs f={form} set={set} />;
      case "review": return <StepReview f={form} set={set} go={goto} />;
      case "pay": return <StepPay f={form} set={set} serviceFee={t.serviceFee} onPay={pay} paying={paying} />;
      default: return null;
    }
  }

  return (
    <div className="tp-app" ref={topRef}>
      <header className="tp-top">
        <div className="tp-top-in">
          <a className="tp-brand" href="#">
            <img src="evisa/logo.png" alt="Travel Pals" />
            <div>
              <div className="tp-brand-name">Travel <b>Pals</b></div>
              <div className="tp-brand-sub">India e-Visa Service</div>
            </div>
          </a>
          <div className="tp-top-right">
            <span className="tp-secure">{TPI.shield} Secure intake</span>
            <a className="tp-help" href="#">Need help?</a>
          </div>
        </div>
      </header>

      <main className="tp-main">
        <aside className="tp-rail">
          <h2 className="tp-rail-title">Apply with us</h2>
          <p className="tp-rail-sub">We prepare & lodge your official Indian e-Tourist visa.</p>
          <div className="tp-rail-mini">
            <div className="tp-progress"><i style={{ width: pct + "%" }} /></div>
            <div className="tp-progress-meta"><span>{submitted ? "Submitted" : cur.label}</span><span>{submitted ? "Done" : `Step ${step + 1} / ${STEPS.length}`}</span></div>
          </div>
          <ol className="tp-steps">
            {STEPS.map((s, i) => (
              <li key={s.key} className={"tp-step" + (i === step && !submitted ? " active" : "") + (i < step || submitted ? " done" : "")}
                onClick={() => !submitted && i <= step && goto(i)}>
                <span className="dot">{(i < step || submitted) ? TPI.check : i + 1}</span>
                <span className="lbl">{s.label}</span>
              </li>
            ))}
          </ol>
        </aside>

        <section>
          {submitted
            ? <div className="tp-card"><div className="tp-card-body"><Confirmation f={form} refNo={ref} onDownload={downloadPdf} submitState={submitState} teamEmail={INTEGRATION.teamEmail} payUrl={(TPDATA.VISA_TYPES.find((v) => v.id === form.visaType) || {}).stripeUrl} /></div></div>
            : <div className="tp-card">
                <div className="tp-card-head">
                  <Eyebrow n={`${step + 1} / ${STEPS.length}`}>{cur.label}</Eyebrow>
                  <h1 className="tp-h">{cur.title}</h1>
                  <p className="tp-sub">{cur.sub}</p>
                </div>
                <div className="tp-card-body">
                  {errs.length > 0 &&
                    <div className="tp-note warn" style={{ marginBottom: 18 }}>
                      {TPI.warn}
                      <div><b>Please complete before continuing:</b> {errs.join(" · ")}</div>
                    </div>}
                  {renderStep()}
                  <div className="tp-nav">
                    {step > 0
                      ? <button className="tp-btn ghost" onClick={back}>{TPI.arrowL} Back</button>
                      : <span />}
                    <span className="spacer" />
                    <span className="tp-save">{TPI.checkc} Progress saved</span>
                    {cur.key === "review"
                      ? <button className="tp-btn primary" onClick={next}>Continue to payment {TPI.arrowR}</button>
                      : cur.key === "pay"
                        ? <span />
                        : <button className="tp-btn primary" onClick={next}>
                            {cur.key === "scan" ? "Continue" : "Save & continue"} {TPI.arrowR}
                          </button>}
                  </div>
                </div>
              </div>}
        </section>
      </main>

      <footer className="tp-foot">
        <strong style={{ color: "var(--ink-2)" }}>Travel Pals</strong> is an independent travel-services provider that helps you prepare and lodge your Indian e-Visa application. We are not affiliated with the Government of India. The official portal is <a href="https://indianvisaonline.gov.in/evisa/" target="_blank" rel="noopener">indianvisaonline.gov.in</a>, where you may also apply directly. Government e-Visa fees are non-refundable. Our service charge covers preparation, review and lodging on your behalf.
      </footer>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Visual direction" />
        <TweakRadio label="Theme" value={t.theme} options={["heritage", "modern", "boutique"]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakColor label="Accent" value={t.accent}
          options={["#1F6F5C", "#1B3A8B", "#B07D2A", "#5A4A6B", "#0E7490"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Commerce" />
        <TweakNumber label="Service fee (USD)" value={t.serviceFee} min={0} max={199} step={1}
          onChange={(v) => setTweak("serviceFee", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
