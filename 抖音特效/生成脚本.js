/* 从 data.js 生成抖音特效核心逻辑文件（纯 JS，无环境依赖） */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const DIR = '/Users/donaldhan/Downloads/Claude code/kpop转盘';
const OUT = path.join(DIR, '抖音特效', '核心逻辑.js');
const dataCode = fs.readFileSync(path.join(DIR, 'data.js'), 'utf8');
const { GROUPS, ATTRS, ATTR_TITLES } = vm.runInNewContext(dataCode + '\n;({ GROUPS, ATTRS, ATTR_TITLES })', {});

const groups = GROUPS.map(g => ({
  name: g.name,
  members: g.members.map(m => ({ name: m.name, stats: m.stats })),
}));
const attrs = ATTRS.map(a => ({ id: a.id, name: a.name }));

const content = `/* ============================================================
   Kpop偶像转盘 · 抖音特效核心逻辑（纯 JS，无环境依赖）
   ------------------------------------------------------------
   由 data.js 自动生成（28 团），改动数据请重新生成本文件。
   本文件可用 Node 直接运行自测：node 核心逻辑.js
   在 Effect House 中：把本文件的逻辑按「适配模板.ts」接入脚本。
   ============================================================ */
'use strict';

/* ---------- 数据层 ---------- */
const GROUPS = ${JSON.stringify(groups, null, 0)};
const ATTRS = ${JSON.stringify(attrs)};
const ATTR_TITLES = ${JSON.stringify(ATTR_TITLES)};

/* ---------- 纯逻辑层 ---------- */
const WHEEL_LOGIC = (() => {
  const SEG = 360 / GROUPS.length;
  const SPIN_MS = 4200; // 与网页版一致的旋转时长（适配层按缓动曲线插值）
  const state = {
    phase: 'idle',       // idle | spinning | result
    wheelDeg: 0,         // 转盘当前累计角度（度）
    targetDeg: 0,        // 本次旋转目标角度
    result: null,        // { group, member, attr, grade, title }
    cooldownMs: 0,       // 结果展示停留计时
  };
  const RESULT_HOLD_MS = 4000; // 结果展示时长，之后可再次触发

  // 指针在转盘顶部；本地角 p ≡ (360 − θ)，扇区 i 以 i×seg 为中心（与网页版同约定）
  function sectorAt(theta) {
    const p = (((360 - theta) % 360) + 360) % 360;
    return Math.floor(((p + SEG / 2) % 360) / SEG);
  }

  // 触发一次抽卡：返回 { deltaDeg } 供适配层做旋转动画，或 null（当前不可触发）
  function trigger() {
    if (state.phase === 'spinning') return null;
    const idx = Math.floor(Math.random() * GROUPS.length);
    const pTarget = (((idx * SEG) + (Math.random() * 0.7 - 0.35) * SEG) % 360 + 360) % 360;
    const thetaTarget = (360 - pTarget) % 360;
    const thetaNow = state.wheelDeg % 360;
    let delta = ((thetaTarget - thetaNow) % 360 + 360) % 360;
    delta += 360 * (5 + Math.floor(Math.random() * 3)); // 5~7 整圈

    const groupIdx = sectorAt(state.wheelDeg + delta);
    const group = GROUPS[groupIdx];
    const member = group.members[Math.floor(Math.random() * group.members.length)];
    const attr = ATTRS[Math.floor(Math.random() * ATTRS.length)];

    state.phase = 'spinning';
    state.targetDeg = state.wheelDeg + delta;
    state.result = {
      group: group.name,
      member: member.name,
      attr: attr.name,
      grade: member.stats[attr.id],
      title: ATTR_TITLES[attr.id],
    };
    return { deltaDeg: delta, durationMs: SPIN_MS };
  }

  // 旋转结束：进入结果展示期，返回卡片文案（适配层逐行显示）
  function onLanded() {
    if (state.phase !== 'spinning') return null;
    state.wheelDeg = state.targetDeg;
    state.phase = 'result';
    state.cooldownMs = RESULT_HOLD_MS;
    return state.result;
  }

  // 每帧推进（deltaMs 为距上一帧毫秒数）；结果展示结束自动回到 idle
  function tick(deltaMs) {
    if (state.phase === 'result') {
      state.cooldownMs -= deltaMs;
      if (state.cooldownMs <= 0) state.phase = 'idle';
    }
    return state.phase;
  }

  // 旋转进度插值（0~1）：适配层按此进度与缓动曲线设置转盘贴纸旋转角
  function rotationDeg(progress) {
    const eased = easeOutCubicBezier(progress);
    return state.wheelDeg + (state.targetDeg - state.wheelDeg) * eased;
  }
  // 网页版手感曲线 cubic-bezier(0.17, 0.67, 0.12, 0.99) 的数值实现
  function easeOutCubicBezier(t) {
    const x1 = 0.17, x2 = 0.12, y1 = 0.67, y2 = 0.99;
    let lo = 0, hi = 1, u = 0;
    for (let i = 0; i < 20; i++) {
      u = (lo + hi) / 2;
      const x = bez(x1, x2, u);
      if (x < t) lo = u; else hi = u;
    }
    return bez(y1, y2, u);
    function bez(c1, c2, v) {
      const w = 1 - v;
      return 3 * w * w * v * c1 + 3 * w * v * v * c2 + v * v * v;
    }
  }

  function reset() {
    state.phase = 'idle';
    state.wheelDeg = 0;
    state.targetDeg = 0;
    state.result = null;
    state.cooldownMs = 0;
  }

  return { SEG, trigger, onLanded, tick, rotationDeg, reset, get state() { return state; } };
})();

/* ---------- 自测（node 核心逻辑.js） ---------- */
if (typeof module !== 'undefined' && require.main === module) {
  let ok = 0, fail = 0;
  function check(cond, msg) {
    if (cond) { ok++; } else { fail++; console.log('✗ ' + msg); }
  }
  check(GROUPS.length === 28, '28 团');
  check(GROUPS.every(g => g.members.length > 0), '每团有成员');
  check(WHEEL_LOGIC.SEG === 360 / 28, '扇区角正确');
  // 模拟 200 次抽卡：落点始终有效、文案齐全、状态机流转正确
  for (let i = 0; i < 200; i++) {
    const t = WHEEL_LOGIC.trigger();
    check(!!t && t.deltaDeg >= 360 * 5, '触发返回旋转量');
    WHEEL_LOGIC.tick(100);
    const r = WHEEL_LOGIC.onLanded();
    check(!!r && r.group && r.member && r.attr && r.grade && r.title, '结果文案齐全');
    check(['S','A+','A','B+','B','C+','C'].includes(r.grade), '等级合法');
    check(r.title.length > 0, '称号非空');
    // 插值进度单调且 0~1
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.1) {
      const v = WHEEL_LOGIC.rotationDeg(Math.min(p, 1));
      check(!(v < prev - 0.001), '插值不倒退');
      prev = v;
    }
    WHEEL_LOGIC.tick(5000);
    check(WHEEL_LOGIC.state.phase === 'idle', '展示结束回到 idle');
    WHEEL_LOGIC.reset();
  }
  console.log(ok + ' passed, ' + fail + ' failed');
  process.exit(fail > 0 ? 1 : 0);
}

module.exports = { WHEEL_LOGIC, GROUPS, ATTRS };
`;

