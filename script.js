/* ===== KONFIGURASI BISNIS — GANTI SEBELUM PUBLIKASI ===== */
const CONFIG = {
  name: "BEKASI AUTO SELECT",          // nama bisnis
  wa: "6281234567890",                 // nomor WhatsApp format internasional, tanpa + dan spasi
  location: "Bekasi Kota, Jawa Barat",
  address: "",                         // isi alamat showroom nyata (kosong = tidak ditampilkan)
  instagram: "",                       // mis. "https://instagram.com/akunanda"
  hours: ""                            // mis. "Senin–Sabtu 09.00–17.00"
};

/* ===== DATA DEMO KENDARAAN — BUKAN INVENTARIS NYATA =====
   images: isi URL foto asli unit (opsional). features/condition/docs: isi hanya jika sudah terverifikasi. */
const CARS = [
  {id:1,brand:"Toyota",model:"Avanza",year:2018,km:72000,trans:"Manual",fuel:"Bensin",price:135000000,cat:"keluarga",status:"Tersedia",color:"#9aa5b8",images:[],features:[],condition:"",docs:""},
  {id:2,brand:"Honda",model:"Brio",year:2019,km:48000,trans:"Otomatis",fuel:"Bensin",price:145000000,cat:"harian",status:"Tersedia",color:"#c0392b",images:[],features:[],condition:"",docs:""},
  {id:3,brand:"Daihatsu",model:"Xenia",year:2017,km:85000,trans:"Manual",fuel:"Bensin",price:110000000,cat:"usaha",status:"Tersedia",color:"#e5e7eb",images:[],features:[],condition:"",docs:""},
  {id:4,brand:"Toyota",model:"Agya",year:2020,km:35000,trans:"Otomatis",fuel:"Bensin",price:125000000,cat:"harian",status:"Terjual",color:"#f2c94c",images:[],features:[],condition:"",docs:""},
  {id:5,brand:"Suzuki",model:"Ertiga",year:2018,km:66000,trans:"Otomatis",fuel:"Bensin",price:150000000,cat:"keluarga",status:"Tersedia",color:"#374151",images:[],features:[],condition:"",docs:""},
  {id:6,brand:"Toyota",model:"Innova",year:2016,km:98000,trans:"Manual",fuel:"Diesel",price:205000000,cat:"keluarga",status:"Tersedia",color:"#6b7280",images:[],features:[],condition:"",docs:""}
];

