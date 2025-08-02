/**
 * 隐私政策页面特定功能
 */
class PrivacyPolicyManager {
  constructor() {
    this.init();
  }

  /**
   * 初始化隐私政策页面功能
   */
  init() {
    this.setupBackButton();
    this.setupModalCloseOnEscape();
    this.setupSmoothScrolling();
  }

  /**
   * 设置返回按钮
   */
  setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        // 尝试通过postMessage通知Flutter应用关闭WebView
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'privacy_policy_close',
              action: 'back'
            }, '*');
          }
        } catch (e) {
          console.log('PostMessage to parent failed:', e);
        }
        
        // 尝试通过Flutter WebView接口关闭
        try {
          if (window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('closeWebView');
          }
        } catch (e) {
          console.log('Flutter WebView handler not available:', e);
        }
        
        // 尝试使用其他可能的Flutter通信方式
        try {
          if (window.FlutterWebView) {
            window.FlutterWebView.postMessage('close');
          }
        } catch (e) {
          console.log('Flutter WebView postMessage not available:', e);
        }
        
        // 备用方案：检查是否有上一页历史记录
        setTimeout(() => {
          if (window.history.length > 1 && document.referrer) {
            window.history.back();
          } else {
            // 最后的备用方案：尝试关闭窗口
            window.close();
          }
        }, 100);
      });
    }
  }

  /**
   * 设置ESC键关闭模态框
   */
  setupModalCloseOnEscape() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('language-modal');
        if (modal && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      }
    });
  }

  /**
   * 设置平滑滚动
   */
  setupSmoothScrolling() {
    // 为所有内部链接添加平滑滚动
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * 处理外部链接
   */
  handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"]');
    externalLinks.forEach(link => {
      // 为外部链接添加target="_blank"和安全属性
      if (link.href.startsWith('http')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * 添加阅读进度指示器
   */
  addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: var(--md-sys-color-primary);
      z-index: 1000;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const progress = (scrollTop / documentHeight) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
  }

  /**
   * 格式化日期显示
   */
  formatDates() {
    const dateElements = document.querySelectorAll('[data-date]');
    dateElements.forEach(element => {
      const dateString = element.getAttribute('data-date');
      if (dateString) {
        const date = new Date(dateString);
        const currentLang = window.languageManager?.getCurrentLanguage() || 'en';
        const locale = currentLang === 'zh' ? 'zh-CN' : 'en-US';
        
        const formattedDate = date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        element.textContent = formattedDate;
      }
    });
  }

  /**
   * 添加复制链接功能
   */
  addCopyLinkFeature() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const title = section.querySelector('h2');
      if (title) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-link-button';
        copyButton.innerHTML = '<span class="material-icons">link</span>';
        copyButton.title = 'Copy link to this section';
        copyButton.style.cssText = `
          opacity: 0;
          margin-left: 8px;
          background: none;
          border: none;
          color: var(--md-sys-color-on-surface-variant);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        `;

        copyButton.addEventListener('click', async () => {
          const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
          try {
            await navigator.clipboard.writeText(url);
            copyButton.innerHTML = '<span class="material-icons">check</span>';
            setTimeout(() => {
              copyButton.innerHTML = '<span class="material-icons">link</span>';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy link:', err);
          }
        });

        title.appendChild(copyButton);

        // 鼠标悬停时显示复制按钮
        title.addEventListener('mouseenter', () => {
          copyButton.style.opacity = '1';
        });
        title.addEventListener('mouseleave', () => {
          copyButton.style.opacity = '0';
        });
      }
    });
  }
}

// 创建全局实例
window.privacyPolicyManager = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  window.privacyPolicyManager = new PrivacyPolicyManager();
  
  // 添加额外功能
  window.privacyPolicyManager.handleExternalLinks();
  window.privacyPolicyManager.addReadingProgress();
  
  // 监听语言变化事件，更新日期格式
  document.addEventListener('themechange', () => {
    window.privacyPolicyManager.formatDates();
  });
});