/* Travel Pals e-Visa — Steps B: family, occupation, trip, history, declarations */
/* global React, TPDATA, TPI, Eyebrow, Group, Note, Field, Text, Area, Select, DateF, Seg, YesNo, Check */

function Person({ f, set, prefix, title, optionalBirth }) {
  return (
    <Group title={title}>
      <div className="tp-grid">
        <Text col={6} label="Full name" req value={f[prefix + "Name"]}
          onChange={(v) => set(prefix + "Name", v)} />
        <Select col={6} label="Nationality" req value={f[prefix + "Nat"]}
          onChange={(v) => set(prefix + "Nat", v)} options={["Indian"].concat(TPDATA.COUNTRIES)} placeholder="Select country" />
        <Text col={6} label="Previous nationality" opt value={f[prefix + "PrevNat"]}
          onChange={(v) => set(prefix + "PrevNat", v)} placeholder="If changed" />
        <Text col={6} label="Place of birth" req value={f[prefix + "BirthPlace"]}
          onChange={(v) => set(prefix + "BirthPlace", v)} />
        <Select col={6} label="Country of birth" req value={f[prefix + "BirthCountry"]}
          onChange={(v) => set(prefix + "BirthCountry", v)} options={TPDATA.COUNTRIES} placeholder="Select country" />
      </div>
    </Group>
  );
}

function StepFamily({ f, set }) {
  return (
    <div className="tp-fade">
      <Person f={f} set={set} prefix="father" title="Father's details" />
      <Person f={f} set={set} prefix="mother" title="Mother's details" />
      <Group title="Marital status">
        <div className="tp-grid">
          <Seg col={12} label="Marital status" req value={f.marital}
            onChange={(v) => set("marital", v)} options={TPDATA.MARITAL} />
        </div>
      </Group>
      {f.marital === "Married" && <Person f={f} set={set} prefix="spouse" title="Spouse's details" />}
      <Group title="Background">
        <div className="tp-grid">
          <YesNo col={12}
            label="Were your parents / grandparents (paternal or maternal) Pakistan nationals or belonging to a place now in Pakistan?"
            value={f.pakLink} onChange={(v) => set("pakLink", v)} />
        </div>
        {f.pakLink === "Yes" &&
          <Note kind="warn">If yes, you are generally not eligible for an e-Visa and should apply for a regular visa at an Indian Mission. Our team will advise you after submission.</Note>}
      </Group>
    </div>
  );
}

function StepOccupation({ f, set }) {
  const retiredOrNone = ["Retired", "Unemployed", "Homemaker", "Student"].indexOf(f.occupation) > -1;
  return (
    <div className="tp-fade">
      <Group title="Present occupation">
        <div className="tp-grid">
          <Select col={6} label="Present occupation" req value={f.occupation}
            onChange={(v) => set("occupation", v)} options={TPDATA.OCCUPATIONS} />
          <Text col={6} label="Designation" opt value={f.designation}
            onChange={(v) => set("designation", v)} />
          <Text col={12} label="Employer name / business" req={!retiredOrNone} value={f.employer}
            onChange={(v) => set("employer", v)} placeholder={retiredOrNone ? "Type 'NA' if not applicable" : "Company / organisation"} />
          <Text col={12} label="Employer address" opt value={f.employerAddr}
            onChange={(v) => set("employerAddr", v)} />
          <Text col={6} label="Employer phone" opt type="tel" value={f.employerPhone}
            onChange={(v) => set("employerPhone", v)} />
          <Text col={6} label="Past occupation" opt value={f.pastOccupation}
            onChange={(v) => set("pastOccupation", v)} placeholder="If any" />
        </div>
      </Group>
      <Note kind="info">
        If you have a <b>military, police, defence or government-security</b> background (serving or retired), e-Visa is not available — a regular visa is required. Tell us and we'll guide you.
      </Note>
    </div>
  );
}

function StepTrip({ f, set }) {
  const vt = TPDATA.VISA_TYPES.find((v) => v.id === f.visaType);
  return (
    <div className="tp-fade">
      <Group title="Purpose & itinerary">
        <div className="tp-grid">
          <Select col={6} label="Purpose of visit" req value={f.purpose}
            onChange={(v) => set("purpose", v)} options={TPDATA.PURPOSES} />
          <Select col={6} label="Expected port of exit" opt value={f.exitPort}
            onChange={(v) => set("exitPort", v)} options={TPDATA.EXIT_PORTS} placeholder="If known" />
          <Text col={12} label="Cities / places you plan to visit in India" req value={f.placesToVisit}
            onChange={(v) => set("placesToVisit", v)} placeholder="e.g. Delhi, Agra, Jaipur, Goa" />
          {vt && <div className="col-12"><Note kind="info">
            <b>{vt.name}</b> — {vt.entries.toLowerCase()}, valid {vt.duration.toLowerCase()}.
          </Note></div>}
        </div>
      </Group>
      <Group title="Where you'll stay in India">
        <div className="tp-grid">
          <Text col={12} label="Address in India (hotel / host)" req value={f.indiaAddr}
            onChange={(v) => set("indiaAddr", v)} placeholder="Hotel name or host's address" />
          <Text col={6} label="City / Town" req value={f.indiaCity}
            onChange={(v) => set("indiaCity", v)} />
          <Text col={6} label="State" req value={f.indiaState}
            onChange={(v) => set("indiaState", v)} />
          <Text col={6} label="Phone in India" opt type="tel" value={f.indiaPhone}
            onChange={(v) => set("indiaPhone", v)} />
        </div>
      </Group>
    </div>
  );
}

