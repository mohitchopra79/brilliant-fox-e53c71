/* Pure Awakening — programme selector, length ladder and list rendering. */
(function () {
  var L = 'https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/Gallery/gallerylandscape44/General/';
  var S = 'https://scdn.aro.ie/Sites/50/anandaspa/uploads/images/PanelImages/General/';

  var STEPS = [
    { n: '01', img: L + 'Wellness_International_Therapy_2.jpg', t: 'You tell us how you feel', b: 'A short call, in ordinary language. No diagnosis, no jargon, no commitment.', who: 'Fifteen minutes' },
    { n: '02', img: L + 'Ananda_Pavillion_Music_1_1.jpg', t: 'We propose a programme and a length', b: 'Matched to what you said, and to the time you can actually take off work.', who: 'Us' },
    { n: '03', img: L + '5af6a02e-9560-473c-a9f2-e85e856312fd.jpg', t: 'A doctor confirms it on arrival', b: 'A full Ayurvedic consultation the morning you land. The plan is rewritten around you, then adjusted daily.', who: 'Ananda' },
    { n: '04', img: L + 'Wellness_Yoga_Meditation_1.jpg', t: 'You leave with a routine', b: 'Diet, practice and follow-up designed to survive your return home — the part that decides whether it worked.', who: 'You' }
  ];

  var CONCERNS = [
    { label: "I'm exhausted and running on empty", programme: 'Ayurvedic Rejuvenation', nights: '7 nights', intensity: 'Gentle', pair: 'Yoga', img: L + 'Wellness_Ayurveda_therapy_3.jpg',
      plain: 'Warm oil therapies and a rebuilding diet, used to restore energy that stress and travel have drained. The softest of the medical programmes.',
      days: ["A doctor's consultation on arrival sets your oils, diet and pace", 'Two treatments a day — abhyanga massage, herbal steam, shirodhara', 'One yoga class, one walk in the sal forest', 'Three prescribed meals, cooked for your constitution'],
      outcome: 'Sleep that holds, steadier energy through the afternoon, and a short daily routine you can actually keep at home.' },
    { label: "I don't sleep properly", programme: 'Sleep Enhancement', nights: '7 nights', intensity: 'Gentle', pair: 'Meditation', img: S + 'Shirodhara_4.jpg',
      plain: 'A nervous-system programme. Shirodhara — a slow stream of warm oil across the forehead — plus evening meditation and a rebuilt daily rhythm.',
      days: ['Shirodhara or head massage in the late afternoon', 'Guided yoga nidra before dinner', 'No caffeine after breakfast; dinner served early', 'Sleep tracked and reviewed with the doctor mid-stay'],
      outcome: 'A repeatable wind-down routine, and in most cases falling asleep faster within the first week.' },
    { label: 'I want a proper reset of my body', programme: 'Panchakarma or Holistic Detox', nights: '14 nights', intensity: 'Demanding', pair: 'Rest', img: L + '8495ad80-9b0d-4932-9e2c-3062d791a3d6_1.jpg',
      plain: 'The classical Ayurvedic cleanse — medically supervised, staged over weeks. Not a juice fast. Panchakarma is the deepest thing Ananda does.',
      days: ['A preparation phase of oils taken internally and externally', 'The cleansing phase itself, under daily medical review', 'Very light food, long rest, minimal activity', 'A rebuilding phase before you fly'],
      outcome: 'A genuine physiological reset, and dietary guidance that takes months rather than days to unwind.' },
    { label: "I'm stressed and can't switch off", programme: 'Stress Management', nights: '7 nights', intensity: 'Moderate', pair: 'Emotional healing', img: L + '894804af-6de7-4515-86a8-07fd624a6d94.jpg',
      plain: 'Ayurvedic therapies paired with meditation, breathwork and — if you want it — emotional healing sessions with a spiritual psychologist.',
      days: ['Morning pranayama and a Vedanta talk', 'Daily therapy, chosen for a fired-up nervous system', 'An optional one-to-one emotional healing session', 'Evening meditation in the amphitheatre'],
      outcome: 'Practical tools for the moment stress arrives, rather than an instruction to relax.' },
    { label: "I'd like to lose weight sensibly", programme: 'Weight Management', nights: '10 nights', intensity: 'Active', pair: 'Fitness', img: L + 'Wellness_Ayurveda_Therapy_6.jpg',
      plain: 'Metabolic assessment, a calorie-counted Ayurvedic menu and daily training. The food is prescribed, not restricted — you will not be hungry.',
      days: ['Body composition assessed on arrival and at departure', 'Personal training or trekking each morning', 'Detoxifying therapies in the afternoon', 'Three cooked meals, portioned by the doctor'],
      outcome: 'Measurable change on the scales, and a diet and exercise plan written for your life at home.' },
    { label: 'My back or joints hurt', programme: 'Chronic Pain Management', nights: '10 nights', intensity: 'Moderate', pair: 'Physiotherapy', img: L + '52e08094-1b6d-4853-a3e4-584c9149de0f.jpg',
      plain: 'Ayurvedic pain therapies combined with Western physiotherapy and posture work — treating the cause rather than the ache.',
      days: ['Assessment by both the Ayurvedic doctor and the physiotherapist', 'Kati basti, pizhichil or similar targeted therapies', 'One-to-one corrective yoga, no group class', 'Acupuncture where it will help'],
      outcome: 'Reduced pain, and an exercise prescription to stop it returning.' },
    { label: "Nothing is wrong — I'm curious", programme: 'Foundation Wellness', nights: '5 nights', intensity: 'Easy', pair: 'Anything', img: L + 'Wellness_Yoga_5_1.jpg',
      plain: 'The customised introduction. You still see the doctor, but the week is yours to shape — a taste of everything rather than a course of treatment.',
      days: ['Consultation, then a programme you agree together', 'One or two treatments a day, your choice', 'Yoga, meditation, cooking demonstrations, trekking', 'Long afternoons with a book and a view of the valley'],
      outcome: "A clear sense of what you'd come back for — and a very good holiday in the meantime." }
  ];

  var LADDER = [
    { label: '5 nights', head: 'Long enough to stop. Not long enough to change much.', body: 'You will sleep, you will unwind, and you will leave feeling considerably better than you arrived. What you will not get is a physiological shift — the deeper programmes need time. Best treated as a restorative pause inside a bigger India trip.', suits: 'First-timers, and anyone testing the idea', trip: 'Three nights Delhi and Agra beforehand' },
    { label: '7 nights', head: 'The shortest genuinely therapeutic stay.', body: 'The point at which most programmes — rejuvenation, sleep, stress — begin to do their actual work. The doctor has time to adjust your prescription mid-stay, which is where the results come from. This is the length we recommend most often.', suits: 'Almost everyone, for a first serious visit', trip: 'Rishikesh and the Ganges aarti on the way out' },
    { label: '10 nights', head: 'Enough to reset a habit, not only a mood.', body: 'Weight management, pain management and fitness programmes need this long to show measurable change — body composition, mobility, bloodwork. You also stop watching the clock somewhere around day six, which is when guests say the stay begins properly.', suits: 'Measurable goals: weight, pain, fitness', trip: 'Add Rajasthan afterwards, unhurried' },
    { label: '14 nights', head: 'Panchakarma territory.', body: 'The classical cleanse is staged — preparation, cleansing, rebuilding — and cannot honestly be compressed. Two weeks is the minimum for the full protocol under proper medical supervision, and you should fly home rested rather than straight into a meeting.', suits: 'A deep detox, or a genuine health concern', trip: 'Nothing strenuous. Fly home from Delhi' },
    { label: '21 nights', head: 'For the guests who come back.', body: 'Three weeks allows a full Panchakarma plus a second programme layered on top — most often rejuvenation or emotional healing. Rare for a first visit, common for the annual returners who treat Ananda as a yearly service rather than a holiday.', suits: 'Returning guests, and chronic conditions', trip: 'The retreat is the trip' }
  ];

  var WAVES = [
    { when: 'By day three', img: L + 'Wellness_Yoga_Group_1.jpg', what: 'You sleep through the night, the headache from stopping caffeine has passed, and you stop reaching for your phone at breakfast. Most guests describe this as the moment they exhale.' },
    { when: 'On the flight home', img: L + 'Wellness_Spa_pool_3.jpg', what: 'Lighter, clearer, and noticeably calmer — the effect people around you tend to notice before you do. Digestion and energy are usually the first measurable changes.' },
    { when: 'Three months on', img: L + 'Wellness_Yoga_1_1.jpg', what: 'Whether it lasts depends entirely on the routine you took home. Guests who keep the morning practice and the dietary guidance report the benefit holding well past a year.' }
  ];

  var FAQS = [
    ['Will I be hungry?', 'No. Three cooked meals a day, portioned by a doctor. The food is the treatment, not a restriction.'],
    ['Do I have to give up coffee and wine?', 'Yes — no alcohol is served on the estate, and caffeine is limited. This is the part guests dread and, afterwards, credit most.'],
    ['Is it silent?', 'No. There is a quiet policy in the spa and dining room, but you can talk, and most guests do.'],
    ['Do I need to be fit or flexible?', 'No. Yoga is taught one to one or in small groups and adapted to whatever body you arrive in.'],
    ['Can my partner come and do nothing?', "Yes, and many do. A non-programme guest can swim, trek, eat and read while you're in treatment."],
    ['What do I wear?', 'Ananda provides kurta pyjamas, worn by nearly everyone, nearly all the time. Bring almost nothing.'],
    ['Is Wi-Fi available?', 'Yes, in the suites. Phones are discouraged in the spa and dining room, not confiscated.'],
    ['Will a doctor actually see me?', 'Every day if you\u2019re on a programme. The Ayurvedic doctors come from multigenerational practitioner families.']
  ];

  var LOGISTICS = [
    ['Where', 'The Palace Estate, Narendra Nagar'],
    ['Fly into', 'Dehradun — one hour below'],
    ['Best months', 'September to April'],
    ['Book ahead', 'Six months for winter dates']
  ];

  function el(id) { return document.getElementById(id); }

  el('pa-steps').innerHTML = STEPS.map(function (s) {
    return '<div style="border-top:1px solid rgba(203,176,121,0.55); padding-top:24px;">' +
      '<div style="height:190px; position:relative; overflow:hidden; margin-bottom:24px;"><img loading="lazy" src="' + s.img + '" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;" /></div>' +
      '<div style="font-family:\'Fraunces\',Georgia,serif; font-weight:300; font-size:44px; line-height:1; color:#CBB079; letter-spacing:-0.03em;">' + s.n + '</div>' +
      '<h3 style="font-family:\'Fraunces\',Georgia,serif; font-weight:400; font-size:21px; line-height:1.18; color:#F4F0E6; margin:20px 0 10px;">' + s.t + '</h3>' +
      '<p style="font-size:14.5px; line-height:1.7; color:rgba(244,240,230,0.74); margin:0;">' + s.b + '</p>' +
      '<div style="margin-top:14px; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#CBB079;">' + s.who + '</div></div>';
  }).join('');

  el('pa-waves').innerHTML = WAVES.map(function (w) {
    return '<div style="background:#FBF8F0;"><div style="height:230px; position:relative;"><img loading="lazy" src="' + w.img + '" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;" /></div>' +
      '<div style="padding:32px 40px 42px;"><div style="font-family:\'Cormorant Garamond\',Georgia,serif; font-style:italic; font-size:24px; color:#9E532B; margin-bottom:18px;">' + w.when + '</div>' +
      '<p style="font-size:16px; line-height:1.7; color:#2D3654; margin:0;">' + w.what + '</p></div></div>';
  }).join('');

  el('pa-faqs').innerHTML = FAQS.map(function (q) {
    return '<div style="border-top:1px solid rgba(20,33,61,0.18); padding:24px 0;">' +
      '<div style="font-family:\'Fraunces\',Georgia,serif; font-weight:400; font-size:18px; line-height:1.25; margin-bottom:8px;">' + q[0] + '</div>' +
      '<p style="font-size:14.5px; line-height:1.65; color:#2D3654; margin:0;">' + q[1] + '</p></div>';
  }).join('');

  el('pa-logistics').innerHTML = LOGISTICS.map(function (l) {
    return '<div><div style="text-transform:uppercase; letter-spacing:0.22em; font-size:9px; color:#CBB079; margin-bottom:6px; font-weight:500;">' + l[0] + '</div>' +
      '<div style="font-family:\'Fraunces\',Georgia,serif; font-weight:300; font-size:20px; color:#F4F0E6;">' + l[1] + '</div></div>';
  }).join('');

  var ci = 0, ni = 1;

  function paintConcerns() {
    el('pa-concerns').innerHTML = CONCERNS.map(function (c, i) {
      var on = i === ci;
      return '<button type="button" data-i="' + i + '" style="font-family:\'Inter Tight\',sans-serif; font-size:15px; letter-spacing:0.01em; padding:13px 24px; border-radius:2px; cursor:pointer; transition:all .22s ease; border:1px solid ' + (on ? '#14213D' : 'rgba(20,33,61,0.22)') + '; background:' + (on ? '#14213D' : 'transparent') + '; color:' + (on ? '#F4F0E6' : '#14213D') + ';">' + c.label + '</button>';
    }).join('');
    var c = CONCERNS[ci];
    el('pa-prog').textContent = c.programme;
    el('pa-plain').textContent = c.plain;
    el('pa-nights').textContent = c.nights;
    el('pa-int').textContent = c.intensity;
    el('pa-pair').textContent = c.pair;
    el('pa-outcome').textContent = c.outcome;
    el('pa-selimg').style.backgroundImage = 'url(' + c.img + ')';
    el('pa-days').innerHTML = c.days.map(function (d) {
      return '<div style="display:grid; grid-template-columns:14px 1fr; gap:14px; align-items:start;">' +
        '<span style="width:6px; height:6px; background:#C66E3D; border-radius:50%; margin-top:9px;"></span>' +
        '<span style="font-size:15px; color:#2D3654; line-height:1.6;">' + d + '</span></div>';
    }).join('');
  }

  function paintLadder() {
    el('pa-ladder').innerHTML = LADDER.map(function (l, i) {
      var on = i === ni;
      return '<button type="button" data-i="' + i + '" style="font-family:\'Fraunces\',Georgia,serif; font-weight:300; font-size:22px; letter-spacing:-0.02em; padding:14px 26px; cursor:pointer; border-radius:0; transition:all .22s ease; border:1px solid ' + (on ? '#14213D' : 'rgba(20,33,61,0.25)') + '; background:' + (on ? '#14213D' : 'transparent') + '; color:' + (on ? '#F4F0E6' : '#14213D') + ';">' + l.label + '</button>';
    }).join('');
    var n = LADDER[ni];
    el('pa-nhead').textContent = n.head;
    el('pa-nbody').textContent = n.body;
    el('pa-nsuits').textContent = n.suits;
    el('pa-ntrip').textContent = n.trip;
  }

  el('pa-concerns').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    ci = +b.getAttribute('data-i'); paintConcerns();
  });
  el('pa-ladder').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    ni = +b.getAttribute('data-i'); paintLadder();
  });

  paintConcerns();
  paintLadder();
})();
