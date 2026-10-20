<template>
  <div class="clover-status" :class="{ 'is-collapsed': collapsed }">
    <!-- 折叠时的一行摘要 -->
    <button class="clover-head" type="button" @click="collapsed = !collapsed">
      <span class="head-date">{{ d.日期 }}</span>
      <span class="head-sep">·</span>
      <span class="head-place">{{ d.当前地点 }}</span>
      <span class="head-clock">
        <span class="clock-num">{{ d.婚期倒数 }}</span>
        <span class="clock-unit">天</span>
      </span>
      <span class="head-caret">{{ collapsed ? '▾' : '▴' }}</span>
    </button>

    <!-- 展开后的完整面板 -->
    <transition name="fold">
      <div v-show="!collapsed" class="clover-body">

        <!-- 婚期倒数 -->
        <section class="clock-block" :class="'clock-' + progressTone">
          <div class="clock-row">
            <span class="clock-label">离 婚 礼 还 有</span>
            <span class="clock-value">
              <strong>{{ d.婚期倒数 }}</strong><em>天</em>
            </span>
          </div>
          <div class="clock-track">
            <div class="clock-fill" :style="{ width: clockPercent + '%' }" />
            <div class="clock-tick" style="left: 50%" />
            <div class="clock-tick" style="left: 70%" />
            <div class="clock-tick" style="left: 93%" />
          </div>
          <div class="clock-legend">
            <span v-for="step in clockSteps" :key="step.key" :class="{ on: step.on }">
              {{ step.label }}
            </span>
          </div>
        </section>

        <!-- 场景信息 -->
        <section class="meta-block">
          <div class="meta-chip">
            <span class="chip-key">时</span><span class="chip-val">{{ d.时间段 }}</span>
          </div>
          <div class="meta-chip">
            <span class="chip-key">天</span><span class="chip-val">{{ d.天气 }}</span>
          </div>
          <div class="meta-chip">
            <span class="chip-key">线</span><span class="chip-val">{{ d.主线 }}</span>
          </div>
          <div class="meta-chip">
            <span class="chip-key">段</span><span class="chip-val">{{ d.剧情阶段 }}</span>
          </div>
        </section>

        <!-- 四个人 -->
        <section class="people">
          <div
            v-for="p in people"
            :key="p.name"
            class="person"
            :class="{ 'is-main': d.主线 === p.short }"
            :style="{ '--tint': p.tint, '--fill': p.value + '%' }"
          >
            <div class="person-row">
              <span class="person-name">
                <i v-if="d.主线 === p.short" class="dot" />{{ p.name }}
              </span>
              <span class="person-value">{{ p.value }}</span>
            </div>
            <div class="person-track">
              <div class="person-fill" />
            </div>
            <div class="person-stage">
              <span class="stage-tag">{{ p.stage }}</span>
              <span v-if="p.tier" class="stage-tier">{{ p.tier }}</span>
            </div>
          </div>
        </section>

        <!-- 待办 -->
        <section v-if="todos.length" class="todo-block">
          <span class="todo-title">季节待办</span>
          <ul class="todo-list">
            <li v-for="t in todos" :key="t">{{ t }}</li>
          </ul>
        </section>

        <!-- 最近发生 -->
        <section v-if="d.最近发生" class="note-block">
          {{ d.最近发生 }}
        </section>

      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const store = useDataStore();
const d = computed(() => store.data);

const collapsed = ref(true);

/* ── 婚期倒数 ── */

// 进度条：100 天为满，0 天为空
const clockPercent = computed(() => {
  const left = Math.max(0, Math.min(120, Number(d.value.婚期倒数) || 0));
  return Math.round((left / 100) * 100);
});

// 越接近婚期，颜色越暖
const progressTone = computed(() => {
  const left = Number(d.value.婚期倒数) || 0;
  if (left <= 7) return 'now';
  if (left <= 30) return 'near';
  if (left <= 60) return 'mid';
  return 'far';
});

const clockSteps = computed(() => {
  const current = d.value.婚事进度;
  return [
    { key: '传开', label: '传开' },
    { key: '定档', label: '定档' },
    { key: '逼近', label: '逼近' },
    { key: '本周', label: '本周' },
  ].map(step => ({ ...step, on: step.key === current }));
});

/* ── 四个人 ── */

type Person = {
  name: string;
  short: string;
  tint: string;
  value: number;
  stage: string;
  tier: string;
};

function tierOf(value: number): string {
  if (value >= 85) return '只差一句话';
  if (value >= 60) return '明显越线';
  if (value >= 30) return '亲近';
  return '有距离';
}

const people = computed<Person[]>(() => [
  {
    name: '鹰仓杏铃',
    short: '杏铃',
    tint: '#c9a24a',
    value: Number(d.value.鹰仓杏铃.好感度) || 0,
    stage: d.value.鹰仓杏铃.关系阶段,
    tier: tierOf(Number(d.value.鹰仓杏铃.好感度) || 0),
  },
  {
    name: '鹰仓杏璃',
    short: '杏璃',
    tint: '#8d5b62',
    value: Number(d.value.鹰仓杏璃.好感度) || 0,
    stage: d.value.鹰仓杏璃.关系阶段,
    tier: tierOf(Number(d.value.鹰仓杏璃.好感度) || 0),
  },
  {
    name: '龙胆燕',
    short: '燕',
    tint: '#c4909e',
    value: Number(d.value.龙胆燕.好感度) || 0,
    stage: d.value.龙胆燕.关系阶段,
    tier: tierOf(Number(d.value.龙胆燕.好感度) || 0),
  },
  {
    name: '结桥泉',
    short: '泉',
    tint: '#c08a3e',
    value: Number(d.value.结桥泉.好感度) || 0,
    stage: d.value.结桥泉.关系阶段,
    tier: tierOf(Number(d.value.结桥泉.好感度) || 0),
  },
]);

