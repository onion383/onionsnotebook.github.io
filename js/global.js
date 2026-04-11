// 搜索高亮 + 自动定位（极简版，必生效）
window.addEventListener('load', function () {
  const keyword = new URLSearchParams(window.location.search).get('highlight');
  if (!keyword) return;

  const container = document.getElementById('article-container');
  if (!container) return;

  // 高亮关键词
  const reg = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  container.innerHTML = container.innerHTML.replace(reg, '<span class="search-highlight">$&</span>');

  // 自动定位
  const target = document.querySelector('.search-highlight');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});