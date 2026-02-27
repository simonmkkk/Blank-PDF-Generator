/**
 * Blank PDF Generator
 * 使用 jsPDF (UMD) 在瀏覽器產生空白 PDF
 */

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
  // 每次呼叫時才取得 jsPDF，確保 CDN 已載入
  if (!window.jspdf || !window.jspdf.jsPDF) {
    setStatus('PDF 函式庫尚未載入，請重新整理頁面。', 'error');
    return;
  }
  const { jsPDF } = window.jspdf;
  const sizeKey   = document.getElementById('pageSize').value;
  const pageCount = parseInt(document.getElementById('pageCount').value, 10);
  const filename  = (document.getElementById('filename').value.trim() || 'blank') + '.pdf';
  const btn       = document.getElementById('generateBtn');

  // ===== 驗證 =====
  if (!pageCount || pageCount < 1 || pageCount > 9999) {
    setStatus('頁數請填 1 ~ 9999。', 'error');
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

      // 第 1 頁已自動建立，從第 2 頁起手動新增
      for (let i = 2; i <= pageCount; i++) {
        doc.addPage(format, 'portrait');
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
