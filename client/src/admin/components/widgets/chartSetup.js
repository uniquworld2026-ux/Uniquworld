import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
)

export function getChartColors(isDark) {
  return {
    accent: isDark ? '#C9A87A' : '#B8956C',
    accentSoft: isDark ? 'rgba(201, 168, 122, 0.28)' : 'rgba(184, 149, 108, 0.22)',
    primary: isDark ? '#E8DCCC' : '#4A3426',
    primarySoft: isDark ? 'rgba(232, 220, 204, 0.18)' : 'rgba(74, 52, 38, 0.12)',
    muted: isDark ? '#8A7B6C' : '#9A8B7C',
    grid: isDark ? 'rgba(232, 220, 204, 0.08)' : 'rgba(61, 43, 31, 0.08)',
    text: isDark ? '#B8A99A' : '#6B5E52',
    tooltipBg: isDark ? '#1C1814' : '#FFFCF8',
    tooltipText: isDark ? '#F3EDE4' : '#2A2118',
    success: isDark ? '#6FA889' : '#3D6B4F',
    info: isDark ? '#60A5FA' : '#2563EB',
    warning: isDark ? '#D4A85C' : '#A67C3A',
  }
}

export const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const revenueSeries = {
  labels: MONTHS.slice(0, 7),
  revenue: [82000, 95000, 88000, 112000, 128000, 141000, 156000],
  target: [90000, 92000, 100000, 110000, 120000, 135000, 150000],
}

export const salesSeries = {
  labels: MONTHS.slice(0, 7),
  orders: [148, 162, 155, 198, 214, 236, 258],
  units: [312, 340, 328, 410, 445, 492, 538],
}

export const topProductsSeries = {
  labels: ['Walnut Tray', 'Brass Candle', 'Linen Wrap', 'Ceramic Mug', 'Gift Hamper'],
  sales: [420, 380, 310, 290, 265],
}
