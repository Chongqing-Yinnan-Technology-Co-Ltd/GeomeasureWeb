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
        this.handleBackNavigation();
      });
    }
  }

  /**
   * 处理返回导航
   */
  handleBackNavigation() {
    try {
      console.log('返回按钮被点击');
      console.log('当前URL:', window.location.href);
      console.log('Referrer:', document.referrer);
      console.log('History length:', window.history.length);

      // 方法1: 尝试使用URL scheme返回到app (Android/iOS)
      if (this.isFromMobileApp()) {
        console.log('检测到来自移动应用，尝试返回到app');
        this.returnToApp();
        return;
      }

      // 方法2: 检查是否有上一页历史记录
      if (window.history.length > 1) {
        console.log('使用浏览器历史记录返回');
        window.history.back();
        return;
      }

      // 方法3: 尝试关闭窗口/标签页（在某些浏览器中可能受限）
      console.log('尝试关闭窗口');
      if (window.opener) {
        // 如果是弹出窗口，关闭自身
        window.close();
      } else {
        // 尝试关闭标签页（现代浏览器通常会阻止）
        window.close();
        
        // 如果关闭失败，显示提示
        setTimeout(() => {
          alert('请手动关闭此页面返回到应用');
        }, 100);
      }
    } catch (error) {
      console.error('返回导航失败:', error);
      // 备用方案：显示提示信息
      alert('请手动关闭此页面返回到应用');
    }
  }

  /**
   * 检测是否来自移动应用
   */
  isFromMobileApp() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    const isMobile = isAndroid || isIOS;
    const hasAppParams = window.location.search.includes('lang=');
    
    console.log('移动设备检测:', {
      userAgent,
      isAndroid,
      isIOS, 
      isMobile,
      hasAppParams
    });

    // 如果是移动设备且URL中有语言参数，可能来自app
    return isMobile && hasAppParams;
  }

  /**
   * 返回到移动应用
   */
  returnToApp() {
    // 尝试使用自定义URL scheme返回到app
    const appSchemes = [
      'geomeasure://',
      'com.geomeasure://',
      'app://'
    ];

    for (const scheme of appSchemes) {
      try {
        console.log('尝试URL scheme:', scheme);
        window.location.href = scheme;
        
        // 如果在短时间内没有跳转，说明scheme不可用
        setTimeout(() => {
          console.log('URL scheme可能不可用，尝试其他方法');
        }, 500);
        
        break; // 只尝试第一个scheme
      } catch (error) {
        console.error('URL scheme失败:', scheme, error);
      }
    }

    // 备用方案：尝试使用postMessage通知app
    try {
      if (window.parent && window.parent !== window) {
        console.log('尝试向parent发送postMessage');
        window.parent.postMessage({
          type: 'privacy_policy_back',
          action: 'close'
        }, '*');
      }
    } catch (error) {
      console.error('postMessage失败:', error);
    }

    // 最后的备用方案：在移动设备上尝试关闭
    setTimeout(() => {
      if (this.isFromMobileApp()) {
        window.close();
      }
    }, 1000);
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