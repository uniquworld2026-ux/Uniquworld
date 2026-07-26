import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '@/shared/hooks/useTheme'
import {
  chartDefaults,
  getChartColors,
  topProductsSeries,
} from '@/admin/components/widgets/chartSetup'

export function TopProductsChart() {
  const { isDark } = useTheme()
  const colors = getChartColors(isDark)

  const palette = [
    colors.accent,
    colors.primary,
    colors.success,
    colors.info,
    colors.warning,
  ]

  const data = {
    labels: topProductsSeries.labels,
    datasets: [
      {
        data: topProductsSeries.sales,
        backgroundColor: palette,
        borderColor: isDark ? '#171A21' : '#FFFFFF',
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    ...chartDefaults,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          padding: 14,
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
      },
    },
  }

  return (
    <div className="mx-auto h-56 w-full max-w-[240px] sm:h-64">
      <Doughnut data={data} options={options} />
    </div>
  )
}