const FAQ = [
  ["Apakah saya bisa melihat mobil secara langsung?","Kunjungan ke showroom dapat diatur lewat konsultasi. Silakan hubungi tim untuk memastikan jadwal dan ketersediaan unit."],
  ["Bagaimana cara menjadwalkan test drive?","Tekan tombol “Jadwalkan Test Drive” pada detail unit atau hubungi via WhatsApp, lalu sampaikan waktu yang Anda inginkan."],
  ["Apakah mobil dapat dibeli secara kredit?","Silakan hubungi tim untuk memastikan ketersediaan layanan kredit. Persetujuan kredit ditentukan oleh pihak pembiayaan."],
  ["Apakah saya bisa melakukan inspeksi independen?","Anda dianjurkan memeriksa unit, termasuk melalui bengkel atau jasa inspeksi pilihan sendiri. Konfirmasikan kebijakan ini kepada tim sebelum berkunjung."],
  ["Dokumen apa yang perlu diperiksa sebelum membeli mobil bekas?","Umumnya: BPKB, STNK, faktur/KTP pemilik pertama, kecocokan nomor rangka dan mesin, serta riwayat pajak. Pastikan semuanya cocok dengan fisik kendaraan."],
  ["Apakah tersedia layanan tukar tambah?","Silakan hubungi tim untuk memastikan ketersediaan layanan tukar tambah."],
  ["Bagaimana cara memastikan kondisi kendaraan?","Periksa unit langsung, lakukan test drive, minta informasi riwayat perawatan jika ada, dan pertimbangkan inspeksi independen."]
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rp = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const kmf = n => new Intl.NumberFormat("id-ID").format(n) + " km";
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isPlaceholder = () => CONFIG.wa === "6281234567890";
const carName = c => `${c.brand} ${c.model} ${c.year}`;

function toast(msg, type){
  const t = $("#toast"); t.textContent = msg; t.className = "toast show" + (type==="error" ? " error" : "");
  clearTimeout(toast.t); toast.t = setTimeout(()=>t.className="toast", 4500);
}
function openWA(text){
  if(isPlaceholder()){ toast("Nomor WhatsApp belum diatur. Ubah CONFIG.wa di script.js. Pesan belum dikirim.","error"); return; }
  window.open(`https://wa.me/${CONFIG.wa}?text=${encodeURIComponent(text)}`,"_blank","noopener");
}
const carMsg = c => `Halo, saya tertarik dengan ${carName(c)}. Apakah unit ini masih tersedia? Saya ingin mengetahui detail kondisi kendaraan, harga, dan jadwal test drive.`;

function carSvg(color){
  return `<svg viewBox="0 0 200 100" aria-hidden="true"><path d="M20 70 L28 48 Q32 38 44 36 L78 32 Q90 20 112 20 L138 22 Q152 26 160 42 L180 48 Q190 52 190 64 L190 70 Z" fill="${color}"/><path d="M84 34 Q94 26 110 26 L132 28 Q142 32 148 42 L82 42 Z" fill="#fff" opacity=".6"/><circle cx="55" cy="72" r="14" fill="#1c2433"/><circle cx="150" cy="72" r="14" fill="#1c2433"/><circle cx="55" cy="72" r="6" fill="#cbd5e1"/><circle cx="150" cy="72" r="6" fill="#cbd5e1"/></svg>`;
}
function photo(c, src){
  const img = src ? `<img src="${esc(src)}" alt="${esc(carName(c))}" loading="lazy" onerror="this.remove()">` : "";
  return carSvg(c.color) + img;
}

/* ===== KATALOG ===== */
function filters(){
  const g = id => $(id).value.trim();
  return {q:g("#f-q").toLowerCase(), min:+g("#f-min")*1e6||0, max:+g("#f-max")*1e6||Infinity, year:+g("#f-year")||0, trans:g("#f-trans"), cat:g("#f-cat"), sort:$("#sort").value};
}
function render(){
  const f = filters();
  let list = CARS.filter(c =>
    (!f.q || `${c.brand} ${c.model}`.toLowerCase().includes(f.q)) &&
    c.price >= f.min && c.price <= f.max && c.year >= f.year &&
    (!f.trans || c.trans === f.trans) && (!f.cat || c.cat === f.cat));
  const s = {"price-asc":(a,b)=>a.price-b.price,"price-desc":(a,b)=>b.price-a.price,"year-desc":(a,b)=>b.year-a.year}[f.sort];
  if(s) list.sort(s);
  $("#count").textContent = `${list.length} unit demo ditemukan`;
  $("#empty").hidden = list.length > 0;
  $("#grid").innerHTML = list.map(c => `
    <article class="car">
      <div class="thumb"><span class="tag ${c.status==="Terjual"?"sold":""}">${esc(c.status)}</span><span class="tag demo">Data demo</span>${photo(c,c.images[0])}</div>
      <div class="cbody"><h3>${esc(c.brand)} ${esc(c.model)}</h3>
        <ul class="meta"><li>${c.year}</li><li>${kmf(c.km)}</li><li>${esc(c.trans)}</li><li>${esc(c.fuel)}</li></ul>
        <div class="price">${rp(c.price)}</div>
        <div class="cbtns"><button class="btn btn-ghost dark" data-detail="${c.id}">Lihat Detail</button><button class="btn btn-accent" data-ask="${c.id}">Tanya via WhatsApp</button></div>
      </div>
    </article>`).join("");
}
function resetFilters(){
  $("#searchForm").reset(); $("#sort").value = ""; render();
}
function applyCategory(cat){
  resetFilters(); $("#f-cat").value = cat; render();
  $("#katalog").scrollIntoView({behavior:"smooth"});
}

/* ===== MODAL ===== */
let lastFocus = null;
function showGallery(c, i){
  const imgs = c.images;
  $("#mGal").innerHTML = photo(c, imgs[i]);
  $("#mThumbs").innerHTML = imgs.length > 1 ? imgs.map((u,k)=>`<img src="${esc(u)}" alt="Foto ${k+1} ${esc(carName(c))}" data-i="${k}" tabindex="0">`).join("") : "";
  $$("#mThumbs img").forEach(t => { const go=()=>showGallery(c,+t.dataset.i); t.onclick=go; t.onkeydown=e=>{if(e.key==="Enter")go();}; });
}
function openDetail(id){
  const c = CARS.find(x=>x.id===id); if(!c) return;
  lastFocus = document.activeElement;
  showGallery(c,0);
  const na = "Informasi belum tersedia";
  $("#mInfo").innerHTML = `
    <h3 id="m-title">${esc(carName(c))}</h3>
    <div class="price">${rp(c.price)}</div>
    <p><span class="tag demo" style="position:static">Data demo – bukan unit nyata</span></p>
    <dl><dt>Status</dt><dd>${esc(c.status)}</dd><dt>Tahun</dt><dd>${c.year}</dd><dt>Kilometer</dt><dd>${kmf(c.km)}</dd><dt>Transmisi</dt><dd>${esc(c.trans)}</dd><dt>Bahan bakar</dt><dd>${esc(c.fuel||na)}</dd>
    <dt>Kondisi</dt><dd>${esc(c.condition||"Konfirmasi kepada penjual")}</dd><dt>Dokumen</dt><dd>${esc(c.docs||"Konfirmasi kepada penjual")}</dd></dl>
    <h4>Fasilitas</h4>${c.features.length?`<ul>${c.features.map(f=>`<li>${esc(f)}</li>`).join("")}</ul>`:`<p>${na}</p>`}
    <button class="btn btn-accent" id="mAsk">Konsultasi WhatsApp</button>
    <button class="btn btn-ghost dark" id="mDrive">Jadwalkan Test Drive</button>`;
  $("#mAsk").onclick = () => openWA(carMsg(c));
  $("#mDrive").onclick = () => openWA(`Halo, saya ingin menjadwalkan test drive untuk ${carName(c)}. Kapan waktu yang tersedia?`);
  $("#modal").hidden = false; document.body.style.overflow = "hidden"; $("#mClose").focus();
}
function closeDetail(){
  $("#modal").hidden = true; document.body.style.overflow = "";
  if(lastFocus) lastFocus.focus();
}

/* ===== FORM KONSULTASI ===== */
function submitConsult(e){
  e.preventDefault();
  const v = id => $(id).value.trim();
  const rules = [["name",v("#c-name").length>=2,"Nama minimal 2 karakter."],
    ["phone",/^(\+?62|0)8\d{7,11}$/.test(v("#c-phone").replace(/[\s-]/g,"")),"Masukkan nomor WhatsApp Indonesia yang valid."],
    ["need",!!v("#c-need"),"Pilih kebutuhan kendaraan."],["budget",!!v("#c-budget"),"Pilih rentang anggaran."],["pay",!!v("#c-pay"),"Pilih metode pembayaran."]];
  let ok = true;
  rules.forEach(([k,valid,msg])=>{ $("#e-"+k).textContent = valid ? "" : msg; if(!valid) ok = false; });
  if(!ok){ toast("Periksa kembali isian formulir.","error"); return; }
  openWA(`Halo, saya ${v("#c-name")} (WA: ${v("#c-phone")}). Saya mencari ${v("#c-need")} dengan anggaran ${v("#c-budget")}, pembayaran: ${v("#c-pay")}. Mohon rekomendasinya.`);
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  $$("[data-brand]").forEach(el => el.textContent = CONFIG.name);
  document.title = `Jual Beli Mobil Bekas Bekasi Kota | ${CONFIG.name}`;
  $("#copy").textContent = `© ${new Date().getFullYear()} ${CONFIG.name}. Seluruh data kendaraan pada situs ini adalah demo.`;
  $("#contactList").innerHTML = [`📍 ${CONFIG.address||CONFIG.location}`,
    `💬 WhatsApp: ${isPlaceholder()?"+62 812-3456-7890 (placeholder)":"+"+CONFIG.wa}`,
    `📷 Instagram: ${CONFIG.instagram?`<a href="${esc(CONFIG.instagram)}" rel="noopener" target="_blank">${esc(CONFIG.instagram)}</a>`:"@placeholder"}`,
    `🕘 ${CONFIG.hours||"Jam operasional: placeholder"}`].map(x=>`<li>${x}</li>`).join("");
  $("#heroArt").innerHTML = carSvg("#ff7a1a");

  const ys = [...new Set(CARS.map(c=>c.year))].sort((a,b)=>a-b);
  $("#f-year").innerHTML = `<option value="">Semua</option>` + ys.map(y=>`<option value="${y}">${y}+</option>`).join("");
  $("#faqList").innerHTML = FAQ.map(([q,a],i)=>`<div class="faq"><button aria-expanded="false" aria-controls="fa${i}">${q}</button><div id="fa${i}">${a}</div></div>`).join("");

  $$("[data-wa-general]").forEach(b => b.onclick = () => openWA("Halo, saya ingin berkonsultasi mengenai pilihan mobil bekas sesuai kebutuhan dan anggaran saya."));
  $("#searchForm").onsubmit = e => { e.preventDefault(); render(); $("#katalog").scrollIntoView({behavior:"smooth"}); };
  $("#sort").onchange = render;
  $("#resetBtn").onclick = $("#emptyReset").onclick = resetFilters;
  $$("[data-cat]").forEach(b => b.onclick = () => applyCategory(b.dataset.cat));
  $("#grid").onclick = e => {
    const d = e.target.closest("[data-detail]"), a = e.target.closest("[data-ask]");
    if(d) openDetail(+d.dataset.detail);
    if(a) openWA(carMsg(CARS.find(c=>c.id===+a.dataset.ask)));
  };
  $("#mClose").onclick = closeDetail;
  $("#modal").onclick = e => { if(e.target.id==="modal") closeDetail(); };
  document.addEventListener("keydown", e => { if(e.key==="Escape"){ if(!$("#modal").hidden) closeDetail(); closeMenu(); } });
  $("#faqList").onclick = e => { const b = e.target.closest("button"); if(b) b.setAttribute("aria-expanded", b.getAttribute("aria-expanded")==="false"); };
  $("#consultForm").onsubmit = submitConsult;

  const burger = $("#burger"), menu = $("#menu");
  window.closeMenu = () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded","false"); };
  burger.onclick = () => burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
  menu.onclick = e => { if(e.target.closest("a,button")) closeMenu(); };

  const top = $("#toTop");
  top.onclick = () => window.scrollTo({top:0,behavior:"smooth"});
  addEventListener("scroll", () => { top.hidden = scrollY < 600; }, {passive:true});

  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(x => { if(x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } }), {threshold:.12}) : null;
  $$(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("in"));
  render();
});
