/* Travel Pals e-Visa — reference data + MRZ passport parser (window.TPDATA) */
(function () {
  // Eligible nationalities (Indian e-Visa eligible list)
  var COUNTRIES = ["Albania","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chile","Colombia","Comoros","Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Grenada","Guatemala","Guernsey","Guinea","Guyana","Haiti","Honduras","Hungary","Iceland","Indonesia","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lesotho","Liberia","Liechtenstein","Lithuania","Luxembourg","Macedonia","Madagascar","Malawi","Malaysia","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru","Netherlands","New Zealand","Nicaragua","Niger","Niue Island","Norway","Oman","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Republic of Korea","Romania","Russia","Rwanda","Saint Christopher & Nevis","Saint Lucia","Saint Vincent & the Grenadines","Samoa","San Marino","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","South Africa","Spain","Sri Lanka","Suriname","Sweden","Switzerland","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Trinidad & Tobago","Turks & Caicos Islands","Tuvalu","UAE","Ukraine","United Kingdom","Uruguay","USA","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Zambia","Zimbabwe"];

  // Full country-of-birth list = eligible nationalities + countries whose nationals
  // aren't e-Visa eligible but where a traveller may have been BORN (incl. India).
  var BIRTH_EXTRA = ["Afghanistan","Algeria","Bhutan","Burkina Faso","Central African Republic","Chad","China","Congo (Republic)","Congo (DR)","Egypt","Ethiopia","Guinea-Bissau","India","Iran","Iraq","Lebanon","Libya","Maldives","Nepal","Nigeria","North Korea","Pakistan","Saudi Arabia","Somalia","South Sudan","Sudan","Syria","Tunisia","Turkey","Turkmenistan","Uganda","Yemen"];
  var BIRTH_COUNTRIES = COUNTRIES.concat(BIRTH_EXTRA).sort(function (a, b) { return a.localeCompare(b); });

  // Map MRZ 3-letter codes -> country name (common eVisa nationalities)
  var ISO3 = {USA:"USA",GBR:"United Kingdom",AUS:"Australia",CAN:"Canada",DEU:"Germany",FRA:"France",ITA:"Italy",ESP:"Spain",NLD:"Netherlands",CHE:"Switzerland",SWE:"Sweden",NOR:"Norway",DNK:"Denmark",FIN:"Finland",IRL:"Ireland",NZL:"New Zealand",JPN:"Japan",KOR:"Republic of Korea",SGP:"Singapore",MYS:"Malaysia",ARE:"UAE",SAU:"Saudi Arabia",QAT:"Qatar",BHR:"Bahrain",OMN:"Oman",KWT:"Kuwait",ZAF:"South Africa",BRA:"Brazil",ARG:"Argentina",MEX:"Mexico",CHL:"Chile",RUS:"Russia",UKR:"Ukraine",POL:"Poland",PRT:"Portugal",BEL:"Belgium",AUT:"Austria",GRC:"Greece",ISR:"Israel",THA:"Thailand",VNM:"Vietnam",IDN:"Indonesia",PHL:"Philippines",LKA:"Sri Lanka",KEN:"Kenya",NGA:"Nigeria",CZE:"Czech Republic",HUN:"Hungary",ROU:"Romania",HRV:"Croatia",ISL:"Iceland",LUX:"Luxembourg",MUS:"Mauritius",FJI:"Fiji"};

  // 33 designated airports + key seaports for arrival
  var PORTS = ["Ahmedabad (Airport)","Amritsar (Airport)","Bagdogra (Airport)","Bengaluru (Airport)","Bhubaneswar (Airport)","Calicut (Airport)","Chandigarh (Airport)","Chennai (Airport)","Cochin (Airport)","Coimbatore (Airport)","Delhi (Airport)","Gaya (Airport)","Goa - Dabolim (Airport)","Goa - Mopa (Airport)","Guwahati (Airport)","Hyderabad (Airport)","Indore (Airport)","Jaipur (Airport)","Kannur (Airport)","Kolkata (Airport)","Lucknow (Airport)","Madurai (Airport)","Mangalore (Airport)","Mumbai (Airport)","Nagpur (Airport)","Port Blair (Airport)","Pune (Airport)","Surat (Airport)","Tiruchirapalli (Airport)","Trivandrum (Airport)","Varanasi (Airport)","Vijayawada (Airport)","Visakhapatnam (Airport)","Chennai (Seaport)","Cochin (Seaport)","Goa (Seaport)","Mangalore (Seaport)","Mumbai (Seaport)"];

  var EXIT_PORTS = PORTS.slice();

  // e-Tourist sub-types
  var VISA_TYPES = [
    {id:"et30", code:"e-T2 V", name:"e-Tourist — 30 days", duration:"30 days from first arrival", entries:"Double entry", stay:"Up to 30 days", fee:"$25", serviceFee:50, bankFee:3.125, stripeUrl:"https://buy.stripe.com/7sYeV5eADeSk7EHaXZew809", note:"Best for a single short trip."},
    {id:"et1y", code:"e-T1 V", name:"e-Tourist — 1 year", duration:"365 days from grant of ETA", entries:"Multiple entries", stay:"Max 180 days / calendar year", fee:"$40", serviceFee:75, bankFee:4.80, stripeUrl:"https://buy.stripe.com/aFacMX3VZ11u3ord67ew80a", popular:true, note:"Most popular — flexible, multiple visits."}
  ];

  var PURPOSES = ["Recreation / Sightseeing","Casual visit to meet friends or relatives","Short-term Yoga programme","Short-term course (language, music, dance, arts & crafts, cooking)","Voluntary work of short duration","Medical treatment under Indian systems of medicine"];

  var RELIGIONS = ["Buddhism","Christianity","Hinduism","Islam","Jainism","Judaism","Sikhism","Zoroastrianism","Other","None / Not specified"];

  var EDUCATION = ["Below Matriculation","Graduate","Higher Secondary","Illiterate","Others","Post Graduate","Professional"];

  var MARITAL = ["Single","Married","Divorced","Widowed"];

  var NAT_BY = ["By Birth","By Naturalization","By Descent","By Registration"];

  var OCCUPATIONS = ["Air Force","Business Person","Doctor","Engineer","Government Service","Homemaker","Journalist","Labour","Lawyer","Media","Military / Defence","Officially Sponsored","Police","Politician","Private Service","Public Service","Retired","Self Employed","Student","Teacher / Academic","Unemployed","Other"];

  // Security / background declarations (Yes/No)
  var SECURITY = [
    "Have you ever been arrested / prosecuted / convicted by a court of law of any country?",
    "Have you ever been refused entry / deported by any country including India?",
    "Have you ever been engaged in human trafficking, drug trafficking, child abuse, crime against women or economic offence?",
    "Have you ever been engaged in cyber crime, terrorism, sabotage, espionage, or by any other means acted against the interests of any nation?",
    "Have you ever been refused an Indian visa or had a previous visa cancelled?",
    "Have you ever sought asylum (political or otherwise) in any country?",
    "By birth or naturalisation, are you a citizen or national of more than one country?",
    "Have you visited any of these countries in the last 6 days: a Yellow-Fever affected country?"
  ];

  var COUNTRIES_VISITED_HINT = "List countries with year of visit, separated by commas.";

  // ---- helpers ----
  function pad(n){return n<10?"0"+n:""+n;}
  function fmtDate(d){ if(!d) return ""; var p=d.split("-"); if(p.length!==3) return d; var m=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return p[2]+" "+m[(+p[1]||1)-1]+" "+p[0]; }

  // ---- MRZ parser (TD3 passport, 2x44) ----
  function clean(s){ return (s||"").toUpperCase().replace(/[^A-Z0-9<]/g,""); }
  // OCR reads MRZ digits as look-alike letters; map them back for numeric fields
  function toDigits(s){ return (s||"").replace(/[OQD]/g,"0").replace(/[IL]/g,"1").replace(/Z/g,"2").replace(/A/g,"4").replace(/S/g,"5").replace(/G/g,"6").replace(/T/g,"7").replace(/B/g,"8"); }
  function yymmdd(s, future){
    s = toDigits(s);
    if(!/^\d{6}$/.test(s)) return "";
    var mm=+s.slice(2,4), dd=+s.slice(4,6);
    if(mm<1||mm>12||dd<1||dd>31) return "";          // reject implausible reads (stay blank, not wrong)
    var yy=+s.slice(0,2), now=new Date(), cc=Math.floor(now.getFullYear()/100)*100;
    var year=cc+yy;
    if(future){ if(year < now.getFullYear()-1) year+=100; }       // expiry: lean future
    else { if(year > now.getFullYear()) year-=100; }              // dob: must be past
    return year+"-"+s.slice(2,4)+"-"+s.slice(4,6);
  }
  // Low-res OCR reads the MRZ filler '<' as repeated letters (LLLL / KKK / CCC).
  // Cut each name at the first run of 3+ identical letters; keep the cut only if a
  // plausible name remains, then turn any real '<' separators into spaces.
  function cleanName(x){
    if(!x) return "";
    var head = x.split(/([A-Z])\1{2,}/)[0];
    if(head && head.length>=2) x=head;
    return x.replace(/</g," ").replace(/\s+/g," ").trim();
  }
  function names(field){
    var sur, giv;
    if(field.indexOf("<<")>-1){
      var p=field.split("<<"); sur=p[0]; giv=p.slice(1).join(" ");
    } else {
      // surname/given separator may itself have been OCR'd as a doubled letter
      var m=field.match(/^([A-Z]{2,}?)([A-Z])\2(.*)$/);
      if(m){ sur=m[1]; giv=m[3]; } else { sur=field; giv=""; }
    }
    return {surname:cleanName(sur), given:cleanName(giv)};
  }
  // Accepts raw OCR text; returns parsed object or null
  function parseMRZ(raw){
    if(!raw) return null;
    var lines=raw.split(/[\r\n]+/).map(clean).filter(function(l){return l.length>=28;});
    // find the two TD3 lines: line1 starts with P<, line2 is mostly digits/< of len ~44
    var l1=null,l2=null;
    for(var i=0;i<lines.length;i++){
      if(/^P[<A-Z]/.test(lines[i]) && lines[i].indexOf("<<")>-1 && !l1){ l1=lines[i]; if(lines[i+1]) l2=lines[i+1]; break; }
    }
    if(!l1){ // fallback: take the two longest lines containing '<'
      var cands=lines.filter(function(l){return l.indexOf("<")>-1;}).sort(function(a,b){return b.length-a.length;});
      if(cands.length>=2){ l1=cands[0].indexOf("<<")>-1?cands[0]:cands[1]; l2=cands[0]===l1?cands[1]:cands[0]; }
    }
    if(!l1) return null;
    l1=(l1+"<".repeat(44)).slice(0,44);
    var issuing=l1.slice(2,5).replace(/</g,"");
    var nm=names(l1.slice(5));
    var out={ surname:nm.surname, given:nm.given, nationality:ISO3[issuing]||"", _issue3:issuing };
    if(l2){
      l2=(l2+"<".repeat(44)).slice(0,44);
      out.passportNo=l2.slice(0,9).replace(/</g,"");
      var nat3=l2.slice(10,13).replace(/</g,"");
      out.nationality=ISO3[nat3]||out.nationality;
      out.dob=yymmdd(l2.slice(13,19),false);
      out.sex={M:"Male",F:"Female"}[l2.slice(20,21)]||"";
      out.expiry=yymmdd(l2.slice(21,27),true);
    }
    if(!out.surname && !out.passportNo) return null;
    return out;
  }

  // Demo MRZ (a fictitious specimen passport) for the "try a sample" affordance
  var DEMO_MRZ = "P<USASMITH<<EMMA<ROSE<<<<<<<<<<<<<<<<<<<<<<<<\n5421098763USA8806154F3009154<<<<<<<<<<<<<<04";

  window.TPDATA = {
    COUNTRIES:COUNTRIES, BIRTH_COUNTRIES:BIRTH_COUNTRIES, PORTS:PORTS, EXIT_PORTS:EXIT_PORTS, VISA_TYPES:VISA_TYPES,
    PURPOSES:PURPOSES, RELIGIONS:RELIGIONS, EDUCATION:EDUCATION, MARITAL:MARITAL,
    NAT_BY:NAT_BY, OCCUPATIONS:OCCUPATIONS, SECURITY:SECURITY, ISO3:ISO3,
    COUNTRIES_VISITED_HINT:COUNTRIES_VISITED_HINT,
    parseMRZ:parseMRZ, DEMO_MRZ:DEMO_MRZ, fmtDate:fmtDate
  };
})();
