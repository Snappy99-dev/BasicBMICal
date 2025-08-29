
const weightEl = document.getElementById('weight');
const heightEl = document.getElementById('height');
const ageEl    = document.getElementById('age');
const errEl    = document.getElementById('err');
const bmiEl    = document.getElementById('bmi');
const catEl    = document.getElementById('cat');
const barEl    = document.getElementById('bar');
const adviceEl = document.getElementById('advice');
const calcBtn  = document.getElementById('calc');
const resetBtn = document.getElementById('reset');
const genderBtns = document.querySelectorAll('.btn-toggle');


let gender = 'male';


genderBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    genderBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    gender = btn.dataset.gender;
  });
});


function round1(n) {
  return (Math.round(n * 10) / 10).toFixed(1);
}

function calculateBMI(weightKg, heightCm) {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

function getCategoryAsian(bmi) {
  if (bmi < 18.5) return 'น้ำหนักน้อย';
  if (bmi < 23)   return 'ปกติ';
  if (bmi < 25)   return 'ท้วม/เสี่ยง';
  if (bmi < 30)   return 'อ้วน ระดับ 1';
  return 'อ้วน ระดับ 2';
}

function getAdviceByCategory(category, g) {
  const Word = g === 'male' ? 'ผู้ชาย' : 'ผู้หญิง';
  if (category === 'น้ำหนักน้อย') {
    return `คุณอาจมีมวลกายน้อยกว่ามาตรฐาน ลองเพิ่มพลังงานด้วยโปรตีนและคาร์บเชิงซ้อน ออกกำลังแนวเวทเทรนนิ่งเบา ๆ เพื่อเพิ่มกล้ามเนื้อ (${Word})`;
  }
  if (category === 'ปกติ') {
    return 'เยี่ยม! รักษาพฤติกรรมเดิมต่อไป เน้นผักผลไม้ โปรตีนพอดี และคาร์ดิโอ 120–150 นาที/สัปดาห์';
  }
  if (category === 'ท้วม/เสี่ยง') {
    return 'เริ่มปรับอาหาร ลดน้ำตาลและของทอด เดินเร็ว/จ๊อกกิ้ง 30 นาที อย่างน้อย 5 วัน/สัปดาห์ จะช่วยลดความเสี่ยง';
  }
  if (category === 'อ้วน ระดับ 1') {
    return 'วางแผนคุมแคลอรีให้ขาดวันละ ~300–500 kcal ร่วมกับเวท + คาร์ดิโอ สม่ำเสมอ และติดตามน้ำหนักทุกสัปดาห์';
  }
  return 'ควรปรึกษาแพทย์/นักโภชนาการเพื่อวางแผนเฉพาะบุคคล และเริ่มปรับพฤติกรรมอย่างจริงจังทันที';
}

function getBarWidthPercent(bmi) {

  const min = 10;
  const max = 40;
  const clamp = Math.max(min, Math.min(max, bmi));
  return ((clamp - min) / (max - min)) * 100;
}

function showError(msg) {
  errEl.style.display = 'block';
  errEl.textContent = msg;
}

function hideError() {
  errEl.style.display = 'none';
  errEl.textContent = '';
}

function validateInputs() {
  const w = parseFloat(weightEl.value);
  const h = parseFloat(heightEl.value);
  const a = parseInt(ageEl.value, 10);

  if (!(w > 0) || !(h > 0)) return 'กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้อง';
  if (h < 80 || h > 250)    return 'ส่วนสูงควรอยู่ระหว่าง 80–250 ซม.';
  if (w < 20 || w > 350)    return 'น้ำหนักควรอยู่ระหว่าง 20–350 กก.';
  if (isNaN(a) || a < 5 || a > 120) return 'กรุณากรอกอายุ 5–120 ปี';
  return '';
}

function updateBadge(category) {
  catEl.className = 'badge';
  if (category === 'ปกติ') {
    catEl.classList.add('ok');
  } else if (category === 'ท้วม/เสี่ยง') {
    catEl.classList.add('warn');
  } else if (category === 'อ้วน ระดับ 1' || category === 'อ้วน ระดับ 2') {
    catEl.classList.add('danger');
  } else {
    catEl.classList.add('info');
  }
}

// ============== ปุ่มคำนวณ ==============
calcBtn.addEventListener('click', function (e) {
  e.preventDefault();

  const vMsg = validateInputs();
  if (vMsg) { showError(vMsg); return; }
  hideError();

  const w = parseFloat(weightEl.value);
  const h = parseFloat(heightEl.value);

  const bmi = calculateBMI(w, h);
  const category = getCategoryAsian(bmi);

  bmiEl.textContent = round1(bmi);
  catEl.textContent = category;
  updateBadge(category);
  barEl.style.width = getBarWidthPercent(bmi) + '%';
  adviceEl.textContent = getAdviceByCategory(category, gender);
});

// ============== ปุ่มล้างค่า ==============
resetBtn.addEventListener('click', function () {
  weightEl.value = '';
  heightEl.value = '';
  ageEl.value = '';

  bmiEl.textContent = '–';
  catEl.textContent = 'กรอกข้อมูลเพื่อดูผล';
  catEl.className = 'badge info';
  barEl.style.width = '0%';
  adviceEl.textContent = 'คำแนะนำจะปรากฏที่นี่หลังคำนวณ';
  hideError();

  gender = 'male';
  genderBtns.forEach((b, i) => {
    b.classList.toggle('active', i === 0);
    b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
  });
});
