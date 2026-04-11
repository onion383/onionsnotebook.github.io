// 运行时间统计 - 字体大小完美匹配版
setTimeout(() => {
  // 1. 样式：100%匹配版权区配色+字体大小，自动适配日间/夜间
  const style = document.createElement('style');
  style.textContent = `
    /* 运行时间容器：强制字体大小和版权区完全一致 */
    .site-runtime {
      display: inline-block !important;
      margin: 0 !important;
      padding: 0 !important;
      margin-right: 12px !important;
      /* 核心修复：字体大小强制100%，和版权文字一模一样大 */
      font-size: 100% !important;
      line-height: inherit !important;
      font-family: inherit !important;
      vertical-align: middle !important;
    }

    /* 文字颜色：完全匹配版权区普通文字 */
    .site-runtime .rt-text {
      color: #2c3e50 !important;
    }

    /* 数字颜色：完全匹配版权区版本号蓝色 */
    .site-runtime .rt-num {
      color: #0066cc !important;
      font-weight: 500 !important;
    }

    /* 夜间模式自动适配 */
    html[data-theme="dark"] .site-runtime .rt-text {
      color: #f0f0f0 !important;
    }
    html[data-theme="dark"] .site-runtime .rt-num {
      color: #80b0ff !important;
    }
  `;
  document.head.appendChild(style);

  // 2. 创建运行时间元素
  const runtimeEl = document.createElement('div');
  runtimeEl.className = 'site-runtime';

  // 3. 插入到版权区前方
  const copyrightEl = document.querySelector('.footer-copyright');
  if (copyrightEl) {
    copyrightEl.parentNode.insertBefore(runtimeEl, copyrightEl);
  } else {
    const footerOther = document.querySelector('.footer-other');
    footerOther?.prepend(runtimeEl);
  }

  // 4. 建站时间
  const buildDate = new Date(2026, 2, 23);

  // 5. 计算年月日时分秒
  function calcTimeDiff() {
    const now = new Date();
    let diff = now - buildDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    diff -= years * 1000 * 60 * 60 * 24 * 365;

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    diff -= months * 1000 * 60 * 60 * 24 * 30;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * 1000 * 60;

    const seconds = Math.floor(diff / 1000);

    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    return { years, months, days, h, m, s };
  }

  // 6. 更新时间（数字前后带空格）
  function updateRuntime() {
    const { years, months, days, h, m, s } = calcTimeDiff();
    runtimeEl.innerHTML = `
      <span class="rt-text">⏱️ 本站已运行</span>
      <span class="rt-num"> ${years} </span><span class="rt-text">年</span>
      <span class="rt-num"> ${months} </span><span class="rt-text">月</span>
      <span class="rt-num"> ${days} </span><span class="rt-text">日</span>
      <span class="rt-num"> ${h} </span><span class="rt-text">时</span>
      <span class="rt-num"> ${m} </span><span class="rt-text">分</span>
      <span class="rt-num"> ${s} </span><span class="rt-text">秒</span>
    `;
  }

  updateRuntime();
  setInterval(updateRuntime, 1000);
}, 200);