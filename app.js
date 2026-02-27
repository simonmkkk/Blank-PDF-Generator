/**
 * Blank PDF Generator
 * 使用 jsPDF (UMD) 在瀏覽器產生空白 PDF
 */

// jsPDF 在 UMD 模式下掛載於 window.jspdf.jsPDF
const { jsPDF } = window.jspdf;

// 各尺寸對應 jsPDF 格式名稱
const SIZE_MAP = {
  a3:     'a3',
  a4:     'a4',
  a5:     'a5',
  letter: 'letter',
  legal:  'legal',
  b5:     'b5',
};

function setStatus(msg, type = '') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status ' + type;
}

function generatePDF() {
  const sizeKey   = document.getElementById('pageSize').value;
  const pageCount = parseInt(document.getElementById('pageCount').value, 10);
  const margin    = parseFloat(document.getElementById('margin').value);
  const filename  = (document.getElementById('filename').value.trim() || 'blank') + '.pdf';
  const btn       = document.getElementById('generateBtn');

  // ===== 驗證 =====
  if (!pageCount || pageCount < 1 || pageCount > 9999) {
    setStatus('頁數請填 1 ~ 9999。', 'error');
    return;
  }
  if (isNaN(margin) || margin < 0 || margin > 100) {
    setStatus('邊界請填 0 ~ 100 mm。', 'error');
    return;
  }

  setStatus('產生中…');
  btn.disabled = true;

  // 使用 setTimeout 讓 UI 先更新再執行重任務
  setTimeout(() => {
    try {
      const format = SIZE_MAP[sizeKey] || 'a4';
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: format,
      });

      // 取得頁面寬高（mm）
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 若邊界 > 0，在每頁畫出邊界框（白底 + 灰框）
      const drawMarginBox = margin > 0;

      // 第 1 頁已自動建立，從第 2 頁起手動新增
      for (let i = 1; i <= pageCount; i++) {
        if (i > 1) doc.addPage(format, 'portrait');

        if (drawMarginBox) {
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.3);
          doc.rect(
            margin,
            margin,
            pageWidth  - margin * 2,
            pageHeight - margin * 2,
          );
        }
      }

      doc.save(filename);
      setStatus(`已下載：${filename}（${pageCount} 頁）`, 'success');
    } catch (err) {
      console.error(err);
      setStatus('產生失敗，請重試。', 'error');
    } finally {
      btn.disabled = false;
    }
  }, 50);
}
