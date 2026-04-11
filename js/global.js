// 搜索跳转高亮 + 闪烁动画（最终无坑版）
document.addEventListener('DOMContentLoaded', function () {
  // 获取关键词
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('highlight');
  if (!keyword) return;

  const article = document.getElementById('article-container');
  if (!article) return;

  // 构造安全正则
  const safeKey = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeKey, 'gi');

  // 给关键词套高亮标签
  article.innerHTML = article.innerHTML.replace(regex, (txt) => {
    return `<span class="search-highlight-flash">${txt}</span>`;
  });

  // 延迟滚动 + 强制触发闪烁
  setTimeout(() => {
    const first = document.querySelector('.search-highlight-flash');
    if (first) {
      // 平滑跳到中间
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // 强制重绘触发动画（关键！解决动画不生效）
      void first.offsetHeight;
      first.classList.add('flash');
    }
  }, 400);
});