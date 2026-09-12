/* ============================================================
   我的专属偶像生成器 · 核心逻辑
   流程：转组合 → 转成员 → 转属性 → 填格，8 格满后生成偶像卡
   ============================================================ */
'use strict';

/* ---------- 元素引用 ---------- */
const wheelEl = document.getElementById('wheel');
const wheelFrame = document.getElementById('wheelFrame');
const slotsEl = document.getElementById('slots');
const spinBtn = document.getElementById('spinBtn');
const infoBar = document.getElementById('infoBar');
const overlay = document.getElementById('overlay');
const resultCard = document.getElementById('resultCard');
const stepEls = {
  group: document.getElementById('stepGroup'),
  member: document.getElementById('stepMember'),
  attr: document.getElementById('stepAttr'),
};

/* ---------- 常量 ---------- */
const SPIN_DURATION = 4200;   // 旋转动画时长（ms）
const HUB_RADIUS = 26;        // 中心装饰圆半径，标签文字需避开
const GRADE_CLASS = { 'S': 'g-S', 'A+': 'g-AP', 'A': 'g-A', 'B+': 'g-BP', 'B': 'g-B', 'C+': 'g-CP', 'C': 'g-C', 'D': 'g-D' };
const STEP_BTN_TEXT = { group: '🌸 转组合转盘！', member: '🌟 转成员转盘！', attr: '✨ 转属性转盘！' };

/* ---------- 全局状态 ---------- */
const state = {
  slots: Array(8).fill(null), // 每格: { groupName, generation, memberName, attrId, attrName, grade } | null
  currentSlot: 0,             // 当前待填格 0..7
  step: 'group',              // 'group' | 'member' | 'attr'
  pickedGroup: null,
  pickedMember: null,
  isSpinning: false,
  totalRotation: 0,           // 转盘累计旋转角度（度）
  finished: false,
  endTimer: null,             // 转盘动画兜底定时器
  resultTimer: null,          // 结果弹层延时定时器
};

const slotEls = [];           // 8 个属性格的 DOM 引用

/* ============================================================
   初始化
   ============================================================ */
function init() {
  buildSlots();
  spinBtn.addEventListener('click', spinWheel);
  window.addEventListener('resize', debounce(() => {
    if (!state.isSpinning && !state.finished) renderWheel();
  }, 200));
  resetGame();
}

function buildSlots() {
  for (let i = 0; i < 8; i++) {
    const div = document.createElement('div');
    div.className = 'slot';
    div.innerHTML =
      '<div class="slot-attr">待抽取</div>' +
      '<div class="slot-grade">?</div>' +
      '<div class="slot-source"></div>';
    slotsEl.appendChild(div);
    slotEls.push(div);
  }
}

/* ============================================================
   转盘：内容构建 / 渲染 / 旋转
   ============================================================ */

// 根据当前步骤返回转盘条目：{ label, color, ref }
function currentWheelData() {
  if (state.step === 'group') {
    return GROUPS.map((g, i) => ({ label: g.name, color: WHEEL_PALETTE[i % WHEEL_PALETTE.length], ref: g }));
  }
  if (state.step === 'member') {
    return state.pickedGroup.members.map((m, i) => ({
      label: m.name, color: state.pickedGroup.colors[i % 2], ref: m,
    }));
  }
  // 属性盘：只包含还未被抽取的属性
  const unfilled = ATTRS.filter(a => !state.slots.some(s => s && s.attrId === a.id));
  return unfilled.map((a, i) => ({ label: a.name, color: WHEEL_PALETTE[i % WHEEL_PALETTE.length], ref: a }));
}

// 生成扇区渐变字符串：扇区间加白色细线分隔
function buildConicGradient(n, colors) {
  const seg = 360 / n;
  const gap = n >= 15 ? 0.6 : 1;
  const stops = [];
  for (let i = 0; i < n; i++) {
    const s = i * seg, e = (i + 1) * seg;
    stops.push(colors[i % colors.length] + ' ' + s + 'deg ' + (e - gap) + 'deg');
    stops.push('#FFFFFF ' + (e - gap) + 'deg ' + e + 'deg');
  }
  // 从 −seg/2 开始：扇区 i 以 (i × seg) 为中心（从 12 点方向顺时针），
  // 转盘静止时顶部指针正对扇区 0 的中心，标签、落点计算共用此约定
  return 'conic-gradient(from ' + (-seg / 2) + 'deg, ' + stops.join(', ') + ')';
}

