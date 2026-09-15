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

// 结果小评语：按出道评级分层，随机取一条
// gap = 有强弱差时使用（{top} 替换为最强属性名，{weak} 替换为最弱属性名）
// even = 八项无强弱差（六边形）时使用，不含占位符
const RESULT_COMMENTS = {
  '传奇级出道': {
    gap: [
      '{top}强到封神，{weak}弱到被队友当场补习',
      '{top}是公司的印钞机，{weak}是粉丝的怜爱点',
      '{top}直接登基，{weak}负责可爱',
    ],
    even: [
      '六边形天花板，找短板？不存在的',
      '全项封神，评委只能挑你袖口的线头',
    ],
  },
  '顶配出道': {
    gap: [
      '{top}顶配拉满，{weak}也就地球人水平',
      '{top}让黑粉闭嘴，{weak}让妈妈粉心疼',
      '{top}是 C 位答案，{weak}是隐藏彩蛋',
    ],
    even: [
      '全项顶配，无死角的美',
      '这配置，编剧都不敢这么写',
    ],
  },
  '高位出道': {
    gap: [
      '{top}撑起整个团，{weak}被团粉温柔守护',
      '{top}是高位出道的底气，{weak}是未来的惊喜',
      '{top}教科书级，{weak}还能再进化',
    ],
    even: [
      '均衡发展，高位出道实至名归',
      '没有短板的六边形，稳稳的高位',
    ],
  },
  '顺滑出道': {
    gap: [
      '{top}丝般顺滑，{weak}偶尔卡壳也挡不住出道',
      '{top}一路绿灯，{weak}也顺利过线',
      '{top}像冰面漂移，{weak}像减速带，都过去了',
    ],
    even: [
      '全项顺滑，零失误预定',
      '六边平衡，顺滑得像滑冰场',
    ],
  },
  '顺利出道': {
    gap: [
      '{top}是定海神针，{weak}是可爱的小短板',
      '{top}稳稳拿分，{weak}还在努力跟上',
      '{top}负责撑场子，{weak}负责可爱',
    ],
    even: [
      '各项平稳，顺利出道没悬念',
      '均衡发展，一路绿灯',
    ],
  },
  '逆袭出道': {
    gap: [
      '{top}是逆袭的底牌，{weak}是剧本的伏笔',
      '{top}黑马之姿，{weak}也在偷偷变强',
      '{top}震惊全场，{weak}震惊队友（褒义）',
    ],
    even: [
      '均衡黑马，逆袭有理有据',
      '全项在线，逆袭只是时间问题',
    ],
  },
  '养成系出道': {
    gap: [
      '{top}已经成形，{weak}正在养成中，敬请期待',
      '{top}提前毕业，{weak}还在练习室卷',
      '{top}是养成系的骄傲，{weak}是养成的乐趣',
    ],
    even: [
      '各项稳步成长，养成系模范生',
      '均衡发展，一天比一天闪',
    ],
  },
  '热血出道': {
    gap: [
      '{top}已经燃起来了，{weak}也要一起燃！',
      '{top}是主角光环，{weak}是成长线',
      '{top}先冲为敬，{weak}热血追赶中',
    ],
    even: [
      '全项热血，气势拉满',
      '六边均衡，热血出道没有借口',
    ],
  },
};

// 组合盘 / 属性盘的柔彩调色板
const WHEEL_PALETTE = [
  '#FFD6E8', '#E8D6FF', '#D6E8FF', '#D6FFE8', '#FFF3D6',
  '#FFE0D6', '#F5D6FF', '#D6FFF6', '#FFE8FA', '#E4E0FF',
];

