(function() {
  // 全局初始化函数，可重复调用
  function initRuntime() {
    // 如果已经存在运行时间元素，则移除重新生成（避免重复）
    const oldEl = document.querySelector('.site-runtime');
    if (oldEl) oldEl.remove();

    // 1. 样式：匹配版权区配色+字体大小
    if (!document.getElementById('runtime-style')) {
      const style = document.createElement('style');
      style.id = 'runtime-style';
      style.textContent = `
        .site-runtime {
          display: inline-block !important;
          margin: 0 !important;
          padding: 0 !important;
          margin-right: 12px !important;
          font-size: 100% !important;
          line-height: inherit !important;
          font-family: inherit !important;
          vertical-align: middle !important;
        }
        .site-runtime .rt-text {
          color: #2c3e50 !important;
        }
        .site-runtime .rt-num {
          color: #0066cc !important;
          font-weight: 500 !important;
        }
        html[data-theme="dark"] .site-runtime .rt-text {
          color: #f0f0f0 !important;
        }
        html[data-theme="dark"] .site-runtime .rt-num {
          color: #80b0ff !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 2. 创建运行时间元素
    const runtimeEl = document.createElement('div');
    runtimeEl.className = 'site-runtime';

    // 3. 插入到版权区前方
    const copyrightEl = document.querySelector('.footer-copyright');
    if (copyrightEl) {
      copyrightEl.parentNode.insertBefore(runtimeEl, copyrightEl);
    } else {
      const footerOther = document.querySelector('.footer-other');
      if (footerOther) footerOther.prepend(runtimeEl);
      else return; // 如果找不到页脚元素，退出
    }

    // 4. 建站时间
    const buildDate = new Date(2026, 2, 23);

    // 5. 计算时间差
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

    // 6. 更新时间显示
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
    // 启动定时器（全局唯一，用标记防止多次 setInterval）
    if (!window.__runtimeInterval) {
      window.__runtimeInterval = setInterval(() => {
        const el = document.querySelector('.site-runtime');
        if (el) {
          const { years, months, days, h, m, s } = calcTimeDiff();
          el.innerHTML = `
            <span class="rt-text">⏱️ 本站已运行</span>
            <span class="rt-num"> ${years} </span><span class="rt-text">年</span>
            <span class="rt-num"> ${months} </span><span class="rt-text">月</span>
            <span class="rt-num"> ${days} </span><span class="rt-text">日</span>
            <span class="rt-num"> ${h} </span><span class="rt-text">时</span>
            <span class="rt-num"> ${m} </span><span class="rt-text">分</span>
            <span class="rt-num"> ${s} </span><span class="rt-text">秒</span>
          `;
        } else {
          // 如果元素不存在，清除定时器（避免内存泄漏）
          clearInterval(window.__runtimeInterval);
          window.__runtimeInterval = null;
        }
      }, 1000);
    }
  }

  // 将初始化函数挂载到全局，供 Pjax 调用
  window.initRuntime = initRuntime;

  // 首次加载时延迟执行（等待页脚渲染）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initRuntime, 200));
  } else {
    setTimeout(initRuntime, 200);
  }
})();