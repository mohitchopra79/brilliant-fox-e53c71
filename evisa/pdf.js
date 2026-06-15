/* Travel Pals e-Visa — application PDF builder (window.TPPDF.build) */
(function () {
  function build(form, refNo) {
    var jsPDF = (window.jspdf || {}).jsPDF;
    if (!jsPDF) throw new Error("jsPDF not loaded");
    var f = form || {};
    var D = window.TPDATA;
    var doc = new jsPDF({ unit: "pt", format: "a4" });
    var PW = doc.internal.pageSize.getWidth();   // 595
    var PH = doc.internal.pageSize.getHeight();   // 842
    var M = 46, RIGHT = PW - M, KX = M + 10, VX = M + 168, VW = RIGHT - VX - 6;
    var y = 0;
    var now = new Date();
    var dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
      " · " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    function header() {
      doc.setFillColor(192, 20, 46); doc.rect(0, 0, PW, 78, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold"); doc.setFontSize(17); doc.text("TRAVEL PALS", M, 36);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      doc.text("Indian e-Tourist Visa — Application Summary", M, 56);
      doc.setFontSize(9);
      doc.text("Reference: " + (refNo || "—"), RIGHT, 34, { align: "right" });
      doc.text("Prepared: " + dateStr, RIGHT, 50, { align: "right" });
      doc.setFontSize(7.5); doc.setTextColor(255, 220, 224);
      doc.text("Assisted application prepared by Travel Pals — not a Government of India document", RIGHT, 66, { align: "right" });
      y = 104;
    }
    function footer() {
      var pages = doc.internal.getNumberOfPages();
      for (var i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setDrawColor(228, 220, 205); doc.setLineWidth(0.5); doc.line(M, PH - 40, RIGHT, PH - 40);
        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(150, 140, 125);
        doc.text("Travel Pals · India e-Visa Service · travelpals.in", M, PH - 26);
        doc.text("Page " + i + " of " + pages, RIGHT, PH - 26, { align: "right" });
      }
    }
    function ensure(h) { if (y + h > PH - 56) { doc.addPage(); y = 56; } }
    function section(t) {
      ensure(34);
      doc.setFillColor(247, 241, 231); doc.rect(M, y - 13, RIGHT - M, 22, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(140, 18, 36);
      doc.text(String(t).toUpperCase(), KX, y + 2);
      y += 26;
    }
    function row(k, v) {
      var val = (v === undefined || v === null || v === "") ? "—" : String(v);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      var lines = doc.splitTextToSize(val, VW);
      var h = Math.max(15, lines.length * 12) + 5;
      ensure(h);
      doc.setTextColor(125, 116, 103); doc.text(k, KX, y);
      doc.setTextColor(28, 24, 20); doc.text(lines, VX, y);
      doc.setDrawColor(238, 232, 222); doc.setLineWidth(0.4); doc.line(M, y + h - 7, RIGHT, y + h - 7);
      y += h;
    }
    function dt(d) { return D ? D.fmtDate(d) : (d || "—"); }
    var vt = D ? D.VISA_TYPES.find(function (v) { return v.id === f.visaType; }) : null;

    header();

    section("Visa & arrival");
    row("Visa type", vt ? vt.name + "  (" + vt.entries + ")" : f.visaType);
    row("Port of arrival", f.arrivalPort);
    row("Expected arrival", dt(f.arrivalDate));
    row("Port of exit", f.exitPort);
    row("Email", f.email);

    section("Applicant");
    row("Surname", f.surname);
    row("Given name(s)", f.given);
    row("Changed name?", f.changedName === "Yes" ? "Yes — " + (f.prevName || "") : "No");
    row("Sex", f.sex);
    row("Date of birth", dt(f.dob));
    row("Town / country of birth", [f.birthCity, f.birthCountry].filter(Boolean).join(", "));
    row("Nationality", f.nationality + (f.natBy ? "  (" + f.natBy + ")" : ""));
    row("Prior nationality", f.priorNationality);
    row("National ID no.", f.nationalId);
    row("Religion", f.religion);
    row("Education", f.education);
    row("Visible ID marks", f.idMarks);

    section("Passport");
    row("Passport number", f.passportNo);
    row("Place of issue", [f.passportPlace, f.passportCountry].filter(Boolean).join(", "));
    row("Date of issue", dt(f.passportIssue));
    row("Date of expiry", dt(f.passportExpiry));
    row("Other passport held?", f.otherPassport === "Yes"
      ? "Yes — " + [f.otherPpNo, f.otherPpCountry, f.otherPpNat].filter(Boolean).join(", ") : "No");

    section("Contact & address");
    row("Present address", [f.addrStreet, f.addrCity, f.addrState, f.addrZip, f.addrCountry].filter(Boolean).join(", "));
    row("Permanent address", f.permSame ? "Same as present address"
      : [f.permStreet, f.permCity, f.permState].filter(Boolean).join(", "));
    row("Mobile", f.mobile);
    row("Phone", f.phone);

    section("Family");
    row("Father", [f.fatherName, f.fatherNat, f.fatherBirthPlace, f.fatherBirthCountry].filter(Boolean).join(" · "));
    row("Mother", [f.motherName, f.motherNat, f.motherBirthPlace, f.motherBirthCountry].filter(Boolean).join(" · "));
    row("Marital status", f.marital);
    if (f.marital === "Married")
      row("Spouse", [f.spouseName, f.spouseNat, f.spouseBirthPlace, f.spouseBirthCountry].filter(Boolean).join(" · "));
    row("Pakistan family link?", f.pakLink);

    section("Profession / occupation");
    row("Present occupation", f.occupation);
    row("Designation", f.designation);
    row("Employer / business", f.employer);
    row("Employer address", f.employerAddr);
    row("Employer phone", f.employerPhone);
    row("Past occupation", f.pastOccupation);

    section("Trip details");
    row("Purpose of visit", f.purpose);
    row("Places to visit", f.placesToVisit);
    row("Address in India", [f.indiaAddr, f.indiaCity, f.indiaState].filter(Boolean).join(", "));
    row("Phone in India", f.indiaPhone);

    section("Travel history & references");
    row("Visited India before?", f.visitedBefore === "Yes"
      ? "Yes — " + [f.prevCities, f.prevVisaNo, f.prevVisaType].filter(Boolean).join(", ") : "No");
    row("Previously refused?", f.refusedBefore === "Yes" ? "Yes — " + (f.refusedDetail || "") : "No");
    row("Countries visited (10 yrs)", f.countriesVisited);
    row("SAARC travel (3 yrs)?", f.saarc === "Yes" ? "Yes — " + (f.saarcDetail || "") : "No");
    row("Reference in India", [f.refIndiaName, f.refIndiaPhone, f.refIndiaAddr].filter(Boolean).join(" · "));
    row("Reference at home", [f.refHomeName, f.refHomePhone, f.refHomeAddr].filter(Boolean).join(" · "));

    section("Background declarations");
    var ans = f.security || {};
    if (D) D.SECURITY.forEach(function (q, i) {
      var a = ans["q" + i] || "—";
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      var ql = doc.splitTextToSize((i + 1) + ". " + q, RIGHT - M - 50);
      var h = ql.length * 11 + 7; ensure(h);
      doc.setTextColor(60, 54, 48); doc.text(ql, KX, y);
      doc.setFont("helvetica", "bold"); doc.setTextColor(a === "Yes" ? 160 : 60, a === "Yes" ? 20 : 110, a === "Yes" ? 46 : 70);
      doc.text(a, RIGHT, y, { align: "right" });
      doc.setDrawColor(238, 232, 222); doc.line(M, y + h - 7, RIGHT, y + h - 7);
      y += h;
    });
    if (f.securityDetail) row("Details", f.securityDetail);

    section("Documents on file");
    row("Photograph", f.photoName || "Pending upload");
    row("Passport bio page", f.docPassportName || (f._ppPreview ? "Scanned image on file" : "Pending upload"));

    footer();
    return doc;
  }

  function filename(form, refNo) {
    var sur = (form && form.surname ? form.surname : "applicant").replace(/[^A-Za-z0-9]/g, "");
    return "TravelPals-eVisa-" + sur + "-" + (refNo || "REF") + ".pdf";
  }

  window.TPPDF = { build: build, filename: filename };
})();
