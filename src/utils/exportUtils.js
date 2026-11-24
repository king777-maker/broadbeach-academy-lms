import * as XLSX from "xlsx";

/**
 * Cleanly format certificate records for Excel/CSV export
 */
export function exportToExcel(records, fileName = "broadbeach_certificates.xlsx", sheetName = "Certificates") {
  try {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(records);

    // Auto-fit column widths
    const colWidths = Object.keys(records[0] || {}).map((key) => {
      const maxLen = Math.max(
        key.length,
        ...records.map((r) => String(r[key] || "").length)
      );
      return { wch: Math.min(Math.max(maxLen + 3, 12), 50) };
    });
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
    return true;
  } catch (err) {
    console.error("Excel export error:", err);
    // Fallback to CSV if workbook export fails
    exportToCSV(records, fileName.replace(/\.xlsx$/, ".csv"));
    return false;
  }
}

/**
 * Universal UTF-8 BOM CSV Exporter
 */
export function exportToCSV(records, fileName = "broadbeach_certificates.csv") {
  if (!records || records.length === 0) return;

  const headers = Object.keys(records[0]);
  const rows = records.map((row) =>
    headers
      .map((header) => {
        const val = row[header] === null || row[header] === undefined ? "" : String(row[header]);
        const escaped = val.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(",")
  );

  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * PDF / Printable Registry Report
 */
export function printRegistryReport(title, headers, rows) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    window.print();
    return;
  }

  const dateStr = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} — Broadbeach Academy</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 30px; color: #1e293b; font-size: 11px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #131E4A; padding-bottom: 15px; margin-bottom: 20px; }
          .logo-text { font-size: 20px; font-weight: 900; color: #131E4A; letter-spacing: -0.5px; }
          .sub-text { font-size: 11px; color: #64748b; font-weight: 600; }
          .report-info { text-align: right; font-size: 10px; color: #64748b; }
          .stats { display: flex; gap: 20px; margin-bottom: 15px; font-size: 11px; font-weight: bold; }
          .stats span { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #131E4A; color: white; text-align: left; padding: 7px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; font-size: 10px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; }
          .badge-valid { background: #dcfce7; color: #15803d; }
          .badge-revoked { background: #ffe4e6; color: #be123c; }
          @media print {
            body { margin: 15px; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo-text">BROADBEACH ACADEMY</div>
            <div class="sub-text">Authoritative Professional Certification Registry</div>
          </div>
          <div class="report-info">
            <div><strong>Report:</strong> ${title}</div>
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Total Records:</strong> ${rows.length}</div>
          </div>
        </div>

        <div class="stats">
          <span>Total Records: ${rows.length}</span>
          <span>Security Protocol: ISO 17024 / SHA-256</span>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                ${r.map((cell) => `<td>${cell}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
