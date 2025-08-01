/**
 * 主题管理器 - 处理明暗主题切换
 * 符合Material Design 3规范
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.storageKey = 'privacy-policy-theme';
    this.themeToggleButton = null;
    
    this.init();
  }

  /**
   * 初始化主题管理器
   */
  init() {
    this.loadStoredTheme();
    this.setupThemeToggle();
    this.detectSystemTheme();
    this.applyTheme();
  }

  /**
   * 从本地存储加载主题设置
   */
  loadStoredTheme() {
    const storedTheme = localStorage.getItem(this.storageKey);
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      this.currentTheme = storedTheme;
    }
  }

  /**
   * 检测系统主题偏好
   */
  detectSystemTheme() {
    // 如果没有存储的主题偏好，使用系统主题
    if (!localStorage.getItem(this.storageKey)) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentTheme = 'dark';
      } else {
        this.currentTheme = 'light';
      }
    }

    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        // 只在没有手动设置主题时响应系统主题变化
        if (!localStorage.getItem(this.storageKey)) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme();
        }
      });
    }
  }

  /**
   * 设置主题切换按钮
   */
  setupThemeToggle() {
    this.themeToggleButton = document.getElementById('theme-toggle');
    if (this.themeToggleButton) {
      this.themeToggleButton.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  /**
   * 切换主题
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  /**
   * 应用主题到DOM
   */
  applyTheme() {
    const body = document.body;
    
    // 移除现有主题类
    body.classList.remove('light-theme', 'dark-theme');
    
    // 添加当前主题类
    body.classList.add(`${this.currentTheme}-theme`);
    
    // 更新主题切换按钮图标
    this.updateThemeToggleIcon();
    
    // 更新meta theme-color for mobile browsers
    this.updateThemeColor();
    
    // 触发主题变化事件
    this.dispatchThemeChangeEvent();
  }

  /**
   * 更新主题切换按钮图标
   */
  updateThemeToggleIcon() {
    if (!this.themeToggleButton) return;
    
    const icon = this.themeToggleButton.querySelector('.material-icons');
    if (icon) {
      icon.textContent = this.currentTheme === 'light' ? 'dark_mode' : 'light_mode';
    }
    
    // 更新按钮的aria-label
    const newLabel = this.currentTheme === 'light' ? '切换到暗夜模式' : '切换到日间模式';
    this.themeToggleButton.setAttribute('aria-label', newLabel);
  }

  /**
   * 更新移动浏览器的主题颜色
   */
  updateThemeColor() {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const color = this.currentTheme === 'light' ? '#36693d' : '#9dd49f';
      themeColorMeta.setAttribute('content', color);
    }
  }

  /**
   * 保存主题设置到本地存储
   */
  saveTheme() {
    localStorage.setItem(this.storageKey, this.currentTheme);
  }

  /**
   * 触发主题变化事件
   */
  dispatchThemeChangeEvent() {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: this.currentTheme
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * 获取当前主题
   * @returns {string} 当前主题 ('light' 或 'dark')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * 设置主题
   * @param {string} theme - 要设置的主题 ('light' 或 'dark')
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.currentTheme = theme;
      this.applyTheme();
      this.saveTheme();
    }
  }

  /**
   * 重置主题为系统默认
   */
  resetToSystemTheme() {
    localStorage.removeItem(this.storageKey);
    this.detectSystemTheme();
    this.applyTheme();
  }

  /**
   * 获取CSS自定义属性值
   * @param {string} property - CSS属性名
   * @returns {string} 属性值
   */
  getCSSCustomProperty(property) {
    return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
  }

  /**
   * 检查是否为深色主题
   * @returns {boolean} 是否为深色主题
   */
  isDarkTheme() {
    return this.currentTheme === 'dark';
  }

  /**
   * 检查是否为浅色主题
   * @returns {boolean} 是否为浅色主题
   */
  isLightTheme() {
    return this.currentTheme === 'light';
  }
}

// 创建全局主题管理器实例
window.themeManager = null;

// DOM加载完成后初始化主题管理器
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// 导出ThemeManager类（用于模块化环境）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}