fs.writeFileSync(OUT, content);
console.log('已生成：', OUT);

/* ---------- 特效脚本完整版.ts（核心逻辑内联 + APJS 适配层） ---------- */
const coreBody = content
  .replace(/^\/\* ============================================================[\s\S]*?\*\/\n'use strict';\n\n/, '')
  .replace(/\n\/\* ---------- 自测（node 核心逻辑\.js） ---------- \*\/[\s\S]*$/, '');
const tsContent = `/* ============================================================
   Kpop偶像转盘 · 特效脚本完整版（Effect House · APJS 模板）
   ------------------------------------------------------------
   用法（详见 docs/抖音特效指南.md）：
   1. 在 Effect House 新建 Script 组件，把本文件【整个内容】
      替换掉编辑器自动生成的模板内容
   2. 若编辑器模板的第一行 import 与本文件不同：
      保留编辑器模板的 import 行，删掉本文件的 import 行
   3. 在 Inspector 面板把四个 Text 组件与转盘图组件拖到 @input 槽位
   4. 点击屏幕触发：参考指南「接线：点击触发」一节
   ============================================================ */
// ↓↓↓ 以编辑器自带模板的 import 行为准（不同版本路径不同）
import * as APJS from 'APJS';

@component()
export class KpopWheelScript extends APJS.BasicScriptComponent {
  @input() wheelImage!: APJS.SceneObject;
  @input() textGroup!: APJS.TextComponent;
  @input() textMember!: APJS.TextComponent;
  @input() textAttr!: APJS.TextComponent;
  @input() textTitle!: APJS.TextComponent;

  private phase: 'idle' | 'spinning' | 'result' = 'idle';
  private spinElapsedMs = 0;
  private spinDeltaDeg = 0;
  private spinDurationMs = 4200;
  // 全自动循环：true = 无操作自动抽卡（无需接线，预览即可看效果）；
  // 想改为「点击屏幕才抽卡」时置 false 并按指南接线手势后调用 doSpin()
  private autoSpin = true;

  onStart() {
    this.setTexts('', '', '', '');
  }

  // 触发抽卡（点击屏幕/点头时调用本方法）
  doSpin() {
    if (this.phase === 'spinning' || this.phase === 'result') return;
    const t = WHEEL_LOGIC.trigger();
    if (!t) return;
    this.phase = 'spinning';
    this.spinElapsedMs = 0;
    this.spinDeltaDeg = t.deltaDeg;
    this.spinDurationMs = t.durationMs;
    this.setTexts('', '', '', '');
  }

  onUpdate(deltaTime: number) {
    const dtMs = deltaTime * 1000;
    WHEEL_LOGIC.tick(dtMs);
    if (this.autoSpin && this.phase === 'idle') this.doSpin();
    if (this.phase === 'spinning') {
      this.spinElapsedMs += dtMs;
      const p = Math.min(1, this.spinElapsedMs / this.spinDurationMs);
      // 旋转转盘贴纸：以编辑器 ScreenTransform 的旋转 API 为准
      this.wheelImage.screenTransform.rotation = WHEEL_LOGIC.rotationDeg(p);
      if (p >= 1) {
        const r = WHEEL_LOGIC.onLanded();
        this.phase = 'result';
        if (r) {
          this.setTexts(
            '🎯 ' + r.group,
            '⭐ ' + r.member,
            r.attr + '　' + r.grade,
            '「' + r.title + '」'
          );
        }
      }
    } else if (this.phase === 'result' && WHEEL_LOGIC.state.phase === 'idle') {
      this.phase = 'idle'; // 展示结束，可再次触发
    }
  }

  private setTexts(g: string, m: string, a: string, t: string) {
    if (this.textGroup) this.textGroup.text = g;
    if (this.textMember) this.textMember.text = m;
    if (this.textAttr) this.textAttr.text = a;
    if (this.textTitle) this.textTitle.text = t;
  }
}

/* ==================== 核心逻辑（纯 JS，勿改） ==================== */
${coreBody}
`;

const TSOUT = path.join(DIR, '抖音特效', '特效脚本完整版.ts');
fs.writeFileSync(TSOUT, tsContent);
console.log('已生成：', TSOUT);

