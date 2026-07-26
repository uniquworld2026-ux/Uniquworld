import { Line } from 'react-chartjs-2'
import { useTheme } from '@/shared/hooks/useTheme'
import {
  chartDefaults,
  getChartColors,
  revenueSeries,
} from '@/admin/components/widgets/chartSetup'

export function RevenueChart() {
  const { isDark } = useTheme()
  const colors = getChartColors(isDark)

  const data = {
    labels: revenueSeries.labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueSeries.revenue,
        borderColor: colors.accent,
        backgroundColor: colors.accentSoft,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: colors.accent,
        borderWidth: 2.5,
      },
      {
        label: 'Target',
        data: revenueSeries.target,
        borderColor: colors.primary,
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  }

  const options = {
    ...chartDefaults,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          color: colors.text,
          font: { family: 'Outfit', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.tooltipText,
        bodyColor: colors.tooltipText,
        borderColor: colors.grid,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label(ctx) {
            const value = ctx.parsed.y ?? 0
            return ` ${ctx.dataset.label}: ₹${(value / 1000).toFixed(0)}K`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: colors.muted, font: { family: 'Outfit', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: colors.grid },
        ticks: {
          color: colors.muted,
          font: { family: 'Outfit', size: 11 },
          callback: (v) => `₹${v / 1000}K`,
        },
        border: { display: false },
      },
    },
  }

  return (
    <div className="h-64 w-full sm:h-72">
      <Line data={data} options={options} />
    </div>
  )
}
