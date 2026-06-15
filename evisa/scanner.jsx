/* Travel Pals e-Visa — Passport upload + MRZ OCR autofill */
/* global React, TPDATA, TPI, Note */
const { useState: useStateScan, useRef: useRefScan } = React;

const TESS_SRC = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
let _tessLoading = null;
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (_tessLoading) return _tessLoading;
  _tessLoading = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = TESS_SRC; s.onload = () => res(window.Tesseract); s.onerror = rej;
    document.head.appendChild(s);
  });
  return _tessLoading;
}

// Crop bottom band (where the MRZ lives), upscale + threshold for cleaner OCR
function preprocess(img, band) {
  const cw = 1400;
  const ch = Math.round((img.height * (band || 0.34)) * (cw / img.width));
  const c = document.createElement("canvas");
  c.width = cw; c.height = ch;
  const ctx = c.getContext("2d");
  const sy = img.height * (1 - (band || 0.34));
  ctx.drawImage(img, 0, sy, img.width, img.height * (band || 0.34), 0, 0, cw, ch);
  const d = ctx.getImageData(0, 0, cw, ch); const p = d.data;
  for (let i = 0; i < p.length; i += 4) {
    const g = 0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
    const v = g > 135 ? 255 : g < 95 ? 0 : (g - 95) * (255 / 40);
    p[i] = p[i + 1] = p[i + 2] = v;
  }
  ctx.putImageData(d, 0, 0);
  return c;
}

function readImageFile(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => res({ im, url });
    im.onerror = rej; im.src = url;
  });
}

function ExtractRow({ k, v, i }) {
  return (
    <li><span className="k">{k}</span><span className="v" style={{ animationDelay: i * 90 + "ms" }}>{v || "—"}</span></li>
  );
}

