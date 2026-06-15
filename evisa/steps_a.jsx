/* Travel Pals e-Visa — Steps A: scan, visa, personal, passport, contact */
/* global React, TPDATA, TPI, PassportScanner, Eyebrow, Group, Note, Field, Text, Area, Select, DateF, Seg, YesNo, Check, RadioCards */

const today = new Date().toISOString().slice(0, 10);
const max120 = new Date(Date.now() + 120 * 864e5).toISOString().slice(0, 10);

function StepScan({ f, set, onParsed }) {
  return (
    <div className="tp-fade">
      <Note kind="info">
        Start by scanning your passport — we'll read the photo page and fill in the form for you.
        Prefer to type everything yourself? Use <b>“Skip — I'll type it in.”</b>
      </Note>
      <div style={{ marginTop: 18 }}>
        <PassportScanner savedPreview={f._ppPreview} onParsed={onParsed} />
      </div>
    </div>
  );
}

function StepVisa({ f, set, a }) {
  const emailMismatch = f.emailConfirm && f.email && f.email.trim().toLowerCase() !== f.emailConfirm.trim().toLowerCase();
  return (
    <div className="tp-fade">
      <Group title="Choose your e-Tourist visa">
        <RadioCards value={f.visaType} onChange={(v) => set("visaType", v)} items={TPDATA.VISA_TYPES} />
      </Group>
      <Group title="Arrival">
        <div className="tp-grid">
          <Select col={6} label="Expected port of arrival" req value={f.arrivalPort}
            onChange={(v) => set("arrivalPort", v)} options={TPDATA.PORTS}
            placeholder="Where you'll enter India" />
          <DateF col={6} label="Expected date of arrival" req value={f.arrivalDate}
            min={today} max={max120} onChange={(v) => set("arrivalDate", v)}
            hint="Apply at least 4 days before travel · up to 120 days ahead" />
        </div>
      </Group>
      <Group title="Contact email">
        <div className="tp-grid">
          <Text col={6} label="Email address" req type="email" value={f.email}
            onChange={(v) => set("email", v)} placeholder="you@email.com"
            hint="Your ETA (travel authorisation) is sent here" />
          <Text col={6} label="Confirm email" req type="email" value={f.emailConfirm}
            onChange={(v) => set("emailConfirm", v)} placeholder="Re-type your email"
            error={emailMismatch ? "Emails don't match" : null} />
        </div>
      </Group>
    </div>
  );
}

function StepPersonal({ f, set, a }) {
  return (
    <div className="tp-fade">
      <Group title="Name (exactly as printed on passport)">
        <div className="tp-grid">
          <Text col={6} label="Surname" req value={f.surname} autofilled={a("surname")}
            onChange={(v) => set("surname", v)} placeholder="Family name" />
          <Text col={6} label="Given name(s)" req value={f.given} autofilled={a("given")}
            onChange={(v) => set("given", v)} placeholder="First & middle names" />
          <YesNo col={12} label="Have you ever changed your name?" value={f.changedName}
            onChange={(v) => set("changedName", v)} />
          {f.changedName === "Yes" &&
            <Text col={12} label="Previous / other name(s)" req value={f.prevName}
              onChange={(v) => set("prevName", v)} placeholder="As previously held" />}
        </div>
      </Group>
      <Group title="Personal details">
        <div className="tp-grid">
          <Seg col={6} label="Sex" req value={f.sex} onChange={(v) => set("sex", v)}
            options={["Male", "Female", "Transgender"]} />
          <DateF col={6} label="Date of birth" req value={f.dob} autofilled={a("dob")}
            max={today} onChange={(v) => set("dob", v)} />
          <Text col={6} label="Town / city of birth" req value={f.birthCity}
            onChange={(v) => set("birthCity", v)} />
          <Select col={6} label="Country of birth" req value={f.birthCountry}
            onChange={(v) => set("birthCountry", v)} options={TPDATA.BIRTH_COUNTRIES} placeholder="Select country" />
          <Select col={6} label="Nationality" req value={f.nationality} autofilled={a("nationality")}
            onChange={(v) => set("nationality", v)} options={TPDATA.COUNTRIES} placeholder="Select country" />
          <Select col={6} label="Acquired nationality by" req value={f.natBy}
            onChange={(v) => set("natBy", v)} options={TPDATA.NAT_BY} />
          <Text col={6} label="National Id No." opt value={f.nationalId}
            onChange={(v) => set("nationalId", v)} hint="If issued by your country" />
          <Select col={6} label="Prior nationality" opt value={f.priorNationality}
            onChange={(v) => set("priorNationality", v)} options={["None"].concat(TPDATA.BIRTH_COUNTRIES)} placeholder="If any" />
          <Select col={6} label="Religion" req value={f.religion}
            onChange={(v) => set("religion", v)} options={TPDATA.RELIGIONS} />
          <Select col={6} label="Educational qualification" req value={f.education}
            onChange={(v) => set("education", v)} options={TPDATA.EDUCATION} />
          <Text col={12} label="Visible identification marks" req value={f.idMarks}
            onChange={(v) => set("idMarks", v)} placeholder="e.g. mole on left cheek — or type 'None'"
            hint="Moles, birthmarks, permanent scars that can be shown if asked" />
        </div>
      </Group>
    </div>
  );
}