// 渲染当前步骤的转盘（清空重建，角度归零）
function renderWheel() {
  const items = currentWheelData();
  const n = items.length;
  const radius = wheelFrame.getBoundingClientRect().width / 2;

  wheelEl.innerHTML = '';
  wheelEl.style.background = buildConicGradient(n, items.map(it => it.color));

  // 字号随扇区数缩放，并保证最长标签径向放得下（不越出转盘、不压中心圆）
  let fontSize = n <= 6 ? 16 : n <= 9 ? 14 : n <= 12 ? 12 : n <= 16 ? 10.5 : 9.5;
  const maxLen = Math.max(...items.map(it => it.label.length));
  const halfMax = (radius - HUB_RADIUS - 20) / 2; // 标签中心到内外边界各留出的径向空间
  let h = maxLen * fontSize * 1.15 + (maxLen - 1); // 1px 字距也算进列高
  if (h / 2 > halfMax) {
    fontSize = Math.max(7, Math.floor((2 * halfMax - (maxLen - 1)) / (maxLen * 1.15)));
  }
  const R = (HUB_RADIUS + radius) / 2; // 标签径向位置：内外边界的中间

  // 每个标签 = 全层旋转容器 + 显式定尺寸的竖排 span，保证文字中心精确落在扇区中心线上
  items.forEach((it, i) => {
    const center = (i * 360) / n; // 扇区中心角（从 12 点方向顺时针，扇区 i 以 i×seg 为中心）
    const label = document.createElement('div');
    label.className = 'wheel-label';
    label.style.transform = 'rotate(' + center + 'deg)';
    const text = document.createElement('span');
    text.textContent = it.label;
    text.style.fontSize = fontSize + 'px';
    text.style.lineHeight = '1.15';
    text.style.width = fontSize + 'px'; // 宽 = 一个字形列
    text.style.height = (it.label.length * fontSize * 1.15 + (it.label.length - 1)) + 'px'; // 高 = 文字列长度
    text.style.transform = 'translateY(' + (-R) + 'px)';
    label.appendChild(text);
    wheelEl.appendChild(label);
  });

  // 换盘时无动画归零
  wheelEl.style.transition = 'none';
  wheelEl.style.transform = 'rotate(0deg)';
  state.totalRotation = 0;
}

// 由转盘旋转角反推指针（顶部）指向的扇区，纯数学计算，不读 DOM
function getSectorAtAngle(theta, n) {
  const p = (((360 - theta) % 360) + 360) % 360; // 指针所在角度（从 12 点顺时针，扇区坐标系）
  const seg = 360 / n;
  return Math.floor(((p + seg / 2) % 360) / seg); // 扇区 i 以 i×seg 为中心
}

// 转动一次转盘
function spinWheel() {
  if (state.isSpinning || state.finished) return;
  const n = currentWheelData().length;
  const seg = 360 / n;

  // 1) 随机选目标扇区
  const idx = Math.floor(Math.random() * n);
  // 2) 指针落在扇区中间带（中心 ±35% 扇区角），避开边界白线
  const pTarget = (((idx * seg) + (Math.random() * 0.7 - 0.35) * seg) % 360 + 360) % 360;
  // 3) 指针在顶部：本地角 p 与屏幕旋转角 θ 的关系 p ≡ (360 − θ)
  const thetaTarget = (360 - pTarget) % 360;
  const thetaNow = state.totalRotation % 360;
  let delta = ((thetaTarget - thetaNow) % 360 + 360) % 360;
  delta += 360 * (5 + Math.floor(Math.random() * 3)); // 再加 5~7 整圈

  state.isSpinning = true;

  // 从当前位置起播过渡动画
  wheelEl.style.transition = 'none';
  wheelEl.style.transform = 'rotate(' + state.totalRotation + 'deg)';
  void wheelEl.offsetWidth; // 强制 reflow，保证过渡从当前位置开始
  wheelEl.style.transition = 'transform ' + SPIN_DURATION + 'ms cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheelEl.style.transform = 'rotate(' + (state.totalRotation + delta) + 'deg)';
  state.totalRotation += delta;

  // 结束回调双保险：transitionend + 超时兜底（onSpinEnd 幂等）
  wheelEl.addEventListener('transitionend', onTransitionEnd, { once: true });
  clearTimeout(state.endTimer);
  state.endTimer = setTimeout(onSpinEnd, SPIN_DURATION + 400);

  updateStepUI();
}

function onTransitionEnd(e) {
  if (e.propertyName === 'transform') onSpinEnd();
}