function StepHistory({ f, set }) {
  return (
    <div className="tp-fade">
      <Group title="Previous travel to India">
        <div className="tp-grid">
          <YesNo col={12} label="Have you visited India before?" value={f.visitedBefore}
            onChange={(v) => set("visitedBefore", v)} />
          {f.visitedBefore === "Yes" &&
            <React.Fragment>
              <Text col={12} label="Address(es) where you stayed" req value={f.prevAddress}
                onChange={(v) => set("prevAddress", v)} />
              <Text col={6} label="Cities previously visited" req value={f.prevCities}
                onChange={(v) => set("prevCities", v)} />
              <Text col={6} label="Last Indian visa number" opt value={f.prevVisaNo}
                onChange={(v) => set("prevVisaNo", v)} placeholder="Type 'NA' if unknown" />
              <Text col={6} label="Type of last visa" opt value={f.prevVisaType}
                onChange={(v) => set("prevVisaType", v)} />
              <Text col={6} label="Place of issue of last visa" opt value={f.prevVisaPlace}
                onChange={(v) => set("prevVisaPlace", v)} />
            </React.Fragment>}
          <YesNo col={12} label="Has permission to visit / extend stay in India previously been refused?"
            value={f.refusedBefore} onChange={(v) => set("refusedBefore", v)} />
          {f.refusedBefore === "Yes" &&
            <Text col={12} label="If yes, mention details (control no. & date)" req value={f.refusedDetail}
              onChange={(v) => set("refusedDetail", v)} />}
        </div>
      </Group>
      <Group title="Other travel">
        <div className="tp-grid">
          <Area col={12} label="Countries visited in the last 10 years" req value={f.countriesVisited}
            onChange={(v) => set("countriesVisited", v)} placeholder="e.g. France (2022), Thailand (2023), UAE (2024)"
            hint={TPDATA.COUNTRIES_VISITED_HINT} rows={2} />
          <YesNo col={12} label="Have you visited any SAARC country (except your own) in the last 3 years?"
            value={f.saarc} onChange={(v) => set("saarc", v)}
            hint="SAARC: Afghanistan, Bangladesh, Bhutan, Maldives, Nepal, Pakistan, Sri Lanka" />
          {f.saarc === "Yes" &&
            <Text col={12} label="Which countries, year & number of visits?" req value={f.saarcDetail}
              onChange={(v) => set("saarcDetail", v)} placeholder="e.g. Nepal, 2024, twice" />}
        </div>
      </Group>
      <Group title="References">
        <div className="tp-grid">
          <Text col={6} label="Reference name in India" req value={f.refIndiaName}
            onChange={(v) => set("refIndiaName", v)} placeholder="Hotel / host / contact" />
          <Text col={6} label="Reference phone in India" req type="tel" value={f.refIndiaPhone}
            onChange={(v) => set("refIndiaPhone", v)} />
          <Text col={12} label="Reference address in India" req value={f.refIndiaAddr}
            onChange={(v) => set("refIndiaAddr", v)} />
          <Text col={6} label="Reference name in home country" req value={f.refHomeName}
            onChange={(v) => set("refHomeName", v)} />
          <Text col={6} label="Reference phone in home country" req type="tel" value={f.refHomePhone}
            onChange={(v) => set("refHomePhone", v)} />
          <Text col={12} label="Reference address in home country" req value={f.refHomeAddr}
            onChange={(v) => set("refHomeAddr", v)} />
        </div>
      </Group>
    </div>
  );
}

function StepSecurity({ f, set }) {
  const ans = f.security || {};
  const anyYes = TPDATA.SECURITY.some((_, i) => ans["q" + i] === "Yes");
  return (
    <div className="tp-fade">
      <Note kind="info">
        Please answer truthfully. A “Yes” doesn't automatically disqualify you, but it must be declared — our team will review and advise before lodging your application.
      </Note>
      <div style={{ marginTop: 8 }}>
        {TPDATA.SECURITY.map((q, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 14.5, color: "var(--ink)", lineHeight: 1.45 }}>
              <span style={{ color: "var(--muted)", fontWeight: 600, marginRight: 8 }}>{i + 1}.</span>{q}
            </div>
            <div className="tp-seg yn" style={{ minWidth: 150 }}>
              {["Yes", "No"].map((opt) => (
                <button type="button" key={opt} className="tp-chip" aria-pressed={ans["q" + i] === opt}
                  onClick={() => set("security", Object.assign({}, ans, { ["q" + i]: opt }))}>{opt}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {anyYes &&
        <div style={{ marginTop: 18 }}>
          <Area label="Please give brief details for any 'Yes' answer above" req value={f.securityDetail}
            onChange={(v) => set("securityDetail", v)} col={12} rows={3} />
        </div>}
    </div>
  );
}

Object.assign(window, { StepFamily, StepOccupation, StepTrip, StepHistory, StepSecurity });
