// 搜索跳转高亮 + 蓝色闪烁动画（最终稳定版，适配自定义root）
document.addEventListener('DOMContentLoaded', function () {
  // 1. 从URL获取高亮关键词（兼容所有路径）
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('highlight');
  if (!keyword) return;

  // 2. 定位文章内容区域
  const articleContainer = document.getElementById('article-container');
  if (!articleContainer) return;

  // 3. 构造安全正则（避免特殊字符报错）
  const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(safeKeyword, 'gi');

  // 4. 给所有关键词添加高亮标签
  articleContainer.innerHTML = articleContainer.innerHTML.replace(regex, (match) => {
    return `<span class="search-highlight-flash">${match}</span>`;
  });

  // 5. 延迟执行：滚动到关键词 + 强制触发闪烁动画
  setTimeout(() => {
    const firstHighlight = document.querySelector('.search-highlight-flash');
    if (firstHighlight) {
      // 平滑滚动到关键词（居中显示，避免被导航栏遮挡）
      firstHighlight.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      // 强制浏览器重绘，100%触发闪烁动画（解决动画不生效的核心）
      void firstHighlight.offsetHeight;
      firstHighlight.classList.add('flash');
    }
  }, 400);
});