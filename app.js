/* ============================================================
   我的专属偶像生成器 · 核心逻辑
   流程：转属性 → 转组合 → 转成员 → 填格，8 格满后生成偶像卡
   ============================================================ */
'use strict';

/* ---------- 元素引用 ---------- */
const wheelEl = document.getElementById('wheel');
const wheelFrame = document.getElementById('wheelFrame');
const slotsEl = document.getElementById('slots');
const spinBtn = document.getElementById('spinBtn');
const infoBar = document.getElementById('infoBar');
const toastEl = document.getElementById('landedToast');
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
const STEP_BTN_TEXT = { attr: '✨ 转属性转盘！', group: '🌸 转组合转盘！', member: '🌟 转成员转盘！' };

/* ---------- 全局状态 ---------- */
const state = {
  slots: Array(8).fill(null), // 每格: { groupName, generation, memberName, attrId, attrName, grade } | null
  currentSlot: 0,             // 当前待填格 0..7
  step: 'attr',               // 'attr' | 'group' | 'member'
  pickedAttr: null,
  pickedGroup: null,
  isSpinning: false,
  totalRotation: 0,           // 转盘累计旋转角度（度）
  finished: false,
  endTimer: null,             // 转盘动画兜底定时器
  resultTimer: null,          // 结果弹层延时定时器
  toastTimer: null,           // 落定提示淡出定时器
  shared: false,              // 是否正展示朋友分享的结果卡
  shareMsgTimer: null,        // 分享反馈提示定时器
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
  applySharedResult(); // 链接携带结果时，直接展示朋友分享的偶像卡
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

  if (state.step === 'attr') {
    state.pickedAttr = landed.ref;
    state.step = 'group';
    renderWheel();
    renderSlot(state.currentSlot); // 立刻把抽中的属性名显示到当前格
    showLandedToast('✨ 抽中属性：' + landed.ref.name);
  } else if (state.step === 'group') {
    state.pickedGroup = landed.ref;
    state.step = 'member';
    renderWheel();
    showLandedToast('🌸 抽中组合：' + landed.ref.name);
  } else {
    // member 步：成员落地即填格
    showLandedToast('🌟 抽中成员：' + landed.ref.name);
    fillSlot(state.currentSlot, {
      groupName: state.pickedGroup.name,
      generation: state.pickedGroup.generation,
      memberName: landed.ref.name,
      attrId: state.pickedAttr.id,
      attrName: state.pickedAttr.name,
      grade: landed.ref.stats[state.pickedAttr.id],
      memberId: landed.ref.id,
      groupId: state.pickedGroup.id,
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
    state.step = 'attr';
    state.pickedAttr = null;
    state.pickedGroup = null;
    const unfilled = ATTRS.filter(a => !state.slots.some(s => s && s.attrId === a.id));
    if (unfilled.length === 1) {
      // 只剩最后一个属性：自动选定，跳过单扇区属性盘
      state.pickedAttr = unfilled[0];
      state.step = 'group';
      renderSlot(state.currentSlot); // 自动选定的属性名立即显示到当前格
      // 本格成员的落定提示还在播放，1.8 秒后再弹出自动选定提示，避免互相盖住
      state.toastTimer = setTimeout(() => showLandedToast('✨ 自动选定属性：' + unfilled[0].name), 1800);
    }
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
    el.classList.remove('picked');
  } else {
    // 属性盘已落定但该格尚未填满：先显示已抽中的属性名
    const pending = i === state.currentSlot && state.pickedAttr;
    attrEl.textContent = pending ? state.pickedAttr.name : '待抽取';
    gradeEl.textContent = '?';
    gradeEl.className = 'slot-grade';
    sourceEl.textContent = '';
    el.classList.remove('filled');
    el.classList.toggle('picked', !!pending);
  }
}

/* ============================================================
   界面状态刷新
   ============================================================ */
function updateStepUI() {
  // 步骤指示器
  const order = ['attr', 'group', 'member'];
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
  const a = state.pickedAttr;
  const g = state.pickedGroup;
  const aTxt = a ? a.name + ((state.step === 'group' || state.step === 'member') ? ' ✓' : '')
    : (spinning && state.step === 'attr' ? '转动中…' : '?');
  const gTxt = g ? g.name + (state.step === 'member' ? ' ✓' : '')
    : (spinning && state.step === 'group' ? '转动中…' : '?');
  const mTxt = spinning && state.step === 'member' ? '转动中…' : '?';
  return '属性：' + aTxt + '　→　组合：' + gTxt + '　→　成员：' + mTxt;
}

// 转盘落定后，在转盘中央弹出抽中结果的动画提示
function showLandedToast(text) {
  clearTimeout(state.toastTimer);
  toastEl.textContent = text;
  toastEl.hidden = false;
  toastEl.classList.remove('show');
  void toastEl.offsetWidth; // 强制 reflow，让动画重新播放
  toastEl.classList.add('show');
  state.toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
    toastEl.hidden = true;
  }, 1700);
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
    '<div class="rc-head">' + (state.shared ? '🎉 朋友分享的偶像卡！' : '🎉 恭喜成团！') + '</div>' +
    '<div class="rc-grade ' + GRADE_CLASS[grade] + '">' + grade + '</div>' +
    '<div class="rc-rating">' + rating + '</div>' +
    '<div class="rc-title">「' + getFunTitle(avg) + '」</div>' +
    '<div class="rc-avg">综合评分 ' + avg.toFixed(1) + '</div>' +
    '<div class="rc-comment">💬 ' + pickComment(rating, topAttr, weakAttr) + '</div>' +
    '<div class="rc-badges">' + badges + '</div>' +
    '<div class="rc-divider"></div>' +
    '<div class="rc-details">' + details + '</div>' +
    '<button class="spin-btn" id="againBtn">🎀 再来一局</button>' +
    '<div class="rc-actions">' +
      '<button class="rc-btn-ghost" id="shareBtn">📤 分享</button>' +
      '<button class="rc-btn-ghost" id="saveBtn">💾 保存图片</button>' +
    '</div>' +
    '<div class="share-panel" id="sharePanel" hidden>' +
      '<button class="share-opt" id="shareWechat">🟢 分享到微信 / 朋友圈</button>' +
      '<button class="share-opt" id="shareXhs">📕 复制文案到小红书</button>' +
      '<button class="share-opt" id="saveCleanBtn">🖼 保存纯净图（小红书用，无二维码）</button>' +
      '<div class="share-msg" id="shareMsg"></div>' +
    '</div>';

  resultCard.querySelector('#againBtn').addEventListener('click', resetGame);
  resultCard.querySelector('#shareBtn').addEventListener('click', () => {
    const panel = resultCard.querySelector('#sharePanel');
    panel.hidden = !panel.hidden;
    showShareMsg(''); // 展开/收起时清空旧反馈
  });
  resultCard.querySelector('#shareWechat').addEventListener('click', shareToWechat);
  resultCard.querySelector('#shareXhs').addEventListener('click', shareToXhs);
  resultCard.querySelector('#saveBtn').addEventListener('click', () => saveImage(true));
  resultCard.querySelector('#saveCleanBtn').addEventListener('click', () => saveImage(false));

  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('show'));
}

