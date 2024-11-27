<script setup lang="ts">
import { p5i } from 'p5i'
import type { P5I } from 'p5i'
import { onMounted, onUnmounted, ref } from 'vue'

const el = ref<HTMLCanvasElement | null>(null)
const isDark = useDark()

const {
  mount,
  unmount,
  createCanvas,
  background,
  noFill,
  stroke,
  noise,
  noiseSeed,
  resizeCanvas,
  cos,
  sin,
  TWO_PI,
} = p5i()

// 配置参数
const CONFIG = {
  SCALE: 200, // 噪声缩放
  LENGTH: 8, // 点移动长度
  SPACING: 20, // 点间距
  POINT_SIZE: 1.5, // 点大小
  OPACITY: 0.6, // 基础透明度
  SPEED: 0.0001, // 动画速度
}

// 颜色主题
const THEME = {
  light: {
    background: '#ffffff',
    particle: '#8888ff',
  },
  dark: {
    background: '#111111',
    particle: '#ffffff',
  },
}

let w = window.innerWidth
let h = window.innerHeight
const points: { x: number, y: number, opacity: number }[] = []
const existingPoints = new Set<string>()

// 使用柏林噪声计算力场
function getForceVector(x: number, y: number, t: number) {
  const angle = (noise(x / CONFIG.SCALE, y / CONFIG.SCALE, t) - 0.5) * 2 * TWO_PI
  const strength = noise(x / CONFIG.SCALE, y / CONFIG.SCALE, t * 2) + 0.5
  return {
    angle,
    strength: strength * CONFIG.LENGTH,
  }
}

// 添加新的点
function addPoints() {
  for (let x = 0; x < w + CONFIG.SPACING; x += CONFIG.SPACING) {
    for (let y = 0; y < h + CONFIG.SPACING; y += CONFIG.SPACING) {
      const id = `${x}-${y}`
      if (existingPoints.has(id))
        continue
      existingPoints.add(id)
      points.push({
        x,
        y,
        opacity: Math.random() * 0.5 + CONFIG.OPACITY,
      })
    }
  }
}

function setup() {
  createCanvas(w, h)
  noiseSeed(Date.now())
  noFill()
  addPoints()
}

function draw({ circle }: P5I) {
  const theme = isDark.value ? THEME.dark : THEME.light
  background(theme.background)

  const t = Date.now() * CONFIG.SPEED

  for (const p of points) {
    const { angle, strength } = getForceVector(p.x, p.y, t)
    const nx = p.x + cos(angle) * strength
    const ny = p.y + sin(angle) * strength

    // 计算动态透明度
    const opacity = (Math.abs(cos(angle)) * 0.5 + 0.5) * p.opacity * 255

    stroke(theme.particle)
    circle(nx, ny, CONFIG.POINT_SIZE)
  }
}

function restart() {
  if (el.value) {
    points.length = 0
    existingPoints.clear()
    mount(el.value, { setup, draw })
  }
}

// 监听窗口大小变化
function handleResize() {
  w = window.innerWidth
  h = window.innerHeight
  resizeCanvas(w, h)
  points.length = 0
  existingPoints.clear()
  addPoints()
}

onMounted(() => {
  restart()
  useEventListener('resize', handleResize)
})

onUnmounted(() => {
  unmount()
})

// 监听主题变化
watch(isDark, () => {
  restart()
})
</script>

<template>
  <div
    ref="el"
    class="fixed inset-0 pointer-events-none -z-1 transition-colors duration-300"
  />
</template>
