/* ============================================================
   我的专属偶像生成器 · 数据文件
   ------------------------------------------------------------
   ★ 使用说明：本文件必须和 index.html / style.css / app.js
     放在同一个文件夹里，然后双击 index.html 即可开始游戏。
   ★ 想加新组合？在下方 GROUPS 数组里照着已有格式追加即可。
   ★ 等级说明：S > A+ > A > B+ > B > C+ > C > D
     评分为娱乐向，基于大众认知生成，请勿较真~
   ============================================================ */

// 等级 → 数值映射（用于计算综合评分）
const GRADE_VALUES = {
  'S': 100, 'A+': 95, 'A': 90, 'B+': 85, 'B': 80, 'C+': 75, 'C': 70, 'D': 60,
};

// 8 项属性
const ATTRS = [
  { id: 'dance',      name: '舞蹈' },
  { id: 'vocal',      name: '唱功' },
  { id: 'rap',        name: '说唱' },
  { id: 'visual',     name: '颜值' },
  { id: 'fanservice', name: '饭撒' },
  { id: 'variety',    name: '综艺感' },
  { id: 'language',   name: '外语' },
  { id: 'bond',       name: '队内关系' },
];

// 最高属性对应的趣味称号
const ATTR_TITLES = {
  dance: '主舞级配置', vocal: '大主唱血脉', rap: 'Rap 之光', visual: '门面级颜值',
  fanservice: '饭撒天使', variety: '综艺担当', language: '语言天才', bond: '团魂担当',
};

// 出道评级表：[最低平均分, 评级名]
const RATING_TABLE = [
  [96, '传奇级出道'], [92, '顶配出道'], [88, '高位出道'], [84, '顺滑出道'],
  [80, '顺利出道'], [76, '逆袭出道'], [72, '养成系出道'], [0, '热血出道'],
];

// 结果小评语：按出道评级分层，每层随机取一条
const RESULT_COMMENTS = {
  '传奇级出道': [
    '出道即传奇，公司股价靠你撑',
    '这不是偶像，这是行业标准答案',
    'S 级浓度超标，建议直接登基',
    '出道舞台还没演完，音源榜已经爆了',
  ],
  '顶配出道': [
    '顶配天花板，黑粉都找不到角度',
    '专辑预售开启三分钟就售罄',
    '主打个全能，连呼吸都吸粉',
  ],
  '高位出道': [
    '高位出道的快乐就是这么朴实无华',
    '出道位稳得就像钉在地板上',
    '路人看完打歌舞台直接入坑',
  ],
  '顺滑出道': [
    '出道之路顺滑得像冰面漂移',
    '零失误出道舞台预定',
    '从练习室到打歌台，丝般顺滑',
  ],
  '顺利出道': [
    '稳稳的幸福，出道就是这么顺利',
    '一路绿灯，连经纪人都惊讶',
    '顺利出道，粉丝应援棒都挥得更起劲',
  ],
  '逆袭出道': [
    '黑马剧本已就位，编剧都不敢这么写',
    '逆袭的爽文剧情，主角就是你',
    '从无人问津到全场尖叫，只用了一首歌',
  ],
  '养成系出道': [
    '养成系天花板，妈妈粉已就位',
    '一天一进步，粉丝看着长大的',
    '从青涩到闪耀，这就是养成的快乐',
  ],
  '热血出道': [
    '热血漫画主角脸，不服就练',
    '成绩可以慢慢来，气势绝不能输',
    '虽然排名靠后，但热血拉满',
  ],
};

// 组合盘 / 属性盘的柔彩调色板
const WHEEL_PALETTE = [
  '#FFD6E8', '#E8D6FF', '#D6E8FF', '#D6FFE8', '#FFF3D6',
  '#FFE0D6', '#F5D6FF', '#D6FFF6', '#FFE8FA', '#E4E0FF',
];