// 结果图二维码（base64 内嵌，指向线上地址）。
// 内嵌而非文件加载的原因：Safari 在 file:// 本地打开时，
// 把本地图片画上画布会触发「画布污染」导致导出 PNG 报 SecurityError。
const QR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAklEQVR4AewaftIAAAakSURBVO3BUY7k2BEEQY9E3f/KofkVJL6BSBHV2etm6R9IWmmQtNYgaa1B0lqDpLUGSWsNktYaJK314S+S8Bu15SQJT7TlriR8S1ueSMKVtrwpCb9RW64MktYaJK01SFprkLTWIGmtQdJag6S1PjzUlp8qCXe15SQJJ0m4qy1vScITSXhLEk7acldbfqok3DVIWmuQtNYgaa1B0lqDpLUGSWsNktb68LIkvKUtb0nCE225KwlPtOVKW97UlitJ+KmS8Ja2vGWQtNYgaa1B0lqDpLUGSWsNktb6oP+qLW9Jwklb3pKEk7Z8S1v0vxkkrTVIWmuQtNYgaa1B0lqDpLUGSWt90CuSsFESTtpykoQrbdH/1yBprUHSWoOktQZJaw2S1hokrTVIWuvDy9qyURKeaMuVJJwk4S1tOUnCSRJ+o7ZsNEhaa5C01iBprUHSWoOktQZJaw2S1vrwUBL+idpykoQrbTlJwklbTpLwlracJOGuJJy05a4k/EaDpLUGSWsNktYaJK01SFprkLRW+gf6v0vCt7TlShKeaMtJEt7SFv27QdJag6S1BklrDZLWGiStNUhaa5C01oe/SMJJW06ScKUtb0rCXW05ScJb2nKShLvacpKEJ9pyVxLekoSTtjyRhCttOUnCSVuuDJLWGiStNUhaa5C01iBprUHSWoOktdI/eCAJ39KWu5LwLW05ScJJW+5KwklbTpJw0pYrSThpyxNJuKstb0nCE225Mkhaa5C01iBprUHSWoOktQZJaw2S1kr/4IEknLTlriR8S1tOknDSlitJOGnLSRK+pS0nSXhLW96ShLe05SQJJ225Mkhaa5C01iBprUHSWoOktQZJa314qC13JeGkLSdJOGnLlSQ80ZaTJLylLSdJuNKWkyR8S1ueSMKVtpy05SQJJ225qy13DZLWGiStNUhaa5C01iBprUHSWoOktdI/eFESrrTlTUn4idpykoS3tOUkCSdtuSsJP1VbviUJJ225Mkhaa5C01iBprUHSWoOktQZJaw2S1vrwgyXhpC0nbbkrCU+05UoSviUJb0rCW9pykoSfKAlvGSStNUhaa5C01iBprUHSWoOktQZJa334iySctOWkLVeScNKWkyS8pS0nSXhLW96ShJO2nCThLW15oi13JeGkLXe15SQJdw2S1hokrTVIWmuQtNYgaa1B0lofXpaEK205ScJJW76lLSdJeEsSTtpypS0nSThpy1uScNKWkyRcactJW76lLXcNktYaJK01SFprkLTWIGmtQdJag6S1PjyUhLe05SQJd7XlJAm/URK+JQknbfknSsJJW64MktYaJK01SFprkLTWIGmtQdJag6S1PvxFW06ScNKWK0l4U1vuastP1ZZvScJJW+5KwklbfqokfMMgaa1B0lqDpLUGSWsNktYaJK01SFrrw18k4S1teSIJJ0m40pZvScJJW06S8Ja2/BMl4Ym23JWEuwZJaw2S1hokrTVIWmuQtNYgaa30D16UhCttOUnCSVu+JQnf0paTJFxpy0kSTtpykoQrbXkiCXe15TcaJK01SFprkLTWIGmtQdJag6S1BklrffiLJPxUSbirLd/SlpMknCThriS8qS13JeEtSXhTW64k4aQtdw2S1hokrTVIWmuQtNYgaa1B0lqDpLXSP9B/SMJJW74lCd/SlpMkXGnLSRJO2vKWJLylLSdJOGnLlUHSWoOktQZJaw2S1hokrTVIWmuQtNaHv0jCb9SWNyXhSltOknDSlruS8EQSfqokXGnLE235iQZJaw2S1hokrTVIWmuQtNYgaa0PD7Xlp0rCXW05ScK3JOGkLVfa8i1JeFNbfqIkvGWQtNYgaa1B0lqDpLUGSWsNktYaJK314WVJeEtbvqUtJ0m4koSfKgknbTlJwluS8C1JOGnLNwyS1hokrTVIWmuQtNYgaa1B0lqDpLU+6JYk3NWWkySctOWuJDyRhJO2vCUJJ225koQ3JeFKW06ScNcgaa1B0lqDpLUGSWsNktYaJK01SFrrg/6rJLwlCSdteSIJd7XlJAlvScJP1Za7kvCWQdJag6S1BklrDZLWGiStNUha68PL2rJRW55IwpW2nCThpC1vScJJW06S8Ja2nCThSlueSMJJW6605S2DpLUGSWsNktYaJK01SFprkLTWIGmtDw8l4TdKwklbTtpyV1tOkvCWtjzRlruS8JYknLTlW5Jw0pYrg6S1BklrDZLWGiStNUhaa5C01iBprfQPJK00SFprkLTWIGmtQdJag6S1Bklr/Qt2WCYjcWcd7QAAAABJRU5ErkJggg==';

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
