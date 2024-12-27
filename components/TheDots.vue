<script setup lang="ts">
import { p5i } from 'p5i'
import type { P5I } from 'p5i'
import { onMounted, onUnmounted, ref } from 'vue'

const el = ref<HTMLCanvasElement | null>(null)
const color = useColorMode()
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

const CONFIG = {
  SCALE: 150,
  LENGTH: 6,
  SPACING: 25,
  POINT_SIZE: 1,
  OPACITY: 0.4,
  SPEED: 0.00008,
  FADE_SPEED: 0.05,
}

const THEME = {
  light: {
    background: '#ffffff',
    particle: 'rgba(0, 0, 0, 0.06)',
  },
  dark: {
    background: '#111111',
    particle: 'rgba(255, 255, 255, 0.08)',
  },
}

let w = window.innerWidth
let h = window.innerHeight

interface Point {
  x: number
  y: number
  opacity: number
  size: number
  speed: number
}

const points: Point[] = []
const existingPoints = new Set<string>()

function getForceVector(x: number, y: number, t: number) {
  const angle = (noise(x / CONFIG.SCALE, y / CONFIG.SCALE, t) - 0.5) * 2 * TWO_PI
  const strength = (noise(x / CONFIG.SCALE, y / CONFIG.SCALE, t * 1.5) + 0.2) * CONFIG.LENGTH
  return {
    angle,
    strength: strength * Math.sin(t * 2), // 添加正弦波动
  }
}

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
        opacity: Math.random() * 0.3 + CONFIG.OPACITY,
        size: Math.random() * 0.5 + CONFIG.POINT_SIZE,
        speed: Math.random() * 0.5 + 0.5, // 每个点有自己的速度
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
  const theme = color.value === 'dark' ? THEME.dark : THEME.light
  background(theme.background)

  const t = Date.now() * CONFIG.SPEED

  for (const p of points) {
    const { angle, strength } = getForceVector(p.x, p.y, t * p.speed)
    const nx = p.x + cos(angle) * strength
    const ny = p.y + sin(angle) * strength

    // 根据移动距离动态调整透明度
    const distance = Math.sqrt(
      (nx - p.x) ** 2 + (ny - p.y) ** 2,
    )
    const dynamicOpacity = p.opacity * (1 - distance / (CONFIG.LENGTH * 2))

    stroke(`rgba(${color.value === 'dark' ? '255,255,255' : '0,0,0'},${dynamicOpacity})`)
    circle(nx, ny, p.size)
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
watch(color, () => {
  restart()
})
</script>

<template>
  <div
    ref="el"
    class="fixed inset-0 pointer-events-none z-[-2] transition-opacity duration-1000"
  />
</template>