// 转盘停稳后的落点处理
function onSpinEnd() {
  if (!state.isSpinning) return;
  state.isSpinning = false;
  clearTimeout(state.endTimer);

  const items = currentWheelData();
  const n = items.length;
  const landed = items[getSectorAtAngle(state.totalRotation, n)];

  if (state.step === 'group') {
    state.pickedGroup = landed.ref;
    state.step = 'member';
    renderWheel();
  } else if (state.step === 'member') {
    state.pickedMember = landed.ref;
    const unfilled = ATTRS.filter(a => !state.slots.some(s => s && s.attrId === a.id));
    if (unfilled.length === 1) {
      // 只剩最后一个未抽取属性：直接填格，不再转单扇区属性盘
      fillSlot(state.currentSlot, {
        groupName: state.pickedGroup.name,
        generation: state.pickedGroup.generation,
        memberName: state.pickedMember.name,
        attrId: unfilled[0].id,
        attrName: unfilled[0].name,
        grade: state.pickedMember.stats[unfilled[0].id],
      });
    } else {
      state.step = 'attr';
      renderWheel();
    }
  } else {
    fillSlot(state.currentSlot, {
      groupName: state.pickedGroup.name,
      generation: state.pickedGroup.generation,
      memberName: state.pickedMember.name,
      attrId: landed.ref.id,
      attrName: landed.ref.name,
      grade: state.pickedMember.stats[landed.ref.id],
    });
  }
  updateStepUI();
}

/* ============================================================
   属性栏：填格 / 渲染
   ============================================================ */
function fillSlot(i, data) {
  state.slots[i] = data;
  renderSlot(i);
  const el = slotEls[i];
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');

  if (i === 7) {
    state.finished = true;
    updateStepUI();
    state.resultTimer = setTimeout(showResult, 700);
  } else {
    state.currentSlot = i + 1;
    state.step = 'group';
    state.pickedGroup = null;
    state.pickedMember = null;
    renderWheel();
    updateStepUI();
  }
}

function renderSlot(i) {
  const data = state.slots[i];
  const el = slotEls[i];
  const attrEl = el.querySelector('.slot-attr');
  const gradeEl = el.querySelector('.slot-grade');
  const sourceEl = el.querySelector('.slot-source');
  if (data) {
    attrEl.textContent = data.attrName;
    gradeEl.textContent = data.grade;
    gradeEl.className = 'slot-grade ' + GRADE_CLASS[data.grade];
    sourceEl.textContent = data.memberName + ' · ' + data.groupName;
    el.classList.add('filled');
  } else {
    attrEl.textContent = '待抽取';
    gradeEl.textContent = '?';
    gradeEl.className = 'slot-grade';
    sourceEl.textContent = '';
    el.classList.remove('filled');
  }
}

/* ============================================================
   界面状态刷新
   ============================================================ */
function updateStepUI() {
  // 步骤指示器
  const order = ['group', 'member', 'attr'];
  const stepIdx = order.indexOf(state.step);
  order.forEach((key, i) => {
    const el = stepEls[key];
    el.classList.toggle('active', i === stepIdx && !state.finished);
    el.classList.toggle('done', i < stepIdx || state.finished);
    el.querySelector('.step-num').textContent = i < stepIdx || state.finished ? '✓' : ['①', '②', '③'][i];
  });

  // 转盘按钮
  if (state.finished) {
    spinBtn.textContent = '🎉 已成团！';
    spinBtn.disabled = true;
  } else if (state.isSpinning) {
    spinBtn.textContent = '转动中…';
    spinBtn.disabled = true;
  } else {
    spinBtn.disabled = false;
    spinBtn.textContent = STEP_BTN_TEXT[state.step];
  }

  // 提示条
  infoBar.textContent = buildInfoText();

  // 当前格高亮
  slotEls.forEach((el, i) => el.classList.toggle('current', i === state.currentSlot && !state.finished));
}

function buildInfoText() {
  if (state.finished) return '🎉 8 格全部填满！看看你的专属偶像吧～';
  const spinning = state.isSpinning;
  const g = state.pickedGroup;
  const m = state.pickedMember;
  const gTxt = g ? g.name + ((state.step === 'member' || state.step === 'attr') ? ' ✓' : '')
    : (spinning && state.step === 'group' ? '转动中…' : '?');
  const mTxt = m ? m.name + (state.step === 'attr' ? ' ✓' : '')
    : (spinning && state.step === 'member' ? '转动中…' : '?');
  const aTxt = spinning && state.step === 'attr' ? '转动中…' : '?';
  return '组合：' + gTxt + '　→　成员：' + mTxt + '　→　属性：' + aTxt;
}

/* ============================================================
   结果计算与偶像卡
   ============================================================ */
