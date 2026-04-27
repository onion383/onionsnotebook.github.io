(function() {
  // 高亮文本节点，完全不破坏 DOM 结构
  function highlightTextNodes(container, keyword) {
    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(safeKeyword, 'gi');

    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // 已经在高亮 span 中，不重复处理
          if (
            node.parentNode.tagName === 'SPAN' &&
            node.parentNode.classList.contains('search-highlight')
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          // 跳过 SVG 或 MathML 内部，保护公式、思维导图
          if (node.parentNode.closest && node.parentNode.closest('svg, math')) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToReplace = [];
    let node;
    while ((node = walker.nextNode())) {
      regex.lastIndex = 0;
      if (regex.test(node.nodeValue)) {
        nodesToReplace.push(node);
      }
    }

    // 替换文本节点为 文本+高亮span 的结构
    for (let i = 0; i < nodesToReplace.length; i++) {
      const textNode = nodesToReplace[i];
      const text = textNode.nodeValue;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      regex.lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // 匹配前的普通文本
        if (match.index > lastIndex) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex, match.index))
          );
        }
        // 高亮词
        const span = document.createElement('span');
        span.className = 'search-highlight';
        span.textContent = match[0];
        fragment.appendChild(span);
        lastIndex = regex.lastIndex;

        // 避免空匹配导致死循环
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
      // 剩余尾部文本
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      textNode.parentNode.replaceChild(fragment, textNode);
    }
  }

  function applySearchHighlight() {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('highlight');
    if (!keyword) return;

    const container = document.getElementById('article-container');
    if (!container) return;

    // 相同关键词不重复高亮
    if (container.dataset.highlighted === keyword) return;
    container.dataset.highlighted = keyword;

    highlightTextNodes(container, keyword);

    // 自动定位到第一个高亮词
    const target = document.querySelector('.search-highlight');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // 兼容 Pjax
  window.applySearchHighlight = applySearchHighlight;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySearchHighlight);
  } else {
    applySearchHighlight();
  }
})();

/*
(function() {
  function bindCategoryFilter() {
    var filterBar = document.getElementById('category-filter-bar');
    if (!filterBar) return;
    var items = filterBar.querySelectorAll('.category-filter-item');
    // 注意：页面中可能有两个 id="recent-posts" 的容器，这里使用选择器获取文章卡片
    var postsContainer = document.querySelector('#recent-posts .recent-post-items') || document.getElementById('recent-posts');
    if (!postsContainer) return;
    var postItems = postsContainer.querySelectorAll('.recent-post-item');

    function doFilter(category) {
      postItems.forEach(function(item) {
        if (category === 'all') {
          item.style.display = '';
        } else {
          var catLink = item.querySelector('.article-meta__categories');
          if (catLink) {
            var catName = catLink.textContent.trim();
            item.style.display = (catName === category) ? '' : 'none';
          } else {
            item.style.display = 'none';
          }
        }
      });

      // 更新激活样式
      items.forEach(function(el) { el.classList.remove('active'); });
      var activeEl = filterBar.querySelector('[data-category="' + category + '"]');
      if (activeEl) activeEl.classList.add('active');

      // 筛选后隐藏分页组件，避免混淆
      var pagination = document.querySelector('#pagination');
      if (pagination) {
        pagination.style.display = (category === 'all') ? '' : 'none';
      }
    }

    items.forEach(function(item) {
      item.addEventListener('click', function(e) {
        var cat = this.getAttribute('data-category');
        doFilter(cat);
      });
    });

    // 支持 Pjax 后重新绑定
    window.bindCategoryFilter = bindCategoryFilter;
  }

  // 首次绑定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCategoryFilter);
  } else {
    bindCategoryFilter();
  }

  // Pjax 完成重新绑定
  document.addEventListener('pjax:complete', bindCategoryFilter);
})();
*/