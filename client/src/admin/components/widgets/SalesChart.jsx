import { Bar } from 'react-chartjs-2'
import { useTheme } from '@/shared/hooks/useTheme'
import {
  chartDefaults,
  getChartColors,
  salesSeries,
} from '@/admin/components/widgets/chartSetup'

export function SalesChart() {
  const { isDark } = useTheme()
  const colors = getChartColors(isDark)

  const data = {
    labels: salesSeries.labels,
    datasets: [
      {
        label: 'Orders',
        data: salesSeries.orders,
        backgroundColor: colors.accent,
        borderRadius: 6,
        barPercentage: 0.55,
        categoryPercentage: 0.7,
      },
      {
        label: 'Units',
        data: salesSeries.units,
        backgroundColor: colors.primarySoft,
        borderRadius: 6,
        barPercentage: 0.55,
        categoryPercentage: 0.7,
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
        ticks: { color: colors.muted, font: { family: 'Outfit', size: 11 } },
        border: { display: false },
      },
    },
  }

  return (
    <div className="h-64 w-full sm:h-72">
      <Bar data={data} options={options} />
    </div>
  )
}