// 18 个现役热门男女团（三~五代），每位成员 8 项属性等级
const GROUPS = [
  {
    id: 'twice', name: 'TWICE', generation: 3, colors: ['#FFB7A0', '#FF8FB8'],
    members: [
      { id: 'nayeon', name: '娜琏', stats: { dance:'A', vocal:'A+', rap:'B+', visual:'A', fanservice:'S', variety:'A', language:'B+', bond:'S' } },
      { id: 'jeongyeon', name: '定延', stats: { dance:'B+', vocal:'A', rap:'B+', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'S' } },
      { id: 'momo', name: 'Momo', stats: { dance:'S', vocal:'B', rap:'C+', visual:'A', fanservice:'S', variety:'B+', language:'B', bond:'S' } },
      { id: 'sana', name: 'Sana', stats: { dance:'A+', vocal:'B+', rap:'C+', visual:'S', fanservice:'S', variety:'A+', language:'A+', bond:'S' } },
      { id: 'jihyo', name: '志效', stats: { dance:'A', vocal:'S', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'S' } },
      { id: 'mina', name: 'Mina', stats: { dance:'A+', vocal:'B+', rap:'B', visual:'S', fanservice:'B+', variety:'B', language:'A', bond:'A+' } },
      { id: 'dahyun', name: '多贤', stats: { dance:'B+', vocal:'B+', rap:'B+', visual:'A', fanservice:'S', variety:'S', language:'A', bond:'S' } },
      { id: 'chaeyoung', name: '彩瑛', stats: { dance:'A', vocal:'B+', rap:'S', visual:'A', fanservice:'B+', variety:'B+', language:'A', bond:'A+' } },
      { id: 'tzuyu', name: '子瑜', stats: { dance:'A', vocal:'B+', rap:'C+', visual:'S', fanservice:'S', variety:'B', language:'A', bond:'A+' } },
    ],
  },
  {
    id: 'redvelvet', name: 'Red Velvet', generation: 3, colors: ['#FFC4C4', '#E88F8F'],
    members: [
      { id: 'irene', name: 'Irene', stats: { dance:'A+', vocal:'B+', rap:'A', visual:'S', fanservice:'B+', variety:'B+', language:'B+', bond:'A' } },
      { id: 'seulgi', name: '涩琪', stats: { dance:'S', vocal:'A+', rap:'B+', visual:'A', fanservice:'A', variety:'B+', language:'B+', bond:'A+' } },
      { id: 'wendy', name: 'Wendy', stats: { dance:'A', vocal:'S', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
      { id: 'joy', name: 'Joy', stats: { dance:'A', vocal:'A+', rap:'B', visual:'S', fanservice:'A+', variety:'A', language:'B+', bond:'A' } },
      { id: 'yeri', name: 'Yeri', stats: { dance:'B+', vocal:'B+', rap:'A', visual:'A', fanservice:'A', variety:'A', language:'A', bond:'A' } },
    ],
  },
  {
    id: 'seventeen', name: 'SEVENTEEN', generation: 3, colors: ['#F7CAC9', '#92A8D1'],
    members: [
      { id: 'scoups', name: 'S.COUPS', stats: { dance:'A', vocal:'B+', rap:'S', visual:'A', fanservice:'A+', variety:'B+', language:'B+', bond:'S' } },
      { id: 'jeonghan', name: '净汉', stats: { dance:'B+', vocal:'A', rap:'C+', visual:'S', fanservice:'S', variety:'A+', language:'B', bond:'A+' } },
      { id: 'joshua', name: 'Joshua', stats: { dance:'B+', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'B+', language:'S', bond:'A+' } },
      { id: 'jun', name: 'Jun', stats: { dance:'A', vocal:'B+', rap:'C+', visual:'A', fanservice:'A', variety:'B+', language:'A+', bond:'A+' } },
      { id: 'hoshi', name: 'Hoshi', stats: { dance:'S', vocal:'A', rap:'B', visual:'A', fanservice:'S', variety:'S', language:'B', bond:'S' } },
      { id: 'wonwoo', name: '圆佑', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'B+', language:'B+', bond:'A+' } },
      { id: 'woozi', name: 'Woozi', stats: { dance:'A', vocal:'S', rap:'B+', visual:'A', fanservice:'A', variety:'B+', language:'B+', bond:'S' } },
      { id: 'dk', name: 'DK', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'S', variety:'A+', language:'B', bond:'S' } },
      { id: 'mingyu', name: '珉奎', stats: { dance:'A', vocal:'B+', rap:'B+', visual:'S', fanservice:'A+', variety:'A+', language:'B+', bond:'A+' } },
      { id: 'the8', name: 'THE 8', stats: { dance:'S', vocal:'B+', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'S', bond:'A+' } },
      { id: 'seungkwan', name: '胜宽', stats: { dance:'B+', vocal:'A+', rap:'B', visual:'B+', fanservice:'S', variety:'S', language:'B+', bond:'A+' } },
      { id: 'vernon', name: 'Vernon', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'A', fanservice:'B+', variety:'B+', language:'S', bond:'A+' } },
      { id: 'dino', name: 'Dino', stats: { dance:'S', vocal:'B+', rap:'B+', visual:'A', fanservice:'A', variety:'A', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'nct127', name: 'NCT 127', generation: 3, colors: ['#CBE8C8', '#A8D8C8'],
    members: [
      { id: 'taeyong', name: '泰容', stats: { dance:'S', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'S' } },
      { id: 'johnny', name: 'Johnny', stats: { dance:'B+', vocal:'B+', rap:'A', visual:'A', fanservice:'A', variety:'A', language:'S', bond:'A' } },
      { id: 'yuta', name: '悠太', stats: { dance:'A', vocal:'B+', rap:'B', visual:'A', fanservice:'A+', variety:'B+', language:'S', bond:'A' } },
      { id: 'doyoung', name: '道英', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'A+', language:'B+', bond:'A+' } },
      { id: 'jaehyun', name: '在玹', stats: { dance:'B+', vocal:'A+', rap:'B', visual:'S', fanservice:'A', variety:'B+', language:'A', bond:'A' } },
      { id: 'jungwoo', name: '廷祐', stats: { dance:'B+', vocal:'A', rap:'B', visual:'A', fanservice:'A', variety:'A+', language:'B+', bond:'A' } },
      { id: 'mark', name: 'Mark', stats: { dance:'A+', vocal:'B+', rap:'S', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
      { id: 'haechan', name: '楷灿', stats: { dance:'A', vocal:'A+', rap:'B', visual:'A', fanservice:'A+', variety:'S', language:'B+', bond:'A+' } },
    ],
  },
  {
    id: 'bts', name: 'BTS', generation: 3, colors: ['#D6C6FF', '#B39DDB'],
    members: [
      { id: 'rm', name: 'RM', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'A', language:'S', bond:'S' } },
      { id: 'jin', name: 'Jin', stats: { dance:'B+', vocal:'A+', rap:'C+', visual:'S', fanservice:'A+', variety:'S', language:'B', bond:'S' } },
      { id: 'suga', name: 'SUGA', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'A', language:'B', bond:'S' } },
      { id: 'jhope', name: 'J-Hope', stats: { dance:'S', vocal:'B+', rap:'A+', visual:'A', fanservice:'A+', variety:'A+', language:'B', bond:'S' } },
      { id: 'jimin', name: 'Jimin', stats: { dance:'S', vocal:'A+', rap:'C+', visual:'S', fanservice:'S', variety:'A', language:'B+', bond:'S' } },
      { id: 'v', name: 'V', stats: { dance:'A', vocal:'A', rap:'B', visual:'S', fanservice:'S', variety:'A', language:'B', bond:'S' } },
      { id: 'jungkook', name: '柾国', stats: { dance:'A+', vocal:'S', rap:'A', visual:'S', fanservice:'S', variety:'A', language:'A', bond:'S' } },
    ],
  },
  {
    id: 'straykids', name: 'Stray Kids', generation: 4, colors: ['#FFC9C9', '#D8D8E8'],
    members: [
      { id: 'bangchan', name: '方灿', stats: { dance:'A', vocal:'A+', rap:'A+', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'S' } },
      { id: 'leeknow', name: 'Lee Know', stats: { dance:'S', vocal:'B+', rap:'B', visual:'A', fanservice:'S', variety:'A+', language:'B', bond:'A+' } },
      { id: 'changbin', name: '彰彬', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'B+', fanservice:'A', variety:'A+', language:'B', bond:'A+' } },
      { id: 'hyunjin', name: '铉辰', stats: { dance:'S', vocal:'B+', rap:'A', visual:'S', fanservice:'A+', variety:'B+', language:'B', bond:'A' } },
      { id: 'han', name: 'HAN', stats: { dance:'A', vocal:'A+', rap:'S', visual:'A', fanservice:'A', variety:'S', language:'B+', bond:'A+' } },
      { id: 'felix', name: 'Felix', stats: { dance:'A+', vocal:'B', rap:'A', visual:'S', fanservice:'S', variety:'B+', language:'S', bond:'A+' } },
      { id: 'seungmin', name: '昇玟', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'A', bond:'A+' } },
      { id: 'in', name: 'I.N', stats: { dance:'B+', vocal:'A', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'txt', name: 'TXT', generation: 4, colors: ['#B3D9FF', '#FFF3B0'],
    members: [
      { id: 'soobin', name: '秀彬', stats: { dance:'A', vocal:'A', rap:'B', visual:'S', fanservice:'S', variety:'A', language:'B', bond:'S' } },
      { id: 'yeonjun', name: '然竣', stats: { dance:'S', vocal:'A', rap:'A', visual:'A', fanservice:'A+', variety:'A+', language:'B', bond:'A+' } },
      { id: 'beomgyu', name: '杋圭', stats: { dance:'A', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'S', language:'B', bond:'A+' } },
      { id: 'taehyun', name: '太显', stats: { dance:'A', vocal:'A+', rap:'B+', visual:'A', fanservice:'A', variety:'A', language:'A', bond:'A+' } },
      { id: 'hueningkai', name: '休宁凯', stats: { dance:'A', vocal:'A+', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
    ],
  },
  {
    id: 'gidle', name: '(G)I-DLE', generation: 4, colors: ['#FFB3C1', '#E8D8E8'],
    members: [
      { id: 'miyeon', name: '美延', stats: { dance:'B+', vocal:'S', rap:'B', visual:'S', fanservice:'A+', variety:'A', language:'B', bond:'A+' } },
      { id: 'minnie', name: 'Minnie', stats: { dance:'B+', vocal:'S', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
      { id: 'soyeon', name: '小娟', stats: { dance:'A', vocal:'A+', rap:'S', visual:'A', fanservice:'A', variety:'A+', language:'A', bond:'S' } },
      { id: 'yuqi', name: '雨琦', stats: { dance:'A', vocal:'A', rap:'A', visual:'A', fanservice:'A+', variety:'S', language:'S', bond:'A+' } },
      { id: 'shuhua', name: '舒华', stats: { dance:'B+', vocal:'B', rap:'B', visual:'S', fanservice:'A', variety:'A', language:'A', bond:'A+' } },
    ],
  },
  {
    id: 'itzy', name: 'ITZY', generation: 4, colors: ['#E1C6FF', '#FFB3D9'],
    members: [
      { id: 'yeji', name: '礼志', stats: { dance:'S', vocal:'A', rap:'B+', visual:'A', fanservice:'A+', variety:'B+', language:'B', bond:'A' } },
      { id: 'lia', name: 'Lia', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'A', bond:'A+' } },
      { id: 'ryujin', name: '留真', stats: { dance:'S', vocal:'B+', rap:'A', visual:'S', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'chaeryeong', name: '彩领', stats: { dance:'S', vocal:'B+', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A+' } },
      { id: 'yuna', name: '有娜', stats: { dance:'A+', vocal:'B+', rap:'B+', visual:'S', fanservice:'S', variety:'A+', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'enhypen', name: 'ENHYPEN', generation: 4, colors: ['#FFD9A0', '#D8D8E8'],
    members: [
      { id: 'heeseung', name: '羲承', stats: { dance:'A', vocal:'S', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'jay', name: 'Jay', stats: { dance:'A+', vocal:'A', rap:'B+', visual:'A', fanservice:'A', variety:'A+', language:'A', bond:'A' } },
      { id: 'jake', name: 'Jake', stats: { dance:'A', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A' } },
      { id: 'sunghoon', name: '成训', stats: { dance:'A+', vocal:'B+', rap:'B', visual:'S', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'sunoo', name: '善禹', stats: { dance:'B+', vocal:'A', rap:'B', visual:'A', fanservice:'S', variety:'A+', language:'B', bond:'A' } },
      { id: 'jungwon', name: '祯元', stats: { dance:'A+', vocal:'A', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A' } },
      { id: 'niki', name: 'NI-KI', stats: { dance:'S', vocal:'B', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'A', bond:'A' } },
    ],
  },
  {
    id: 'aespa', name: 'aespa', generation: 5, colors: ['#C9B6FF', '#B3E5E8'],
    members: [
      { id: 'karina', name: 'Karina', stats: { dance:'A+', vocal:'A', rap:'A', visual:'S', fanservice:'A+', variety:'A', language:'B', bond:'A' } },
      { id: 'giselle', name: 'Giselle', stats: { dance:'B+', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'A+', language:'S', bond:'A+' } },
      { id: 'winter', name: 'Winter', stats: { dance:'A+', vocal:'S', rap:'B', visual:'S', fanservice:'A', variety:'B+', language:'B', bond:'A+' } },
      { id: 'ningning', name: '宁宁', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'A+', language:'S', bond:'A+' } },
    ],
  },
  {
    id: 'ive', name: 'IVE', generation: 5, colors: ['#A9D6F5', '#F0E8FF'],
    members: [
      { id: 'yujin', name: '宥真', stats: { dance:'A', vocal:'A', rap:'B+', visual:'A', fanservice:'A+', variety:'S', language:'B', bond:'A' } },
      { id: 'gaeul', name: '秋天', stats: { dance:'A+', vocal:'B+', rap:'A', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'rei', name: 'Rei', stats: { dance:'B+', vocal:'B+', rap:'A', visual:'A', fanservice:'A+', variety:'A+', language:'S', bond:'A+' } },
      { id: 'wonyoung', name: '元英', stats: { dance:'A', vocal:'B+', rap:'C+', visual:'S', fanservice:'S', variety:'A+', language:'A', bond:'A' } },
      { id: 'liz', name: 'Liz', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'B+', language:'B', bond:'A+' } },
      { id: 'leeseo', name: '李瑞', stats: { dance:'A', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'lesserafim', name: 'LE SSERAFIM', generation: 5, colors: ['#A8D8EA', '#D8D8E8'],
    members: [
      { id: 'chaewon', name: '采源', stats: { dance:'A+', vocal:'A+', rap:'B', visual:'A', fanservice:'A', variety:'A', language:'B', bond:'A' } },
      { id: 'sakura', name: 'Sakura', stats: { dance:'A', vocal:'B+', rap:'B', visual:'S', fanservice:'S', variety:'A+', language:'S', bond:'A+' } },
      { id: 'yunjin', name: '允真', stats: { dance:'B+', vocal:'S', rap:'B+', visual:'A', fanservice:'A', variety:'A+', language:'S', bond:'A' } },
      { id: 'kazuha', name: 'Kazuha', stats: { dance:'S', vocal:'B+', rap:'B', visual:'S', fanservice:'A', variety:'B+', language:'A', bond:'A' } },
      { id: 'eunchae', name: '恩彩', stats: { dance:'A', vocal:'B+', rap:'B', visual:'A', fanservice:'A+', variety:'S', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'newjeans', name: 'NewJeans', generation: 5, colors: ['#B3D9FF', '#FFC4D6'],
    members: [
      { id: 'minji', name: 'Minji', stats: { dance:'A', vocal:'A', rap:'B+', visual:'S', fanservice:'A+', variety:'A', language:'B', bond:'A' } },
      { id: 'hanni', name: 'Hanni', stats: { dance:'A+', vocal:'A+', rap:'B', visual:'A', fanservice:'S', variety:'A', language:'S', bond:'A+' } },
      { id: 'danielle', name: 'Danielle', stats: { dance:'A', vocal:'A+', rap:'B', visual:'A', fanservice:'S', variety:'A', language:'S', bond:'A+' } },
      { id: 'haerin', name: 'Haerin', stats: { dance:'A+', vocal:'A', rap:'B', visual:'S', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'hyein', name: 'Hyein', stats: { dance:'B+', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
    ],
  },
  {
    id: 'nmixx', name: 'NMIXX', generation: 5, colors: ['#A8DADC', '#C8E6C9'],
    members: [
      { id: 'lily', name: 'Lily', stats: { dance:'B+', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
      { id: 'haewon', name: '海嫄', stats: { dance:'A', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'S', language:'B', bond:'A' } },
      { id: 'sullyoon', name: 'Sullyoon', stats: { dance:'A', vocal:'A+', rap:'B+', visual:'S', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'bae', name: 'BAE', stats: { dance:'A', vocal:'A+', rap:'B+', visual:'A', fanservice:'A+', variety:'A+', language:'B', bond:'A' } },
      { id: 'jiwoo', name: '智羽', stats: { dance:'A+', vocal:'A', rap:'A', visual:'A', fanservice:'A', variety:'A+', language:'B', bond:'A' } },
      { id: 'kyujin', name: 'Kyujin', stats: { dance:'S', vocal:'A', rap:'B+', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A+' } },
    ],
  },
  {
    id: 'zerobaseone', name: 'ZEROBASEONE', generation: 5, colors: ['#B3D9FF', '#D6C6FF'],
    members: [
      { id: 'sunghanbin', name: '成韩彬', stats: { dance:'S', vocal:'A+', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'B', bond:'A' } },
      { id: 'kimjiwoong', name: '金地雄', stats: { dance:'B+', vocal:'B+', rap:'B+', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
      { id: 'zhanghao', name: '章昊', stats: { dance:'A', vocal:'S', rap:'B+', visual:'A', fanservice:'A+', variety:'A+', language:'S', bond:'A+' } },
      { id: 'seokmatthew', name: '石马修', stats: { dance:'B+', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A' } },
      { id: 'kimtaerae', name: '金太来', stats: { dance:'B+', vocal:'A+', rap:'B', visual:'B+', fanservice:'A', variety:'A+', language:'B', bond:'A' } },
      { id: 'ricky', name: 'Ricky', stats: { dance:'B+', vocal:'B+', rap:'B+', visual:'S', fanservice:'A', variety:'B+', language:'A', bond:'A' } },
      { id: 'kimgyuvin', name: '金奎彬', stats: { dance:'B+', vocal:'B+', rap:'B', visual:'A', fanservice:'A+', variety:'A+', language:'B', bond:'A' } },
      { id: 'parkgunwook', name: '朴乾煜', stats: { dance:'A', vocal:'A', rap:'A', visual:'A', fanservice:'A', variety:'A+', language:'B', bond:'A' } },
      { id: 'hanyujin', name: '韩维辰', stats: { dance:'A+', vocal:'B+', rap:'B', visual:'S', fanservice:'A+', variety:'B+', language:'B', bond:'A' } },
    ],
  },
  {
    id: 'babymonster', name: 'BABYMONSTER', generation: 5, colors: ['#D8D8E8', '#FFB3B3'],
    members: [
      { id: 'ruka', name: 'Ruka', stats: { dance:'S', vocal:'B+', rap:'A+', visual:'A', fanservice:'A', variety:'A', language:'A', bond:'A+' } },
      { id: 'pharita', name: 'Pharita', stats: { dance:'A', vocal:'A+', rap:'B', visual:'S', fanservice:'A+', variety:'B+', language:'S', bond:'A+' } },
      { id: 'asa', name: 'Asa', stats: { dance:'A+', vocal:'B+', rap:'S', visual:'A', fanservice:'A', variety:'B+', language:'S', bond:'A+' } },
      { id: 'ahyeon', name: 'Ahyeon', stats: { dance:'A+', vocal:'S', rap:'A', visual:'A', fanservice:'A+', variety:'A', language:'A', bond:'A+' } },
      { id: 'rami', name: 'Rami', stats: { dance:'A+', vocal:'S', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'A+' } },
      { id: 'rora', name: 'Rora', stats: { dance:'A', vocal:'S', rap:'B', visual:'A', fanservice:'A+', variety:'B+', language:'B', bond:'A+' } },
      { id: 'chiquita', name: 'Chiquita', stats: { dance:'S', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A+' } },
    ],
  },
  {
    id: 'kissoflife', name: 'KISS OF LIFE', generation: 5, colors: ['#FFD9E0', '#FFAAAA'],
    members: [
      { id: 'julie', name: 'Julie', stats: { dance:'A+', vocal:'B+', rap:'S', visual:'A', fanservice:'A+', variety:'A', language:'S', bond:'A' } },
      { id: 'natty', name: 'Natty', stats: { dance:'S', vocal:'A', rap:'B', visual:'A', fanservice:'A+', variety:'A', language:'A', bond:'A+' } },
      { id: 'belle', name: 'Belle', stats: { dance:'A', vocal:'S', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'A', bond:'A+' } },
      { id: 'haneul', name: 'Haneul', stats: { dance:'A+', vocal:'A', rap:'B', visual:'A', fanservice:'A', variety:'B+', language:'B', bond:'A' } },
    ],
  },
];