function StepPassport({ f, set, a }) {
  return (
    <div className="tp-fade">
      <Group title="Passport">
        <div className="tp-grid">
          <Text col={6} label="Passport number" req value={f.passportNo} autofilled={a("passportNo")}
            onChange={(v) => set("passportNo", v.toUpperCase())} placeholder="As on passport" />
          <Text col={6} label="Place of issue" req value={f.passportPlace}
            onChange={(v) => set("passportPlace", v)} />
          <Select col={6} label="Country of issue" req value={f.passportCountry}
            onChange={(v) => set("passportCountry", v)} options={TPDATA.COUNTRIES} placeholder="Select country" />
          <div className="col-6" />
          <DateF col={6} label="Date of issue" req value={f.passportIssue} max={today}
            onChange={(v) => set("passportIssue", v)} />
          <DateF col={6} label="Date of expiry" req value={f.passportExpiry} min={today} autofilled={a("expiry")}
            onChange={(v) => set("passportExpiry", v)}
            hint="Must be valid at least 6 months from arrival" />
          <YesNo col={12} label="Do you hold any other valid passport / identity certificate?"
            value={f.otherPassport} onChange={(v) => set("otherPassport", v)} />
          {f.otherPassport === "Yes" &&
            <React.Fragment>
              <Text col={6} label="Country of issue" req value={f.otherPpCountry}
                onChange={(v) => set("otherPpCountry", v)} />
              <Text col={6} label="Passport / IC number" req value={f.otherPpNo}
                onChange={(v) => set("otherPpNo", v)} />
              <Text col={6} label="Nationality mentioned therein" req value={f.otherPpNat}
                onChange={(v) => set("otherPpNat", v)} />
              <DateF col={6} label="Date of issue" req value={f.otherPpDate}
                onChange={(v) => set("otherPpDate", v)} />
            </React.Fragment>}
        </div>
      </Group>
      <Note kind="warn">
        Your passport must have at least <b>two blank pages</b> and <b>six months’ validity</b> beyond your arrival date, and be a regular passport (not diplomatic/official).
      </Note>
    </div>
  );
}

function StepContact({ f, set }) {
  return (
    <div className="tp-fade">
      <Group title="Present / residential address">
        <div className="tp-grid">
          <Text col={12} label="House no. / Street / Locality" req value={f.addrStreet}
            onChange={(v) => set("addrStreet", v)} />
          <Text col={6} label="Village / Town / City" req value={f.addrCity}
            onChange={(v) => set("addrCity", v)} />
          <Text col={6} label="State / Province / District" req value={f.addrState}
            onChange={(v) => set("addrState", v)} />
          <Text col={6} label="Postal / Zip code" req value={f.addrZip}
            onChange={(v) => set("addrZip", v)} />
          <Select col={6} label="Country" req value={f.addrCountry}
            onChange={(v) => set("addrCountry", v)} options={TPDATA.COUNTRIES} placeholder="Select country" />
          <Text col={6} label="Mobile number" req type="tel" value={f.mobile}
            onChange={(v) => set("mobile", v)} placeholder="+1 555 000 0000" />
          <Text col={6} label="Phone number" opt type="tel" value={f.phone}
            onChange={(v) => set("phone", v)} />
        </div>
      </Group>
      <Group title="Permanent address">
        <div style={{ marginBottom: 14 }}>
          <Check checked={f.permSame} onChange={(v) => set("permSame", v)}>
            Same as my present / residential address
          </Check>
        </div>
        {!f.permSame &&
          <div className="tp-grid">
            <Text col={12} label="House no. / Street / Locality" req value={f.permStreet}
              onChange={(v) => set("permStreet", v)} />
            <Text col={6} label="Village / Town / City" req value={f.permCity}
              onChange={(v) => set("permCity", v)} />
            <Text col={6} label="State / Province / District" req value={f.permState}
              onChange={(v) => set("permState", v)} />
          </div>}
      </Group>
    </div>
  );
}

Object.assign(window, { StepScan, StepVisa, StepPersonal, StepPassport, StepContact });
