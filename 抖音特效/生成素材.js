/* 抖音特效素材生成器 v2：node-canvas 程序化绘制（透明底、逐字竖排）
   用法：先 npm install canvas（开发机一次性安装），再 node 生成素材.js
   文字阅读方向：从外圈往圆心（与网页版转盘一致） */
'use strict';
let createCanvas;
try {
  ({ createCanvas } = require('canvas'));
} catch (e) {
  console.error('缺少 canvas 依赖：请先运行  npm install canvas  再重试');
  process.exit(1);
}
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const DIR = '/Users/donaldhan/Downloads/Claude code/kpop转盘';
const OUT = path.join(DIR, '抖音特效', '素材');
const dataCode = fs.readFileSync(path.join(DIR, 'data.js'), 'utf8');
const { GROUPS, WHEEL_PALETTE } = vm.runInNewContext(dataCode + '\n;({ GROUPS, WHEEL_PALETTE })', {});
const FONT = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const n = GROUPS.length;
const seg = 360 / n;

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

/* ---------- 转盘（1024，含文字） ---------- */
function drawWheel(size, withLabels) {
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');
  const cx = size / 2, cy = size / 2, R = size / 2 - 8;
  for (let i = 0; i < n; i++) {
    const a0 = (-90 + i * seg) * Math.PI / 180;
    const a1 = (-90 + (i + 1) * seg) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, a0, a1);
    ctx.closePath();
    const [r, g, b] = hexToRgb(WHEEL_PALETTE[i % WHEEL_PALETTE.length]);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  if (withLabels) {
    const Rm = size * 0.34;
    const fs = Math.floor(2 * (R - Rm) / 1.15 / 13); // 按最长团名(13 字符)自适应字号
    const step = fs * 1.15;
    ctx.fillStyle = '#5A4A66';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 ' + fs + 'px ' + FONT;
    for (let i = 0; i < n; i++) {
      const mid = (-90 + (i + 0.5) * seg) * Math.PI / 180;
      const px = cx + Rm * Math.cos(mid), py = cy + Rm * Math.sin(mid);
      const phi = (i + 0.5) * seg; // 与网页版 CSS rotate 相同的屏幕旋转角（从 12 点顺时针）
      const name = GROUPS[i].name;
      // 与网页版一致：文字列沿扇区轴线、字形随扇区角度旋转（钟表式排布），k=0 在最外侧
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(phi * Math.PI / 180);
      for (let k = 0; k < name.length; k++) {
        const yk = -((name.length - 1) / 2 - k) * step;
        ctx.fillText(name[k], 0, yk);
      }
      ctx.restore();
    }
  }
  return c;
}

/* ---------- 指针（透明底） ---------- */
function drawPointer() {
  const c = createCanvas(160, 200);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#F5C56B';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(80, 16);
  ctx.lineTo(132, 150);
  ctx.lineTo(28, 150);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(80, 172, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  return c;
}

/* ---------- 中心 hub（透明底） ---------- */
function drawHub() {
  const c = createCanvas(200, 200);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 200, 200);
  g.addColorStop(0, '#FF9EC4');
  g.addColorStop(1, '#C9B6FF');
  ctx.fillStyle = g;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(100, 100, 84, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#F5C56B';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '70px ' + FONT;
  ctx.fillText('★', 100, 108);
  return c;
}

/* ---------- 偶像卡底版（透明底，文字由特效动态显示） ---------- */
function drawCard() {
  const c = createCanvas(720, 960);
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,0.94)';
  ctx.strokeStyle = '#FFD9EC';
  ctx.lineWidth = 8;
  roundRect(ctx, 14, 14, 692, 932, 56);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,247,251,0.6)';
  ctx.beginPath();
  ctx.arc(360, 480, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F5C56B';
  ctx.font = '36px ' + FONT;
  ctx.textAlign = 'left';
  ctx.fillText('✦', 56, 84);
  ctx.textAlign = 'right';
  ctx.fillText('✦', 664, 84);
  ctx.textAlign = 'left';
  ctx.fillText('✧', 56, 900);
  ctx.textAlign = 'right';
  ctx.fillText('✧', 664, 900);
  return c;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function save(c, name) {
  fs.writeFileSync(path.join(OUT, name), c.toBuffer('image/png'));
}

save(drawWheel(1024, true), '转盘.png');
save(drawPointer(), '指针.png');
save(drawHub(), 'hub.png');
save(drawCard(), '偶像卡底版.png');
save(drawWheel(512, false), '图标.png');
console.log('生成完毕（node-canvas）:', fs.readdirSync(OUT).filter(f => f.endsWith('.png')).join(', '));