/* ── 待办 ── */

const todos = computed<string[]>(() => {
  const raw = d.value.季节待办;
  if (!Array.isArray(raw)) return [];
  return raw.filter(t => typeof t === 'string' && t.trim() !== '');
});
</script>

<style scoped>
.clover-status {
  --ink: #322c27;
  --ink-soft: #7a6f64;
  --ink-faint: #a2978a;
  --line: #e0d6c8;
  --line-soft: #ece4d8;
  --paper: #fdfaf5;
  --paper-2: #f6efe3;
  --warm: #c07a55;
  --warm-deep: #a45f3e;
  --clover: #6f9e5f;

  font-family: 'Noto Serif CJK SC', 'Songti SC', 'SimSun', serif;
  max-width: 620px;
  margin: 8px auto;
  padding: 0 2px;
  color: var(--ink);
  font-size: 13px;
  line-height: 1.5;
}

/* ── 头部（折叠态也显示） ── */

.clover-head {
  display: flex;
  align-items: baseline;
  gap: 7px;
  width: 100%;
  padding: 7px 12px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 12px;
  color: var(--ink-soft);
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.clover-head:hover {
  background: var(--paper-2);
  border-color: var(--warm);
}

.head-date {
  font-weight: 600;
  color: var(--ink);
  letter-spacing: 0.04em;
}

.head-sep {
  color: var(--line);
}

.head-place {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.head-clock {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  color: var(--warm);
  font-weight: 700;
}

.clock-num {
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}

.clock-unit {
  font-size: 10px;
  font-weight: 400;
  opacity: 0.7;
}

.head-caret {
  font-size: 10px;
  color: var(--ink-faint);
}

/* ── 主体 ── */

.clover-body {
  margin-top: 6px;
  padding: 13px 14px 12px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 3px;
  box-shadow: 0 2px 10px rgba(90, 74, 60, 0.06);
}

/* ── 婚期倒数 ── */

.clock-block {
  background: var(--paper-2);
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  padding: 10px 12px 9px;
  margin-bottom: 11px;
  transition: background 0.6s ease;
}

.clock-block.clock-near {
  background: linear-gradient(160deg, #fbf1e6, #f6e6d6);
}

.clock-block.clock-now {
  background: linear-gradient(160deg, #f9e8de, #f3d9c7);
  border-color: #e2c2a8;
}

.clock-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 8px;
}

.clock-label {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: var(--ink-faint);
}

.clock-value strong {
  font-size: 19px;
  font-weight: 700;
  color: var(--warm-deep);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.clock-value em {
  font-style: normal;
  font-size: 10px;
  color: var(--ink-faint);
  margin-left: 3px;
}

.clock-track {
  position: relative;
  height: 4px;
  background: #e7dcca;
  border-radius: 2px;
  overflow: hidden;
}

.clock-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: linear-gradient(90deg, #e6c9a4, var(--warm));
  border-radius: 2px;
  transition:
    width 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.6s ease;
}

.clock-now .clock-fill {
  background: linear-gradient(90deg, #d99a72, #b5633f);
}

.clock-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.7);
}

.clock-legend {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 10px;
  color: var(--ink-faint);
  letter-spacing: 0.1em;
}

.clock-legend .on {
  color: var(--warm-deep);
  font-weight: 700;
}

/* ── 场景信息 ── */

.meta-block {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}

.meta-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 2px 8px 3px;
  background: var(--paper-2);
  border: 1px solid var(--line-soft);
  border-radius: 2px;
  font-size: 11px;
  max-width: 100%;
}

.chip-key {
  color: var(--ink-faint);
  font-size: 10px;
}

.chip-val {
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 四个人 ── */

.people {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.person {
  padding: 7px 9px 8px;
  background: var(--paper-2);
  border-left: 3px solid var(--tint);
  border-radius: 0 2px 2px 0;
  transition: background 0.3s ease;
}

.person.is-main {
  background: color-mix(in srgb, var(--tint) 10%, var(--paper-2));
}

.person-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 5px;
}

.person-name {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--tint);
  display: inline-block;
}

.person-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--tint);
  font-variant-numeric: tabular-nums;
}

.person-track {
  height: 4px;
  background: #e7dcca;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 5px;
}

.person-fill {
  height: 100%;
  width: var(--fill);
  background: var(--tint);
  border-radius: 2px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.person-stage {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
  font-size: 10px;
  color: var(--ink-faint);
}

.stage-tag {
  color: var(--tint);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.stage-tier {
  opacity: 0.8;
}

/* ── 待办 ── */

.todo-block {
  margin-top: 12px;
  padding-top: 9px;
  border-top: 1px dashed var(--line);
}

.todo-title {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ink-faint);
}

.todo-list {
  margin: 5px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.todo-list li {
  font-size: 10.5px;
  padding: 1px 7px 2px;
  background: var(--paper-2);
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  color: var(--ink-soft);
}

/* ── 最近发生 ── */

.note-block {
  margin-top: 10px;
  padding-left: 9px;
  border-left: 2px solid var(--line);
  font-size: 11.5px;
  color: var(--ink-soft);
  line-height: 1.7;
}

/* ── 折叠动画 ── */

.fold-enter-active,
.fold-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.fold-enter-from,
.fold-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ── 窄屏 ── */

@media (max-width: 480px) {
  .clover-status {
    font-size: 12.5px;
  }

  .people {
    grid-template-columns: 1fr;
  }

  .clover-body {
    padding: 11px 11px 10px;
  }
}
</style>