function PassportScanner({ onParsed, savedPreview }) {
  const [phase, setPhase] = useStateScan(savedPreview ? "done" : "idle"); // idle | scan | done | manual | error
  const [preview, setPreview] = useStateScan(savedPreview || null);
  const [progress, setProgress] = useStateScan(0);
  const [status, setStatus] = useStateScan("");
  const [fields, setFields] = useStateScan(null);
  const [drag, setDrag] = useStateScan(false);
  const inputRef = useRefScan(null);

  async function runOCR(file) {
    try {
      const { im, url } = await readImageFile(file);
      setPreview(url); setPhase("scan"); setProgress(0.04); setStatus("Loading secure scanner…");
      const Tess = await loadTesseract();
      setStatus("Reading the machine-readable zone…");
      const worker = await Tess.createWorker("eng", 1, {
        logger: (m) => { if (m.status === "recognizing text") setProgress(0.2 + m.progress * 0.78); }
      });
      await worker.setParameters({ tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789< ", tessedit_pageseg_mode: "6" });
      let parsed = null;
      for (const band of [0.30, 0.42, 1.0]) {
        const canvas = band >= 1 ? im : preprocess(im, band);
        const { data } = await worker.recognize(canvas);
        parsed = TPDATA.parseMRZ(data.text);
        if (parsed && parsed.passportNo) break;
      }
      await worker.terminate();
      setProgress(1);
      if (parsed) { finish(parsed, url); }
      else { setPhase("error"); setStatus("We couldn't read the code lines clearly."); }
    } catch (e) {
      setPhase("error"); setStatus("Scanner unavailable — you can enter details manually.");
    }
  }

  function finish(parsed, url) {
    setFields(parsed); setPhase("done");
    onParsed && onParsed(parsed, url);
  }

  function useSample() {
    const parsed = TPDATA.parseMRZ(TPDATA.DEMO_MRZ);
    setPreview(null); finish(parsed, null);
  }

  function onFile(file) {
    if (!file) return;
    if (!/^image\//.test(file.type)) { setPhase("error"); setStatus("Please upload a photo or scan (JPG/PNG) of the passport page."); return; }
    runOCR(file);
  }

  function reset() { setPhase("idle"); setPreview(null); setFields(null); setProgress(0); }

  // ---------- idle ----------
  if (phase === "idle") {
    return (
      <div>
        <div className={"tp-drop" + (drag ? " drag" : "")}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}>
          <div className="ic">{TPI.scan}</div>
          <h4>Drop the passport photo page here</h4>
          <p>or <span className="browse">browse your device</span> · JPG or PNG · we read it on your device only</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => onFile(e.target.files[0])} />
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
          <button type="button" className="tp-btn subtle" onClick={useSample}>{TPI.spark} Try with a sample passport</button>
          <span className="muted" style={{ fontSize: 12.5 }}>·</span>
          <button type="button" className="tp-btn subtle" onClick={() => { setPhase("manual"); onParsed && onParsed({}, null); }}>Skip — I'll type it in</button>
        </div>
      </div>
    );
  }

  // ---------- scanning ----------
  if (phase === "scan") {
    return (
      <div className="tp-scan tp-fade">
        <div className="tp-pp">
          {preview && <img src={preview} alt="passport" />}
          <div className="mrzbox" />
          <div className="scanline" style={{ position: "absolute" }} />
        </div>
        <div>
          <div className="tp-scan-status"><span className="tp-spin" />{status}</div>
          <div className="tp-bar"><i style={{ width: Math.round(progress * 100) + "%" }} /></div>
          <p className="muted" style={{ fontSize: 13 }}>
            Optical character recognition runs entirely inside your browser — the image never leaves this page during scanning.
          </p>
        </div>
      </div>
    );
  }

  // ---------- done ----------
  if (phase === "done") {
    const f = fields || {};
    return (
      <div className="tp-scan tp-fade">
        <div>
          {preview
            ? <div className="tp-pp" style={{ aspectRatio: "125/88" }}><img src={preview} alt="passport" /></div>
            : <div className="tp-pp" style={{ display: "grid", placeItems: "center", background: "var(--surface-2)", color: "var(--muted)" }}>
                <div style={{ textAlign: "center", padding: 16 }}>{TPI.user}<div style={{ fontSize: 12, marginTop: 6 }}>Sample passport</div></div>
              </div>}
          <button type="button" className="tp-btn subtle" style={{ marginTop: 10 }} onClick={reset}>Re-scan a different page</button>
        </div>
        <div>
          <div className="tp-scan-status" style={{ color: "var(--ok)" }}>{TPI.checkc}&nbsp;Details captured — please confirm below</div>
          <ul className="tp-extract">
            <ExtractRow i={0} k="Surname" v={f.surname} />
            <ExtractRow i={1} k="Given name(s)" v={f.given} />
            <ExtractRow i={2} k="Passport no." v={f.passportNo} />
            <ExtractRow i={3} k="Nationality" v={f.nationality} />
            <ExtractRow i={4} k="Date of birth" v={TPDATA.fmtDate(f.dob)} />
            <ExtractRow i={5} k="Sex" v={f.sex} />
            <ExtractRow i={6} k="Expiry" v={TPDATA.fmtDate(f.expiry)} />
          </ul>
          <div style={{ marginTop: 16 }}>
            <Note kind="info"><b>Always double-check.</b> Auto-fill is a best-effort read of the code lines on your passport. Compare each field against your passport before you continue — you can edit anything below.</Note>
          </div>
        </div>
      </div>
    );
  }

  // ---------- error ----------
  if (phase === "error") {
    return (
      <div className="tp-fade">
        <Note kind="warn"><b>{status}</b> No problem — try a clearer, well-lit photo of the full passport page, or enter the details by hand. Everything stays editable.</Note>
        <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
          <button type="button" className="tp-btn ghost" onClick={reset}>{TPI.upload} Try another photo</button>
          <button type="button" className="tp-btn ghost" onClick={useSample}>{TPI.spark} Use sample passport</button>
          <button type="button" className="tp-btn subtle" onClick={() => { setPhase("manual"); onParsed && onParsed({}, null); }}>Enter manually instead</button>
        </div>
      </div>
    );
  }

  // ---------- manual ----------
  return (
    <div className="tp-fade">
      <Note kind="info">You've chosen to enter passport details by hand. Fill them in on the next steps — you can still scan a passport later from the top of the next section.</Note>
      <button type="button" className="tp-btn ghost" style={{ marginTop: 16 }} onClick={reset}>{TPI.scan} Actually, let me scan it</button>
    </div>
  );
}

window.PassportScanner = PassportScanner;
