import * as XLSX from 'xlsx'

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function downloadWorkbook(filename, sheets) {
  const workbook = XLSX.utils.book_new()
  sheets.forEach((sheet) => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheet.rows)
    worksheet['!cols'] = sheet.cols
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31))
  })
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  downloadBlob(
    filename,
    new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
  )
}

export function parseSpreadsheetRows(buffer) {
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false })
  const sheetName =
    workbook.SheetNames.find((name) => name.toLowerCase() === 'products') || workbook.SheetNames[0]
  if (!sheetName) return []
  const worksheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false })
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [String(key).trim(), String(value ?? '').trim()]),
    ),
  )
}

export function readSpreadsheetFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function isExcelFile(file) {
  const name = String(file?.name || '').toLowerCase()
  return name.endsWith('.xlsx') || name.endsWith('.xls')
}
