/* The Great Indian Safari — plates, park selector with crossfading gallery, camps, route, FAQs. */
(function () {
  var TAJ = 'https://cdn.sanity.io/images/ocl5w36p/ihcl_prod/';
  var SIM = 'https://assets.simplotel.com/simplotel/image/upload/';
  var JAM = 'https://www.jamtarawilderness.com/wp-content/uploads/2021/04/';
  var t = function (id, w) { return TAJ + id + '?w=' + (w || 1200) + '&auto=format'; };

  var IMG = {
    safari: t('f7dac83f2024a58242f96b03a2864f783e7a0972-3840x1860.jpg'),
    hero: TAJ + '358059770f0df40af0f24aa769bb3afd45a12070-1920x930.png?w=1920',
    heroS: TAJ + '358059770f0df40af0f24aa769bb3afd45a12070-1920x930.png?w=1400',
    m1: t('08ca215096eb448c694991dac877b35edffeb92e-3840x1860.jpg'),
    m3: t('76c0a796be359ffec405c323773863b13f845e7c-3840x1860.jpg'),
    m4: t('65564b0afdaed314fe40e62719ab766ee310ad86-3841x1860.jpg'),
    m5: t('277e9a8ee67a28c1b6537e312bb582ece7a6f775-3840x1860.jpg'),
    m6: t('ef680735f6d1e158abd348c5ba5617b1cfe94281-1280x1760.jpg'),
    b1: t('ec507d185b6b92e3dcbf440eefdbb751cc380919-3841x1860.jpg'),
    b2: t('b37cfe310c413389853af8c6f6c3b4cbfcb0256c-3841x1860.jpg'),
    lion: 'images/wl-lion.jpg',
    lionLeaves: 'images/wl-lion-leaves.jpg',
    cub: 'images/wl-lion-cub.jpg',
    deer: 'images/wl-gir-deer.jpg',
    leopard: 'images/wl-leopard.jpg',
    kothi: 'images/wl-aramness-kothi.jpg',
    ebDest: 'images/wl-kabini-dest.jpg',
    ebHut: 'images/wl-kabini-hut.jpg',
    ebRes: 'images/wl-kabini-reservoir.jpg',
    ebJungle: 'images/wl-kabini-jungle.jpg',
    ebVillas: 'images/wl-kabini-villas.jpg',
    ebJeep: 'images/wl-kabini-jeep.jpg',
    ebBoat: 'images/wl-kabini-boat.jpg',
    ebStories: 'images/wl-satpura-forest.jpg',
    jamtara: 'https://www.jamtarawilderness.com/wp-content/uploads/2021/03/Jt-9596-1024x682-1.jpg'
  };

  var BIGFIVE = [
    { status: 'Endangered', name: 'Bengal tiger', latin: 'Panthera tigris tigris', img: 'images/wildlife-tiger.jpg', num: 'I', tint: '#3A2C1C', range: '≈3,700 in the wild · India', odds: 'High, in season',
      note: "Around three-quarters of the world's wild tigers live in India. Three or four drives in a good reserve, in the right months, gives most travellers a sighting.", where: 'Bandhavgarh · Ranthambore · Kanha', when: 'March – June' },
    { status: 'Endangered', name: 'Asiatic lion', latin: 'Panthera leo persica', img: IMG.lion, num: 'II', tint: '#43331F', range: '≈700 · Gir only', odds: 'Very high',
      note: "Extinct everywhere else on earth. A single population in Gujarat's Gir forest — smaller and shaggier than the African lion, and remarkably easy to find.", where: 'Gir, Gujarat', when: 'December – April' },
    { status: 'Vulnerable', name: 'One-horned rhino', latin: 'Rhinoceros unicornis', img: 'images/wildlife-rhino.jpg', num: 'III', tint: '#33301F', range: '≈4,000 · India & Nepal', odds: 'Near certain',
      note: 'Armour-plated and prehistoric, grazing the Brahmaputra floodplain in numbers. Sightings at Kaziranga are close to guaranteed, often within an hour.', where: 'Kaziranga, Assam', when: 'November – April' },
    { status: 'Vulnerable', name: 'Snow leopard', latin: 'Panthera uncia', img: 'images/wildlife-snow-leopard.jpg', num: 'IV', tint: '#2C3038', range: '≈700 · Indian Himalaya', odds: 'Fair, with time',
      note: 'The hardest mammal sighting in the world — and India is now the most reliable place to attempt it. A winter expedition at four thousand metres with dedicated spotters.', where: 'Hemis, Ladakh', when: 'January – March' },
    { status: 'Vulnerable', name: 'Indian leopard', latin: 'Panthera pardus fusca', img: IMG.leopard, num: 'V', tint: '#3A2C24', range: 'Widespread · rarely seen', odds: 'High at Jawai',
      note: 'More numerous than the tiger and far harder to find — except at Jawai in Rajasthan, where leopards live openly among granite hills and hilltop temples.', where: 'Jawai · Pench · Satpura', when: 'October – April' }
  ];

  var PARKS = [
    { no: '01', name: 'Ranthambore', state: 'Rajasthan', star: 'Tiger', gallery: [IMG.safari, IMG.heroS, IMG.m4], species: ['Tiger', 'Leopard', 'Sloth bear', 'Marsh crocodile', 'Sambar'], season: 'Oct – Jun', airport: 'Jaipur, 3 hrs', nights: '3', lodge: 'Sher Bagh',
      note: 'The most photographed tigers on earth, hunting between a thousand-year-old fort and its lakes. The easiest reserve to fold into the Golden Triangle, and the one where a sighting most often happens in the open.' },
    { no: '02', name: 'Bandhavgarh', state: 'Madhya Pradesh', star: 'Tiger', gallery: [IMG.m1, IMG.m3, IMG.m4, IMG.m5, IMG.m6], species: ['Tiger', 'Leopard', 'Sloth bear', 'Gaur', 'Chital'], season: 'Oct – Jun', airport: 'Jabalpur, 4 hrs', nights: '3 – 4', lodge: 'Mahua Kothi, a Taj Safari',
      note: 'Among the highest densities of Bengal tigers anywhere, across dense sal forest, craggy cliffs and open meadows below an ancient hill fort. Serious tiger travellers start here.' },
    { no: '03', name: 'Kanha', state: 'Madhya Pradesh', star: 'Tiger · Barasingha', gallery: [IMG.m4, IMG.m5, IMG.safari], species: ['Tiger', 'Barasingha', 'Dhole', 'Gaur', 'Leopard'], season: 'Oct – Jun', airport: 'Jabalpur, 4 hrs', nights: '3', lodge: 'Banjaar Tola, a Taj Safari',
      note: "Kipling's Jungle Book forest, and one of India's largest and best-run parks — sal woodland opening into vast grassy maidans, and the last stronghold of the endangered barasingha swamp deer." },
    { no: '04', name: 'Pench', state: 'Madhya Pradesh', star: 'Tiger · Leopard', gallery: [IMG.b1, IMG.b2, JAM + 'DJI_0007.jpg', JAM + 'Tent-6.jpg', JAM + 'Dining-9612.jpg', JAM + 'Experience-9823.jpg', JAM + 'Tent-9.jpg'], species: ['Tiger', 'Leopard', 'Dhole', 'Gaur', 'Nilgai'], season: 'Oct – Jun', airport: 'Nagpur, 2 hrs', nights: '2 – 3', lodge: 'Baghvan, a Taj Safari',
      note: 'Teak forest along the Pench river, quieter than its neighbours and outstanding for leopard, wild dog and birdlife. Usually paired with Kanha as a two-park loop.' },
    { no: '05', name: 'Kaziranga', state: 'Assam', star: 'One-horned rhino', gallery: [IMG.m5, IMG.safari, IMG.m3], species: ['One-horned rhino', 'Wild buffalo', 'Swamp deer', 'Elephant', 'Tiger'], season: 'Nov – Apr', airport: 'Jorhat, 2 hrs', nights: '3', lodge: 'Diphlu River Lodge',
      note: "Floodplain grassland on the Brahmaputra holding the world's largest population of greater one-horned rhino, plus wild buffalo, swamp deer and a healthy tiger population you almost never see." },
    { no: '06', name: 'Gir', state: 'Gujarat', star: 'Asiatic lion', gallery: [IMG.lionLeaves, IMG.lion, IMG.cub, IMG.deer, IMG.kothi], species: ['Asiatic lion', 'Leopard', 'Chital', 'Sambar', 'Marsh crocodile'], season: 'Dec – Apr', airport: 'Rajkot, 3 hrs', nights: '2 – 3', lodge: 'The Postcard Gir',
      note: 'The only place on earth with wild lions outside Africa. Dry teak and acacia, a smaller and more social lion than its African cousin, and almost no international visitors.' },
    { no: '07', name: 'Jim Corbett', state: 'Uttarakhand', star: 'Tiger · Elephant', gallery: [IMG.b1, IMG.m3, IMG.heroS], species: ['Tiger', 'Asian elephant', 'Gharial', 'Otter', 'Hog deer'], season: 'Nov – Jun', airport: 'Delhi, 6 hrs', nights: '2 – 3', lodge: 'Taj Corbett Resort & Spa',
      note: "India's first national park, in the Himalayan foothills — river valleys, elephant herds and tigers, within a long drive of Delhi. The convenient one." },
    { no: '08', name: 'Kabini · Nagarhole', state: 'Karnataka', star: 'Elephant · Black panther', gallery: [IMG.ebDest, IMG.ebRes, IMG.ebJungle, IMG.ebVillas, IMG.ebJeep, IMG.ebBoat, IMG.ebHut], species: ['Asian elephant', 'Black panther', 'Tiger', 'Gaur', 'Dhole'], season: 'Oct – May', airport: 'Mysuru, 2 hrs', nights: '3', lodge: 'Evolve Back Kuruba Safari Lodge',
      note: 'The Kabini river at the cusp of Nagarhole and Bandipur — the largest congregations of Asian elephant in the country each summer, and the black panther that has made Kabini famous.' },
    { no: '09', name: 'Satpura', state: 'Madhya Pradesh', star: 'Sloth bear · Leopard', gallery: [IMG.ebStories, IMG.m3, IMG.b2], species: ['Sloth bear', 'Leopard', 'Giant squirrel', 'Gaur', 'Tiger'], season: 'Oct – Jun', airport: 'Bhopal, 4 hrs', nights: '3', lodge: 'Bori Safari Lodge',
      note: 'The only Indian reserve where you can walk, canoe and ride out on foot rather than only drive — quieter, wilder, and the best chance in India of a sloth bear.' },
    { no: '10', name: 'Hemis, Ladakh', state: 'Ladakh', star: 'Snow leopard', gallery: [IMG.heroS, IMG.m6], species: ['Snow leopard', 'Blue sheep', 'Ibex', 'Tibetan wolf', 'Golden eagle'], season: 'Jan – Mar', airport: 'Leh, 2 hrs', nights: '7 – 10', lodge: 'Village homestays & camp',
      note: 'A serious expedition rather than a game drive: high-altitude trekking in deep winter with dedicated spotting teams, for the animal most wildlife travellers consider the ultimate sighting on earth.' }
  ];

  var LODGES = [
    { name: 'Mahua Kothi, a Taj Safari', park: 'Bandhavgarh National Park', img: t('08ca215096eb448c694991dac877b35edffeb92e-3840x1860.jpg', 1600), suites: '12', star: 'Tiger', note: 'Twelve kutiya suites on 45 acres of private forest, built in the vernacular of a village homestead. The original Taj Safari lodge.' },
    { name: 'Banjaar Tola, a Taj Safari', park: 'Kanha National Park', img: t('65564b0afdaed314fe40e62719ab766ee310ad86-3841x1860.jpg', 1600), suites: '18', star: 'Tiger', note: 'Two tented camps of nine suites facing the Banjaar river across the meadow, with the park boundary on the far bank.' },
    { name: 'Baghvan, a Taj Safari', park: 'Pench National Park', img: t('ec507d185b6b92e3dcbf440eefdbb751cc380919-3841x1860.jpg', 1600), suites: '12', star: 'Leopard', note: 'Suites with rooftop machans — sleep outdoors above the teak canopy and listen to the forest work through the night.' },
    { name: 'Pashan Garh, a Taj Safari', park: 'Panna National Park', img: t('76c0a796be359ffec405c323773863b13f845e7c-3840x1860.jpg', 1600), suites: '12', star: 'Tiger', note: 'Stone cottages on a plateau above a gorge, in a reserve rewilded with tigers and now among India\u2019s great conservation stories.' },
    { name: 'Meghauli Serai, a Taj Safari', park: 'Chitwan, Nepal', img: t('277e9a8ee67a28c1b6537e312bb582ece7a6f775-3840x1860.jpg', 1600), suites: '30', star: 'Rhino', note: 'On the Rapti river looking into Chitwan — canoe safaris, rhino at close quarters and the Himalaya on a clear morning.' },
    { name: 'The Oberoi Vanyavilas', park: 'Ranthambore National Park', initial: 'V', suites: '25', star: 'Tiger', note: 'Air-conditioned luxury tents with teak floors and private walled gardens, on twenty acres of jungle at the Ranthambore gate.' },
    { name: 'The Oberoi Vindhyavilas', park: 'Bandhavgarh National Park', initial: 'V', suites: '19', star: 'Tiger', note: 'Nineteen tented villas with private pools, opened on twenty-one acres beside the highest tiger density in India.' },
    { name: 'Aman-i-Khás', park: 'Ranthambore National Park', initial: 'A', suites: '10', star: 'Tiger', note: 'Ten Mughal-scale canvas tents, six metres high, with a fire lit each evening in the dry riverbed. Nothing else in India looks like it.' },
    { name: 'Aramness', park: 'Gir National Park', img: IMG.kothi, suites: '18', star: 'Asiatic lion', note: 'Eighteen kothis built as a Gujarati village around courtyards and stepwells, at the gate of the only forest on earth with wild Asiatic lions.' },
    { name: 'Evolve Back Kuruba Safari Lodge', park: 'Kabini · Nagarhole', img: IMG.ebHut, suites: '26', star: 'Elephant', note: 'Huts with private pools drawn from the Kadu Kuruba tribal villages, on the Kabini backwaters in Karnataka.' },
    { name: 'Jamtara Wilderness Camp', park: 'Pench National Park', img: IMG.jamtara, suites: '10', star: 'Tiger', note: 'Ten tents under a banyan on the quiet side of Pench, run by the family behind Project Tiger — and the Star Bed, a machan you sleep on in the open fields.' },
    { name: 'Bori Safari Lodge', park: 'Satpura National Park', initial: 'B', suites: '8', star: 'Sloth bear', note: "Eight suites in India's oldest forest reserve, and the rare permission to explore Satpura on foot, by canoe and on horseback." }
  ];

  var CONTRASTS = [
    { k: 'The animal', v: 'One tiger, tracked over days — rather than scanning a plain for many species at once.' },
    { k: 'The terrain', v: 'Sal and teak forest, ravines, lakes and grassland. Sightlines are short; the reveal is sudden.' },
    { k: 'The vehicle', v: 'Open 4×4 Gypsy with a park-assigned guide and your lodge\u2019s own naturalist beside you.' },
    { k: 'The rest of the trip', v: 'Palaces, the Taj Mahal, Rajasthan and Kerala — a full cultural journey either side of the forest.' },
    { k: 'The cost', v: 'Typically 30–50% below an equivalent East African itinerary, at the same standard of lodge.' }
  ];

  var ITINERARY = [
    { days: 'Days 1 – 2', place: 'Delhi', what: 'Arrive, recover, and spend a morning in Old Delhi with a guide before the forests.' },
    { days: 'Days 3 – 5', place: 'Ranthambore', what: "Three tiger drives through the fort's ravines and lakes, staying in campaign tents at the park gate." },
    { days: 'Day 6', place: 'Agra', what: 'The Taj Mahal at dawn, near-empty, on the drive between Rajasthan and the flight east.' },
    { days: 'Days 7 – 10', place: 'Bandhavgarh', what: 'Four days in the highest-density tiger forest in India, with a naturalist assigned to you for the stay.' },
    { days: 'Days 11 – 13', place: 'Kanha', what: "Kipling's jungle — sal woodland, open maidans and the barasingha, at Banjaar Tola on the river." },
    { days: 'Day 14', place: 'Nagpur → Mumbai', what: 'Fly out via Mumbai, or extend into Kerala, Rajasthan or the Ganges.' },
    { days: 'Optional', place: 'Kaziranga or Gir', what: 'Add four nights for rhino in Assam, or three for the Asiatic lion in Gujarat.' }
  ];

  var FAQS = [
    { q: 'Will I actually see a tiger?', a: 'In a good reserve, over three or four drives, most travellers do. We will not promise it — anyone who does is selling you something. March to June, when water is scarce, gives the best odds.' },
    { q: 'How does it compare on cost?', a: 'A comparable India itinerary usually runs 30–50% below East Africa at the same lodge standard, largely because the lodges and internal flights cost less.' },
    { q: 'Is the vehicle private?', a: 'Yes on our journeys. Parks assign a government guide and a zone permit per vehicle; we book private jeeps and the zones with the best recent activity.' },
    { q: 'How early are the mornings?', a: 'Gates open at sunrise, so you leave in the dark — around 5.30am in summer. Afternoon drives run until the gate closes at dusk. Two drives a day is standard.' },
    { q: 'Are the parks near each other?', a: 'Bandhavgarh, Kanha, Pench and Panna sit within a day\u2019s drive of one another in Madhya Pradesh. Kaziranga, Gir and Ladakh need separate flights, so we plan those as their own legs.' },
    { q: 'What about health and safety?', a: 'The classic parks are low-risk; we send a full pre-departure briefing and your doctor should confirm. Lodges are gated and staffed, and every road transfer is in our own vehicles.' },
    { q: 'Can a non-wildlife partner enjoy it?', a: "That is India's advantage. Someone who tires of game drives can spend the afternoon at a palace, a market, a cooking class or a spa — none of which exists an hour from a Serengeti camp." },
    { q: 'When should I book?', a: 'Permits and the best lodges for March to June sell out six to nine months ahead. For a first visit we suggest planning close to a year out.' }
  ];

  var LOGISTICS = [
    { k: 'Best season', v: 'October to June' },
    { k: 'Peak sightings', v: 'March to June' },
    { k: 'Typical length', v: '12 – 16 nights' },
    { k: 'Book ahead', v: '9 – 12 months' }
  ];

  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* Plates */
  el('wl-plates').innerHTML = BIGFIVE.map(function (a) {
    return '<article class="wl-plate">' +
      '<div class="wl-plate-head"><span class="wl-plate-no">Plate</span><span class="wl-plate-status">' + esc(a.status) + '</span></div>' +
      '<div class="wl-plate-img" style="background-color:' + a.tint + '">' +
        '<img src="' + a.img + '" alt="' + esc(a.name) + '" loading="lazy" />' +
        '<div class="wl-plate-scrim"></div>' +
        '<div class="wl-plate-num">' + a.num + '</div>' +
        '<div class="wl-plate-range">' + esc(a.range) + '</div>' +
      '</div>' +
      '<div class="wl-plate-body">' +
        '<h3>' + esc(a.name) + '</h3><div class="wl-latin">' + esc(a.latin) + '</div>' +
        '<p>' + esc(a.note) + '</p>' +
        '<dl class="wl-facts">' +
          '<div><dt>Where</dt><dd>' + esc(a.where) + '</dd></div>' +
          '<div><dt>Best months</dt><dd>' + esc(a.when) + '</dd></div>' +
          '<div><dt>Odds</dt><dd class="wl-odds">' + esc(a.odds) + '</dd></div>' +
        '</dl>' +
      '</div></article>';
  }).join('');

  /* Africa contrast */
  el('wl-contrasts').innerHTML = CONTRASTS.map(function (c) {
    return '<div class="wl-contrast"><div class="wl-contrast-k">' + esc(c.k) + '</div><div class="wl-contrast-v">' + esc(c.v) + '</div></div>';
  }).join('');

  /* Park index + panel */
  var pi = 0, gi = 0, timer = null;

  el('wl-parklist').innerHTML = PARKS.map(function (p, i) {
    return '<div class="wl-park-row" data-i="' + i + '">' +
      '<span class="wl-park-no">' + p.no + '</span>' +
      '<div><h3>' + esc(p.name) + '</h3><div class="wl-park-state">' + esc(p.state) + '</div></div>' +
      '<div class="wl-park-star">' + esc(p.star) + '</div></div>';
  }).join('');

  function paintPanel() {
    var p = PARKS[pi];
    el('wl-park-layers').innerHTML = p.gallery.map(function (u, i) {
      return '<div class="wl-layer" style="background-image:url(' + u + '); opacity:' + (i === 0 ? 1 : 0) + '"></div>';
    }).join('');
    el('wl-park-ticks').innerHTML = p.gallery.map(function (u, i) {
      return '<i class="wl-tick' + (i === 0 ? ' on' : '') + '"></i>';
    }).join('');
    el('wl-park-name').textContent = p.name;
    el('wl-park-note').textContent = p.note;
    el('wl-park-species').innerHTML = p.species.map(function (s) { return '<span class="wl-chip">' + esc(s) + '</span>'; }).join('');
    el('wl-park-season').textContent = p.season;
    el('wl-park-airport').textContent = p.airport;
    el('wl-park-nights').textContent = p.nights;
    el('wl-park-lodge').textContent = p.lodge;
    [].forEach.call(document.querySelectorAll('.wl-park-row'), function (r, i) {
      r.classList.toggle('on', i === pi);
    });
  }

  function advance() {
    var n = PARKS[pi].gallery.length;
    gi = (gi + 1) % n;
    [].forEach.call(el('wl-park-layers').children, function (d, i) { d.style.opacity = i === gi ? 1 : 0; });
    [].forEach.call(el('wl-park-ticks').children, function (d, i) { d.classList.toggle('on', i === gi); });
  }

  el('wl-parklist').addEventListener('mouseover', function (e) {
    var row = e.target.closest ? e.target.closest('.wl-park-row') : null;
    if (!row) return;
    var i = +row.getAttribute('data-i');
    if (i === pi) return;
    pi = i; gi = 0; paintPanel();
  });
  el('wl-parklist').addEventListener('click', function (e) {
    var row = e.target.closest ? e.target.closest('.wl-park-row') : null;
    if (!row) return;
    pi = +row.getAttribute('data-i'); gi = 0; paintPanel();
  });

  paintPanel();
  timer = setInterval(advance, 4200);

  /* Camps */
  el('wl-lodges').innerHTML = LODGES.map(function (l) {
    var frame = l.img
      ? '<img src="' + l.img + '" alt="' + esc(l.name) + '" loading="lazy" />'
      : '<span class="wl-lodge-initial">' + l.initial + '</span>';
    return '<article class="wl-lodge">' +
      '<div class="wl-lodge-img">' + frame + '</div>' +
      '<div class="wl-lodge-body">' +
        '<div class="wl-lodge-park">' + esc(l.park) + '</div>' +
        '<h3>' + esc(l.name) + '</h3><p>' + esc(l.note) + '</p>' +
        '<div class="wl-lodge-facts">' +
          '<div><span>Suites</span><b>' + esc(l.suites) + '</b></div>' +
          '<div><span>Star species</span><b>' + esc(l.star) + '</b></div>' +
        '</div>' +
      '</div></article>';
  }).join('');

  /* Route */
  el('wl-itinerary').innerHTML = ITINERARY.map(function (d) {
    return '<div class="wl-day"><div class="wl-day-n">' + esc(d.days) + '</div>' +
      '<div><h3>' + esc(d.place) + '</h3><p>' + esc(d.what) + '</p></div></div>';
  }).join('');

  /* FAQs */
  el('wl-faqs').innerHTML = FAQS.map(function (q) {
    return '<div class="wl-faq"><div class="wl-faq-q">' + esc(q.q) + '</div><p>' + esc(q.a) + '</p></div>';
  }).join('');

  /* Logistics */
  el('wl-logistics').innerHTML = LOGISTICS.map(function (l) {
    return '<div><div class="wl-logi-k">' + esc(l.k) + '</div><div class="wl-logi-v">' + esc(l.v) + '</div></div>';
  }).join('');
})();