function valueToGrade(v) {
  let best = 'B', bestDiff = Infinity;
  for (const g of Object.keys(GRADE_VALUES)) {
    const d = Math.abs(v - GRADE_VALUES[g]);
    if (d < bestDiff || (d === bestDiff && GRADE_VALUES[best] < GRADE_VALUES[g])) {
      best = g;
      bestDiff = d;
    }
  }
  return best;
}

function calcOverall() {
  const vals = state.slots.map(s => GRADE_VALUES[s.grade]);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const maxVal = Math.max(...vals);
  const minVal = Math.min(...vals);
  return {
    avg,
    grade: valueToGrade(avg),
    topAttr: state.slots.find(s => GRADE_VALUES[s.grade] === maxVal).attrName,  // 最强属性
    weakAttr: state.slots.find(s => GRADE_VALUES[s.grade] === minVal).attrName, // 最弱属性
  };
}

function getDebutRating(avg) {
  for (const [min, label] of RATING_TABLE) {
    if (avg >= min) return label;
  }
  return '热血出道';
}

function getFunTitle(avg) {
  const vals = state.slots.map(s => GRADE_VALUES[s.grade]);
  const maxVal = Math.max(...vals);
  const minVal = Math.min(...vals);
  if (minVal >= 95) return '六边形战神·天选';
  if (minVal >= 85) return '六边形战神';
  const top = state.slots.find(s => GRADE_VALUES[s.grade] === maxVal);
  const t = ATTR_TITLES[top.attrId];
  if (maxVal >= 95 && minVal < 80) return '偏科战神·' + t;
  if (avg >= 88) return 'ACE 预定·' + t;
  if (avg >= 85) return '潜力新星';
  if (avg >= 80) return '稳步上升';
  if (avg >= 75) return '养成之光';
  return '未来可期';
}

// 按出道评级随机取一条小评语：有强弱差时点名最强/最弱属性，无强弱差（六边形）时取均衡评语
function pickComment(rating, topAttr, weakAttr) {
  const tier = RESULT_COMMENTS[rating] || { gap: [], even: [] };
  const pool = topAttr === weakAttr ? tier.even : tier.gap;
  const tpl = pool[Math.floor(Math.random() * pool.length)] || '';
  return tpl.replace('{top}', topAttr).replace('{weak}', weakAttr);
}

function showResult() {
  const { avg, grade, topAttr, weakAttr } = calcOverall();
  const rating = getDebutRating(avg);

  const badges = state.slots.map(s =>
    '<span class="rc-badge"><span class="rc-badge-attr">' + s.attrName + '</span><b class="' + GRADE_CLASS[s.grade] + '">' + s.grade + '</b></span>'
  ).join('');

  const details = state.slots.map(s =>
    '<div class="rc-line"><span class="rc-line-attr">' + s.attrName + '</span>' +
    '<span class="rc-line-from">' + s.memberName + ' · ' + s.groupName + '（' + s.generation + '代）</span>' +
    '<b class="' + GRADE_CLASS[s.grade] + '">' + s.grade + '</b></div>'
  ).join('');

  resultCard.innerHTML =
    '<div class="rc-head">🎉 恭喜成团！</div>' +
    '<div class="rc-grade ' + GRADE_CLASS[grade] + '">' + grade + '</div>' +
    '<div class="rc-rating">' + rating + '</div>' +
    '<div class="rc-title">「' + getFunTitle(avg) + '」</div>' +
    '<div class="rc-avg">综合评分 ' + avg.toFixed(1) + '</div>' +
    '<div class="rc-comment">💬 ' + pickComment(rating, topAttr, weakAttr) + '</div>' +
    '<div class="rc-badges">' + badges + '</div>' +
    '<div class="rc-divider"></div>' +
    '<div class="rc-details">' + details + '</div>' +
    '<button class="spin-btn" id="againBtn">🎀 再来一局</button>';

  resultCard.querySelector('#againBtn').addEventListener('click', resetGame);

  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('show'));
}

/* ============================================================
   重开一局
   ============================================================ */
function resetGame() {
  overlay.classList.remove('show');
  overlay.hidden = true;
  state.slots = Array(8).fill(null);
  state.currentSlot = 0;
  state.step = 'group';
  state.pickedGroup = null;
  state.pickedMember = null;
  state.isSpinning = false;
  state.totalRotation = 0;
  state.finished = false;
  clearTimeout(state.endTimer);
  clearTimeout(state.resultTimer);
  for (let i = 0; i < 8; i++) renderSlot(i);
  renderWheel();
  updateStepUI();
}

/* ---------- 工具 ---------- */
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

init();
