/* ============================================================
   Kpop偶像转盘 · 抖音特效核心逻辑（纯 JS，无环境依赖）
   ------------------------------------------------------------
   由 data.js 自动生成（28 团），改动数据请重新生成本文件。
   本文件可用 Node 直接运行自测：node 核心逻辑.js
   在 Effect House 中：把本文件的逻辑按「适配模板.ts」接入脚本。
   ============================================================ */
'use strict';

/* ---------- 数据层 ---------- */
const GROUPS = [{"name":"TWICE","members":[{"name":"娜琏","stats":{"dance":"A","vocal":"A+","rap":"B+","visual":"A","fanservice":"S","variety":"A","language":"B+","bond":"S"}},{"name":"定延","stats":{"dance":"B+","vocal":"A","rap":"B+","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"S"}},{"name":"Momo","stats":{"dance":"S","vocal":"B","rap":"C+","visual":"A","fanservice":"S","variety":"B+","language":"B","bond":"S"}},{"name":"Sana","stats":{"dance":"A+","vocal":"B+","rap":"C+","visual":"S","fanservice":"S","variety":"A+","language":"A+","bond":"S"}},{"name":"志效","stats":{"dance":"A","vocal":"S","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"S"}},{"name":"Mina","stats":{"dance":"A+","vocal":"B+","rap":"B","visual":"S","fanservice":"B+","variety":"B","language":"A","bond":"A+"}},{"name":"多贤","stats":{"dance":"B+","vocal":"B+","rap":"B+","visual":"A","fanservice":"S","variety":"S","language":"A","bond":"S"}},{"name":"彩瑛","stats":{"dance":"A","vocal":"B+","rap":"S","visual":"A","fanservice":"B+","variety":"B+","language":"A","bond":"A+"}},{"name":"子瑜","stats":{"dance":"A","vocal":"B+","rap":"C+","visual":"S","fanservice":"S","variety":"B","language":"A","bond":"A+"}}]},{"name":"Red Velvet","members":[{"name":"Irene","stats":{"dance":"A+","vocal":"B+","rap":"A","visual":"S","fanservice":"B+","variety":"B+","language":"B+","bond":"A"}},{"name":"涩琪","stats":{"dance":"S","vocal":"A+","rap":"B+","visual":"A","fanservice":"A","variety":"B+","language":"B+","bond":"A+"}},{"name":"Wendy","stats":{"dance":"A","vocal":"S","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"Joy","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"S","fanservice":"A+","variety":"A","language":"B+","bond":"A"}},{"name":"Yeri","stats":{"dance":"B+","vocal":"B+","rap":"A","visual":"A","fanservice":"A","variety":"A","language":"A","bond":"A"}}]},{"name":"SEVENTEEN","members":[{"name":"S.COUPS","stats":{"dance":"A","vocal":"B+","rap":"S","visual":"A","fanservice":"A+","variety":"B+","language":"B+","bond":"S"}},{"name":"净汉","stats":{"dance":"B+","vocal":"A","rap":"C+","visual":"S","fanservice":"S","variety":"A+","language":"B","bond":"A+"}},{"name":"Joshua","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"S","bond":"A+"}},{"name":"Jun","stats":{"dance":"A","vocal":"B+","rap":"C+","visual":"A","fanservice":"A","variety":"B+","language":"A+","bond":"A+"}},{"name":"Hoshi","stats":{"dance":"S","vocal":"A","rap":"B","visual":"A","fanservice":"S","variety":"S","language":"B","bond":"S"}},{"name":"圆佑","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"B+","language":"B+","bond":"A+"}},{"name":"Woozi","stats":{"dance":"A","vocal":"S","rap":"B+","visual":"A","fanservice":"A","variety":"B+","language":"B+","bond":"S"}},{"name":"DK","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"S"}},{"name":"珉奎","stats":{"dance":"A","vocal":"B+","rap":"B+","visual":"S","fanservice":"A+","variety":"A+","language":"B+","bond":"A+"}},{"name":"THE 8","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"S","bond":"A+"}},{"name":"胜宽","stats":{"dance":"B+","vocal":"A+","rap":"B","visual":"B+","fanservice":"S","variety":"S","language":"B+","bond":"A+"}},{"name":"Vernon","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"B+","variety":"B+","language":"S","bond":"A+"}},{"name":"Dino","stats":{"dance":"S","vocal":"B+","rap":"B+","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}}]},{"name":"NCT 127","members":[{"name":"泰容","stats":{"dance":"S","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"S"}},{"name":"Johnny","stats":{"dance":"B+","vocal":"B+","rap":"A","visual":"A","fanservice":"A","variety":"A","language":"S","bond":"A"}},{"name":"悠太","stats":{"dance":"A","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"S","bond":"A"}},{"name":"道英","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A+","language":"B+","bond":"A+"}},{"name":"在玹","stats":{"dance":"B+","vocal":"A+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"A","bond":"A"}},{"name":"廷祐","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"A+","language":"B+","bond":"A"}},{"name":"Mark","stats":{"dance":"A+","vocal":"B+","rap":"S","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"楷灿","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B+","bond":"A+"}}]},{"name":"BTS","members":[{"name":"RM","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"A","language":"S","bond":"S"}},{"name":"Jin","stats":{"dance":"B+","vocal":"A+","rap":"C+","visual":"S","fanservice":"A+","variety":"S","language":"B","bond":"S"}},{"name":"SUGA","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"S"}},{"name":"J-Hope","stats":{"dance":"S","vocal":"B+","rap":"A+","visual":"A","fanservice":"A+","variety":"A+","language":"B","bond":"S"}},{"name":"Jimin","stats":{"dance":"S","vocal":"A+","rap":"C+","visual":"S","fanservice":"S","variety":"A","language":"B+","bond":"S"}},{"name":"V","stats":{"dance":"A","vocal":"A","rap":"B","visual":"S","fanservice":"S","variety":"A","language":"B","bond":"S"}},{"name":"柾国","stats":{"dance":"A+","vocal":"S","rap":"A","visual":"S","fanservice":"S","variety":"A","language":"A","bond":"S"}}]},{"name":"Stray Kids","members":[{"name":"方灿","stats":{"dance":"A","vocal":"A+","rap":"A+","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"S"}},{"name":"Lee Know","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"A+"}},{"name":"彰彬","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"B+","fanservice":"A","variety":"A+","language":"B","bond":"A+"}},{"name":"铉辰","stats":{"dance":"S","vocal":"B+","rap":"A","visual":"S","fanservice":"A+","variety":"B+","language":"B","bond":"A"}},{"name":"HAN","stats":{"dance":"A","vocal":"A+","rap":"S","visual":"A","fanservice":"A","variety":"S","language":"B+","bond":"A+"}},{"name":"Felix","stats":{"dance":"A+","vocal":"B","rap":"A","visual":"S","fanservice":"S","variety":"B+","language":"S","bond":"A+"}},{"name":"昇玟","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"I.N","stats":{"dance":"B+","vocal":"A","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}}]},{"name":"TXT","members":[{"name":"秀彬","stats":{"dance":"A","vocal":"A","rap":"B","visual":"S","fanservice":"S","variety":"A","language":"B","bond":"S"}},{"name":"然竣","stats":{"dance":"S","vocal":"A","rap":"A","visual":"A","fanservice":"A+","variety":"A+","language":"B","bond":"A+"}},{"name":"杋圭","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B","bond":"A+"}},{"name":"太显","stats":{"dance":"A","vocal":"A+","rap":"B+","visual":"A","fanservice":"A","variety":"A","language":"A","bond":"A+"}},{"name":"休宁凯","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}}]},{"name":"(G)I-DLE","members":[{"name":"美延","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"S","fanservice":"A+","variety":"A","language":"B","bond":"A+"}},{"name":"Minnie","stats":{"dance":"B+","vocal":"S","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"小娟","stats":{"dance":"A","vocal":"A+","rap":"S","visual":"A","fanservice":"A","variety":"A+","language":"A","bond":"S"}},{"name":"雨琦","stats":{"dance":"A","vocal":"A","rap":"A","visual":"A","fanservice":"A+","variety":"S","language":"S","bond":"A+"}},{"name":"舒华","stats":{"dance":"B+","vocal":"B","rap":"B","visual":"S","fanservice":"A","variety":"A","language":"A","bond":"A+"}}]},{"name":"ITZY","members":[{"name":"礼志","stats":{"dance":"S","vocal":"A","rap":"B+","visual":"A","fanservice":"A+","variety":"B+","language":"B","bond":"A"}},{"name":"Lia","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"留真","stats":{"dance":"S","vocal":"B+","rap":"A","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"彩领","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}},{"name":"有娜","stats":{"dance":"A+","vocal":"B+","rap":"B+","visual":"S","fanservice":"S","variety":"A+","language":"B","bond":"A+"}}]},{"name":"ENHYPEN","members":[{"name":"羲承","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"Jay","stats":{"dance":"A+","vocal":"A","rap":"B+","visual":"A","fanservice":"A","variety":"A+","language":"A","bond":"A"}},{"name":"Jake","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A"}},{"name":"成训","stats":{"dance":"A+","vocal":"B+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"善禹","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"A"}},{"name":"祯元","stats":{"dance":"A+","vocal":"A","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A"}},{"name":"NI-KI","stats":{"dance":"S","vocal":"B","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A"}}]},{"name":"aespa","members":[{"name":"Karina","stats":{"dance":"A+","vocal":"A","rap":"A","visual":"S","fanservice":"A+","variety":"A","language":"B","bond":"A"}},{"name":"Giselle","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"A+","language":"S","bond":"A+"}},{"name":"Winter","stats":{"dance":"A+","vocal":"S","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"宁宁","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A+","language":"S","bond":"A+"}}]},{"name":"IVE","members":[{"name":"宥真","stats":{"dance":"A","vocal":"A","rap":"B+","visual":"A","fanservice":"A+","variety":"S","language":"B","bond":"A"}},{"name":"秋天","stats":{"dance":"A+","vocal":"B+","rap":"A","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"Rei","stats":{"dance":"B+","vocal":"B+","rap":"A","visual":"A","fanservice":"A+","variety":"A+","language":"S","bond":"A+"}},{"name":"元英","stats":{"dance":"A","vocal":"B+","rap":"C+","visual":"S","fanservice":"S","variety":"A+","language":"A","bond":"A"}},{"name":"Liz","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"B","bond":"A+"}},{"name":"李瑞","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}}]},{"name":"LE SSERAFIM","members":[{"name":"采源","stats":{"dance":"A+","vocal":"A+","rap":"B","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A"}},{"name":"Sakura","stats":{"dance":"A","vocal":"B+","rap":"B","visual":"S","fanservice":"S","variety":"A+","language":"S","bond":"A+"}},{"name":"允真","stats":{"dance":"B+","vocal":"S","rap":"B+","visual":"A","fanservice":"A","variety":"A+","language":"S","bond":"A"}},{"name":"Kazuha","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"A","bond":"A"}},{"name":"恩彩","stats":{"dance":"A","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B","bond":"A+"}}]},{"name":"NewJeans","members":[{"name":"Minji","stats":{"dance":"A","vocal":"A","rap":"B+","visual":"S","fanservice":"A+","variety":"A","language":"B","bond":"A"}},{"name":"Hanni","stats":{"dance":"A+","vocal":"A+","rap":"B","visual":"A","fanservice":"S","variety":"A","language":"S","bond":"A+"}},{"name":"Danielle","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"S","variety":"A","language":"S","bond":"A+"}},{"name":"Haerin","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"Hyein","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}}]},{"name":"NMIXX","members":[{"name":"Lily","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"海嫄","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B","bond":"A"}},{"name":"Sullyoon","stats":{"dance":"A","vocal":"A+","rap":"B+","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"BAE","stats":{"dance":"A","vocal":"A+","rap":"B+","visual":"A","fanservice":"A+","variety":"A+","language":"B","bond":"A"}},{"name":"智羽","stats":{"dance":"A+","vocal":"A","rap":"A","visual":"A","fanservice":"A","variety":"A+","language":"B","bond":"A"}},{"name":"Kyujin","stats":{"dance":"S","vocal":"A","rap":"B+","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}}]},{"name":"ZEROBASEONE","members":[{"name":"成韩彬","stats":{"dance":"S","vocal":"A+","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A"}},{"name":"金地雄","stats":{"dance":"B+","vocal":"B+","rap":"B+","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A"}},{"name":"章昊","stats":{"dance":"A","vocal":"S","rap":"B+","visual":"A","fanservice":"A+","variety":"A+","language":"S","bond":"A+"}},{"name":"石马修","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A"}},{"name":"金太来","stats":{"dance":"B+","vocal":"A+","rap":"B","visual":"B+","fanservice":"A","variety":"A+","language":"B","bond":"A"}},{"name":"Ricky","stats":{"dance":"B+","vocal":"B+","rap":"B+","visual":"S","fanservice":"A","variety":"B+","language":"A","bond":"A"}},{"name":"金奎彬","stats":{"dance":"B+","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"A+","language":"B","bond":"A"}},{"name":"朴乾煜","stats":{"dance":"A","vocal":"A","rap":"A","visual":"A","fanservice":"A","variety":"A+","language":"B","bond":"A"}},{"name":"韩维辰","stats":{"dance":"A+","vocal":"B+","rap":"B","visual":"S","fanservice":"A+","variety":"B+","language":"B","bond":"A"}}]},{"name":"BABYMONSTER","members":[{"name":"Ruka","stats":{"dance":"S","vocal":"B+","rap":"A+","visual":"A","fanservice":"A","variety":"A","language":"A","bond":"A+"}},{"name":"Pharita","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"S","fanservice":"A+","variety":"B+","language":"S","bond":"A+"}},{"name":"Asa","stats":{"dance":"A+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"B+","language":"S","bond":"A+"}},{"name":"Ahyeon","stats":{"dance":"A+","vocal":"S","rap":"A","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"Rami","stats":{"dance":"A+","vocal":"S","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"Rora","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"B","bond":"A+"}},{"name":"Chiquita","stats":{"dance":"S","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}}]},{"name":"KISS OF LIFE","members":[{"name":"Julie","stats":{"dance":"A+","vocal":"B+","rap":"S","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A"}},{"name":"Natty","stats":{"dance":"S","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"Belle","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}},{"name":"Haneul","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A"}}]},{"name":"BLACKPINK","members":[{"name":"智秀","stats":{"dance":"B+","vocal":"A","rap":"C+","visual":"S","fanservice":"A+","variety":"A+","language":"B","bond":"S"}},{"name":"Jennie","stats":{"dance":"A+","vocal":"A+","rap":"S","visual":"S","fanservice":"A","variety":"A","language":"S","bond":"A+"}},{"name":"Rosé","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"S","bond":"A+"}},{"name":"Lisa","stats":{"dance":"S","vocal":"B+","rap":"S","visual":"S","fanservice":"A+","variety":"A+","language":"S","bond":"A+"}}]},{"name":"EXO","members":[{"name":"秀珉","stats":{"dance":"A","vocal":"A","rap":"C+","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"SUHO","stats":{"dance":"B+","vocal":"A","rap":"C+","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"S"}},{"name":"伯贤","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"A+"}},{"name":"CHEN","stats":{"dance":"B+","vocal":"S","rap":"C+","visual":"B+","fanservice":"A","variety":"A","language":"A","bond":"A+"}},{"name":"灿烈","stats":{"dance":"B+","vocal":"A","rap":"A+","visual":"S","fanservice":"A+","variety":"A+","language":"A","bond":"A+"}},{"name":"D.O.","stats":{"dance":"B+","vocal":"S","rap":"C+","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"Kai","stats":{"dance":"S","vocal":"B+","rap":"C+","visual":"S","fanservice":"A+","variety":"A","language":"B","bond":"A+"}},{"name":"世勋","stats":{"dance":"A","vocal":"B+","rap":"A","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A+"}}]},{"name":"NCT DREAM","members":[{"name":"Mark","stats":{"dance":"A+","vocal":"B+","rap":"S","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"仁俊","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A","variety":"A+","language":"S","bond":"A+"}},{"name":"Jeno","stats":{"dance":"A+","vocal":"B+","rap":"A","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"楷灿","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B+","bond":"A+"}},{"name":"渽民","stats":{"dance":"B+","vocal":"B+","rap":"A","visual":"S","fanservice":"A+","variety":"B+","language":"B","bond":"A+"}},{"name":"辰乐","stats":{"dance":"B+","vocal":"S","rap":"C+","visual":"A","fanservice":"A+","variety":"A+","language":"S","bond":"A+"}},{"name":"志晟","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}}]},{"name":"ATEEZ","members":[{"name":"弘中","stats":{"dance":"A","vocal":"A","rap":"S","visual":"A","fanservice":"A+","variety":"A+","language":"B+","bond":"S"}},{"name":"星和","stats":{"dance":"A","vocal":"A","rap":"B","visual":"S","fanservice":"A+","variety":"A","language":"B","bond":"A+"}},{"name":"润浩","stats":{"dance":"S","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A+","language":"B","bond":"A+"}},{"name":"吕尚","stats":{"dance":"A","vocal":"B+","rap":"B","visual":"S","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"伞","stats":{"dance":"S","vocal":"A","rap":"B","visual":"A","fanservice":"S","variety":"A","language":"B","bond":"A+"}},{"name":"旼琦","stats":{"dance":"A+","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"友荣","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"A+"}},{"name":"钟浩","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}}]},{"name":"RIIZE","members":[{"name":"将太郎","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"恩石","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B+","bond":"A+"}},{"name":"成灿","stats":{"dance":"A","vocal":"B+","rap":"A","visual":"S","fanservice":"A+","variety":"A+","language":"B+","bond":"A+"}},{"name":"元彬","stats":{"dance":"A","vocal":"B+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"昭熙","stats":{"dance":"A","vocal":"S","rap":"C+","visual":"A","fanservice":"A+","variety":"A","language":"B+","bond":"A+"}},{"name":"Anton","stats":{"dance":"B+","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"S","bond":"A+"}}]},{"name":"TREASURE","members":[{"name":"崔玹硕","stats":{"dance":"A","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"A+","language":"B","bond":"S"}},{"name":"志焄","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"S","language":"B","bond":"S"}},{"name":"Yoshi","stats":{"dance":"A","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}},{"name":"俊奎","stats":{"dance":"B+","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A+","language":"B+","bond":"A+"}},{"name":"尹材赫","stats":{"dance":"B+","vocal":"B+","rap":"B","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"Asahi","stats":{"dance":"B+","vocal":"A","rap":"A","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}},{"name":"道荣","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}},{"name":"Haruto","stats":{"dance":"A","vocal":"B+","rap":"S","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}},{"name":"朴炡禹","stats":{"dance":"B+","vocal":"S","rap":"C+","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"苏庭焕","stats":{"dance":"A+","vocal":"B+","rap":"C+","visual":"A","fanservice":"A+","variety":"A","language":"B","bond":"A+"}}]},{"name":"ILLIT","members":[{"name":"玧我","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"A+","language":"B+","bond":"A+"}},{"name":"慜柱","stats":{"dance":"B+","vocal":"A+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"Moka","stats":{"dance":"A+","vocal":"B+","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"A","bond":"A+"}},{"name":"沅禧","stats":{"dance":"B+","vocal":"A","rap":"C+","visual":"A","fanservice":"S","variety":"A+","language":"B","bond":"A+"}},{"name":"Iroha","stats":{"dance":"S","vocal":"B+","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}}]},{"name":"KiiiKiii","members":[{"name":"智旴","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"利率","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"B","bond":"A+"}},{"name":"秀伊","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"荷芸","stats":{"dance":"A+","vocal":"A","rap":"A","visual":"A","fanservice":"A","variety":"A","language":"B","bond":"A+"}},{"name":"Kya","stats":{"dance":"A","vocal":"B+","rap":"A+","visual":"A","fanservice":"A","variety":"A+","language":"A","bond":"A+"}}]},{"name":"Hearts2Hearts","members":[{"name":"Carmen","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"S","bond":"A+"}},{"name":"志祐","stats":{"dance":"A+","vocal":"A+","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"B","bond":"A+"}},{"name":"柔河","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"A","bond":"A+"}},{"name":"Stella","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"S","fanservice":"A","variety":"B+","language":"S","bond":"A+"}},{"name":"主娫","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"A-na","stats":{"dance":"A+","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"S","bond":"A+"}},{"name":"Ian","stats":{"dance":"A","vocal":"A+","rap":"B","visual":"A","fanservice":"A","variety":"A","language":"A","bond":"A+"}},{"name":"誉温","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}}]},{"name":"FIFTY FIFTY","members":[{"name":"Keena","stats":{"dance":"B+","vocal":"B+","rap":"S","visual":"A","fanservice":"A+","variety":"A","language":"A","bond":"A+"}},{"name":"Chanelle","stats":{"dance":"A","vocal":"S","rap":"B","visual":"A","fanservice":"A+","variety":"A","language":"S","bond":"A+"}},{"name":"艺源","stats":{"dance":"A","vocal":"A","rap":"C+","visual":"A","fanservice":"A","variety":"A","language":"A","bond":"A+"}},{"name":"荷娜","stats":{"dance":"A+","vocal":"B+","rap":"B","visual":"A","fanservice":"A","variety":"B+","language":"A","bond":"A+"}},{"name":"Athena","stats":{"dance":"A","vocal":"A","rap":"B","visual":"A","fanservice":"A+","variety":"B+","language":"S","bond":"A+"}}]}];
const ATTRS = [{"id":"dance","name":"舞蹈"},{"id":"vocal","name":"唱功"},{"id":"rap","name":"说唱"},{"id":"visual","name":"颜值"},{"id":"fanservice","name":"饭撒"},{"id":"variety","name":"综艺感"},{"id":"language","name":"外语"},{"id":"bond","name":"队内关系"}];
const ATTR_TITLES = {"dance":"主舞级配置","vocal":"大主唱血脉","rap":"Rap 之光","visual":"门面级颜值","fanservice":"饭撒天使","variety":"综艺担当","language":"语言天才","bond":"团魂担当"};

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
    history: [],         // 已抽出的「属性+等级」记分牌（顶部横排累计显示）
  };
  const RESULT_HOLD_MS = 4000; // 结果展示时长，之后可再次触发
  const HISTORY_MAX = 8; // 记分牌最多保留 8 条，超出丢最旧的（保证一行放得下）

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
    state.history.push({ attr: state.result.attr, grade: state.result.grade });
    if (state.history.length > HISTORY_MAX) state.history.shift();
    return state.result;
  }

  // 顶部记分牌文案：「舞蹈 S　唱功 A+　…」（适配层显示在 textHistory 上）
  function getHistoryText() {
    return state.history.map(h => h.attr + ' ' + h.grade).join('　');
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
    state.history = [];
  }

  return { SEG, trigger, onLanded, tick, rotationDeg, getHistoryText, reset, get state() { return state; } };
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
    const ht = WHEEL_LOGIC.getHistoryText();
    check(ht.indexOf(r.attr + ' ' + r.grade) > -1, '记分牌含本次结果');
    check(WHEEL_LOGIC.state.history.length <= 8, '记分牌最多 8 条');
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