/* ============================================================
   分享与保存图片
   ============================================================ */

// 结果摘要文案（分享/小红书通用）
function buildShareText() {
  const { avg, grade } = calcOverall();
  return '我的专属偶像：' + grade + ' 级 · ' + getDebutRating(avg) + '「' + getFunTitle(avg) + '」！快来测测你的 →';
}

// 携带完整结果的分享链接：#r=<attrId~grade~memberId~groupId|…×8>
function buildShareUrl() {
  const seg = state.slots.map(s =>
    s.attrId + '~' + s.grade + '~' + s.memberId + '~' + s.groupId
  ).join('|');
  return location.origin + location.pathname + '#r=' + encodeURIComponent(seg);
}

// 打开带 #r= 的链接时，还原朋友分享的结果卡；非法数据一律忽略
function applySharedResult() {
  const m = /^#r=(.+)$/.exec(location.hash || '');
  if (!m) return;
  let raw;
  try { raw = decodeURIComponent(m[1]); } catch (e) { return; }
  const parts = raw.split('|');
  if (parts.length !== 8) return;
  const slots = [];
  const seenAttrs = new Set();
  for (const p of parts) {
    const f = p.split('~');
    if (f.length !== 4) return;
    const attr = ATTRS.find(a => a.id === f[0]);
    const group = GROUPS.find(g => g.id === f[3]);
    const member = group && group.members.find(m => m.id === f[2]);
    if (!attr || !member || !(f[1] in GRADE_VALUES)) return;
    if (seenAttrs.has(attr.id)) return;
    seenAttrs.add(attr.id);
    slots.push({
      groupName: group.name, generation: group.generation,
      memberName: member.name, attrId: attr.id, attrName: attr.name, grade: f[1],
      memberId: member.id, groupId: group.id,
    });
  }
  state.slots = slots;
  state.finished = true;
  state.shared = true;
  for (let i = 0; i < 8; i++) renderSlot(i);
  updateStepUI();
  showResult();
}

