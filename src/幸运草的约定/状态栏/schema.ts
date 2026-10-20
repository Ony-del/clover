export const Schema = z.object({
  世界: z.object({
    日期: z.string().prefault('2026/06/05'),
    时间段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '夜晚', '深夜']).prefault('下午'),
    当前地点: z.string().prefault('南户综合学校 三楼走廊'),
    天气: z.string().prefault('梅雨刚停，闷'),
    剧情阶段: z.enum(['共通', '分线', '结局']).prefault('共通'),
    主线: z.enum(['未定', '杏铃', '杏璃', '燕', '泉', '无']).prefault('未定'),
    婚期倒数: z.coerce.number().transform(v => _.clamp(v, 0, 120)).prefault(100),
    婚事进度: z.enum(['传开', '定档', '逼近', '本周']).prefault('传开'),
    季节待办: z.array(z.string()).prefault(['学生会竞选（六月下）', '慈善演出（七月中）', '暑假旅行（八月）']),
    最近发生: z.string().prefault('放学后的走廊，紫苑发信息说今晚有事要谈'),
  }).prefault({}),

  鹰仓杏铃: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(45),
    关系阶段: z.enum(['继妹', '在乎', '恋人']).prefault('继妹'),
  }).prefault({}),

  鹰仓杏璃: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(40),
    关系阶段: z.enum(['继妹', '在乎', '恋人']).prefault('继妹'),
  }).prefault({}),

  龙胆燕: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(35),
    关系阶段: z.enum(['青梅', '在乎', '恋人']).prefault('青梅'),
  }).prefault({}),

  结桥泉: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(30),
    关系阶段: z.enum(['对手', '在乎', '恋人']).prefault('对手'),
  }).prefault({}),
});

export type SchemaType = z.infer<typeof Schema>;