// 系统分享面板（手机可选微信/朋友圈）；不支持时降级复制链接
async function shareToWechat() {
  const url = buildShareUrl();
  if (navigator.share) {
    try {
      await navigator.share({ title: '✨ 我的专属偶像生成器', text: buildShareText(), url });
      showShareMsg('');
      return;
    } catch (e) {
      return; // 用户取消分享
    }
  }
  const ok = await copyText(url);
  showShareMsg(ok ? '✓ 当前设备不支持系统分享，链接已复制' : '复制失败，请手动复制链接');
}

// 复制文案+链接，粘贴到小红书发布
async function shareToXhs() {
  const ok = await copyText(buildShareText() + '\n' + buildShareUrl());
  showShareMsg(ok ? '✓ 已复制，去小红书粘贴发布吧～' : '复制失败，请手动复制');
}

// 复制文本：优先剪贴板 API，失败回退 execCommand（兼容 file:// 双击本地）
async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* 走回退 */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand && document.execCommand('copy');
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) {
    return false;
  }
}

// 结果卡内分享反馈提示
function showShareMsg(text) {
  const el = resultCard.querySelector('#shareMsg');
  if (!el) return;
  clearTimeout(state.shareMsgTimer);
  el.textContent = text;
  if (text) {
    state.shareMsgTimer = setTimeout(() => { el.textContent = ''; }, 1500);
  }
}

// 生成结果卡图片：iOS 走系统分享面板「存储图像」入相册；分享面板出错自动回退为直接下载
// withQr=false 时为纯净版（无二维码/网址，供小红书等平台规避站外导流审核）
async function saveImage(withQr) {
  try {
    const { blob } = await buildResultImage(withQr);
    if (!blob) {
      showShareMsg('当前浏览器不支持保存图片');
      return;
    }
    const file = new File([blob], '我的专属偶像.png', { type: 'image/png' });
    // canShare 本身也可能抛错（老版本浏览器），一律按「不支持文件分享」处理 → 走下载
    let canFileShare = false;
    try {
      canFileShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] }));
    } catch (e) {
      canFileShare = false;
    }
    if (canFileShare) {
      try {
        await navigator.share({ files: [file], title: '✨ 我的专属偶像', text: buildShareText() });
        showShareMsg('');
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return; // 用户主动取消分享面板，不算失败
        // 其他分享错误：继续往下走下载回退
      }
    }
    downloadImage(blob);
    showShareMsg('✓ 图片已保存到下载目录');
  } catch (e) {
    console.error('保存图片失败:', e);
    showShareMsg('保存失败（' + (e && e.name ? e.name : '未知错误') + '），请重试');
  }
}

function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '我的专属偶像.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// 加载二维码资源（加载失败时返回 null，绘制时跳过）
function loadQrImage() {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'qr.png';
  });
}

// Canvas 自绘结果卡（零依赖；3:4 竖版 1080×1440 适配小红书信息流，2x 缩放保证清晰）
async function buildResultImage(withQr) {
  const W = 540, H = 720, scale = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  const qrImg = withQr ? await loadQrImage() : null;
  drawResultCard(ctx, W, H, qrImg, withQr);
  return new Promise(resolve => {
    if (canvas.toBlob) {
      canvas.toBlob(blob => resolve({ canvas, blob }));
    } else {
      resolve({ canvas, blob: null });
    }
  });
}

function drawResultCard(ctx, W, H, qrImg, withQr) {
  const { avg, grade, topAttr, weakAttr } = calcOverall();
  const rating = getDebutRating(avg);
  const title = getFunTitle(avg);
  const comment = pickComment(rating, topAttr, weakAttr);
  const FONT = '"PingFang SC", "Yuanti SC", "Microsoft YaHei", sans-serif';

  // 白底圆角卡 + 粉色阴影
  ctx.save();
  ctx.shadowColor = 'rgba(255, 150, 200, .35)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = '#FFFFFF';
  roundRectPath(ctx, 0, 0, W, H, 28);
  ctx.fill();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9A8AAB';
  ctx.font = '17px ' + FONT;
  ctx.fillText(state.shared ? '🎉 朋友分享的偶像卡！' : '🎉 恭喜成团！', W / 2, 54);

  // 总评大字（金色渐变）
  const grad = ctx.createLinearGradient(W / 2 - 70, 0, W / 2 + 70, 0);
  grad.addColorStop(0, '#F7C86B');
  grad.addColorStop(1, '#E8964A');
  ctx.fillStyle = grad;
  ctx.font = '900 96px ' + FONT;
  ctx.fillText(grade, W / 2, 148);

  // 评级胶囊
  ctx.font = '700 14px ' + FONT;
  const pillW = ctx.measureText(rating).width + 36;
  ctx.fillStyle = '#FFF3D6';
  roundRectPath(ctx, W / 2 - pillW / 2, 170, pillW, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#C08A3E';
  ctx.fillText(rating, W / 2, 192);

  // 称号、评语、综合评分
  ctx.fillStyle = '#5A4A66';
  ctx.font = '800 21px ' + FONT;
  ctx.fillText('「' + title + '」', W / 2, 226);
  ctx.fillStyle = '#9B7BD8';
  ctx.font = '600 14.5px ' + FONT;
  ctx.fillText('💬 ' + comment, W / 2, 254);
  ctx.fillStyle = '#9A8AAB';
  ctx.font = '12.5px ' + FONT;
  ctx.fillText('综合评分 ' + avg.toFixed(1), W / 2, 278);

  // 属性徽章（4+4 两行）
  const badgeW = 122, badgeH = 28, gapX = 8, gapY = 8;
  const rowW = 4 * badgeW + 3 * gapX;
  const x0 = W / 2 - rowW / 2, y0 = 302;
  state.slots.forEach((s, i) => {
    const x = x0 + (i % 4) * (badgeW + gapX);
    const y = y0 + Math.floor(i / 4) * (badgeH + gapY);
    ctx.fillStyle = '#FFF9FD';
    roundRectPath(ctx, x, y, badgeW, badgeH, 14);
    ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#9A8AAB';
    ctx.font = '13px ' + FONT;
    ctx.fillText(s.attrName, x + 12, y + 18);
    ctx.textAlign = 'right';
    ctx.fillStyle = gradeColor(s.grade);
    ctx.font = '700 14px ' + FONT;
    ctx.fillText(s.grade, x + badgeW - 12, y + 18);
    ctx.textAlign = 'center';
  });

  // 分割线
  ctx.strokeStyle = '#F3D9E8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(28, 382);
  ctx.lineTo(W - 28, 382);
  ctx.stroke();

  // 明细 8 行
  ctx.textAlign = 'left';
  ctx.font = '12.5px ' + FONT;
  state.slots.forEach((s, i) => {
    const y = 410 + i * 24;
    ctx.fillStyle = '#9A8AAB';
    ctx.fillText(s.attrName, 28, y);
    ctx.fillText(s.memberName + ' · ' + s.groupName + '（' + s.generation + '代）', 84, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = gradeColor(s.grade);
    ctx.font = '700 13px ' + FONT;
    ctx.fillText(s.grade, W - 28, y);
    ctx.font = '12.5px ' + FONT;
    ctx.textAlign = 'left';
  });

  // 底部：带码版印网址 + 二维码；纯净版只留一行站名（供小红书规避站外导流审核）
  ctx.textAlign = 'center';
  if (withQr) {
    ctx.fillStyle = '#9A8AAB';
    ctx.font = '13px ' + FONT;
    ctx.fillText('长按识别二维码 · 测测你的专属偶像', W / 2, 590);
    ctx.font = '700 14px ' + FONT;
    ctx.fillStyle = '#5A4A66';
    ctx.fillText('h11an.github.io/kpop-wheel', W / 2, 610);
    if (qrImg) {
      ctx.drawImage(qrImg, (W - 88) / 2, 618, 88, 88);
    } else {
      // 二维码资源缺失时的兜底提示
      ctx.font = '12px ' + FONT;
      ctx.fillStyle = '#9A8AAB';
      ctx.fillText('（二维码加载失败）', W / 2, 700);
    }
  } else {
    ctx.fillStyle = '#9A8AAB';
    ctx.font = '13px ' + FONT;
    ctx.fillText('✨ Kpop偶像转盘 · 我的专属偶像生成器', W / 2, 610);
  }
}

// 等级 → 纯色（Canvas 无 CSS 渐变文字，用近似色）
function gradeColor(grade) {
  const map = {
    'S': '#E8964A', 'A+': '#FF5C9E', 'A': '#FF5C9E',
    'B+': '#9B7BD8', 'B': '#9B7BD8', 'C+': '#7E93AB', 'C': '#7E93AB', 'D': '#8A8A8A',
  };
  return map[grade] || '#5A4A66';
}

// 圆角矩形路径（兼容无 ctx.roundRect 的旧浏览器）
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ============================================================
   重开一局
   ============================================================ */
function resetGame() {
  overlay.classList.remove('show');
  overlay.hidden = true;
  state.slots = Array(8).fill(null);
  state.currentSlot = 0;
  state.step = 'attr';
  state.pickedAttr = null;
  state.pickedGroup = null;
  state.isSpinning = false;
  state.totalRotation = 0;
  state.finished = false;
  clearTimeout(state.endTimer);
  clearTimeout(state.resultTimer);
  clearTimeout(state.toastTimer);
  clearTimeout(state.shareMsgTimer);
  toastEl.classList.remove('show');
  toastEl.hidden = true;
  state.shared = false;
  try { history.replaceState(null, '', location.pathname); } catch (e) { /* file:// 下可能失败，忽略 */ }
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
