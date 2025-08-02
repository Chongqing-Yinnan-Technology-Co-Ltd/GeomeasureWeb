/**
 * 语言管理器 - 支持与Flutter应用语言同步
 */
class LanguageManager {
  constructor() {
    this.currentLanguage = 'en'; // 默认英文
    this.storageKey = 'privacy-policy-language';
    this.translations = {};
    
    // Flutter应用支持的语言列表 (来自LocaleService)
    this.supportedLanguages = [
      'zh', 'zh-TW', 'zh-HK', 'en', 'es', 'fr', 'de', 'ja', 'ko', 
      'pt', 'ru', 'ar', 'hi', 'bn', 'ur', 'id'
    ];
    
    this.initDebugConsole(); // 初始化调试控制台（手机端查看日志）
    this.init();
  }
  
  /**
   * 检测是否为调试模式
   */
  isDebugMode() {
    // 检查URL参数
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
      return true;
    }
    
    // 检查localStorage设置
    if (localStorage.getItem('privacy_policy_debug') === 'true') {
      return true;
    }
    
    // 检查是否为本地开发环境
    const isLocal = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.port !== '';
    
    // 检查是否为开发者工具打开状态
    const devToolsOpen = window.outerHeight - window.innerHeight > 200 ||
                        window.outerWidth - window.innerWidth > 200;
    
    // 本地环境或开发者工具打开时显示调试控制台
    return isLocal || devToolsOpen;
  }
  
  /**
   * 初始化页面内调试控制台（用于手机调试）
   */
  initDebugConsole() {
    // 检查是否为调试模式
    if (!this.isDebugMode()) {
      return; // 生产模式下不显示调试控制台
    }
    
    // 创建调试控制台容器
    const debugConsole = document.createElement('div');
    debugConsole.id = 'debug-console';
    debugConsole.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 40vh;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 10px;
      overflow-y: auto;
      z-index: 10000;
      border-top: 2px solid #333;
      display: none;
    `;
    
    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 5px;
      border-bottom: 1px solid #333;
    `;
    
    const title = document.createElement('span');
    title.textContent = '🔧 语言检测调试日志';
    title.style.color = '#ffffff';
    title.style.fontWeight = 'bold';
    
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 10px;
      align-items: center;
    `;
    
    // 复制日志按钮
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.title = '复制所有日志';
    copyBtn.style.cssText = `
      background: none;
      border: none;
      color: #00ddff;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 5px;
      border-radius: 3px;
    `;
    copyBtn.onclick = () => {
      this.copyLogsToClipboard();
    };
    
    // 清空日志按钮
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️';
    clearBtn.title = '清空日志';
    clearBtn.style.cssText = `
      background: none;
      border: none;
      color: #ffaa00;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 5px;
      border-radius: 3px;
    `;
    clearBtn.onclick = () => {
      this.clearDebugLogs();
    };
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '❌';
    closeBtn.title = '关闭调试控制台';
    closeBtn.style.cssText = `
      background: none;
      border: none;
      color: #ff6666;
      cursor: pointer;
      font-size: 16px;
      padding: 2px 5px;
      border-radius: 3px;
    `;
    closeBtn.onclick = () => {
      debugConsole.style.display = 'none';
    };
    
    buttonContainer.appendChild(copyBtn);
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(closeBtn);
    
    titleBar.appendChild(title);
    titleBar.appendChild(buttonContainer);
    
    // 创建日志内容区域
    const logContent = document.createElement('div');
    logContent.id = 'debug-log-content';
    logContent.style.cssText = `
      white-space: pre-wrap;
      word-break: break-all;
    `;
    
    debugConsole.appendChild(titleBar);
    debugConsole.appendChild(logContent);
    document.body.appendChild(debugConsole);
    
    // 创建显示调试控制台的按钮
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🔧';
    debugBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #ff6600;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    debugBtn.onclick = () => {
      debugConsole.style.display = debugConsole.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(debugBtn);
    
    // 重写console.log来同时显示在页面上
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      originalConsoleLog.apply(console, args);
      this.addDebugLog('LOG', args.join(' '));
    };
    
    // 重写console.warn
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      originalConsoleWarn.apply(console, args);
      this.addDebugLog('WARN', args.join(' '), '#ffaa00');
    };
    
    // 重写console.error
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      this.addDebugLog('ERROR', args.join(' '), '#ff6666');
    };
  }
  
  /**
   * 添加调试日志到页面显示
   */
  addDebugLog(level, message, color = '#00ff00') {
    const logContent = document.getElementById('debug-log-content');
    if (logContent) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = document.createElement('div');
      logEntry.style.cssText = `
        margin-bottom: 2px;
        color: ${color};
      `;
      logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="color: #fff;">[${level}]</span> ${message}`;
      logContent.appendChild(logEntry);
      logContent.scrollTop = logContent.scrollHeight;
      
      // 限制日志条数，避免内存溢出
      if (logContent.children.length > 100) {
        logContent.removeChild(logContent.firstChild);
      }
    }
  }
  
  /**
   * 复制所有调试日志到剪贴板
   */
  async copyLogsToClipboard() {
    const logContent = document.getElementById('debug-log-content');
    if (!logContent) {
      this.showNotification('❌ 未找到日志内容', '#ff6666');
      return;
    }
    
    try {
      // 提取所有日志文本
      const logLines = [];
      const logEntries = logContent.children;
      
      if (logEntries.length === 0) {
        this.showNotification('📋 暂无日志可复制', '#ffaa00');
        return;
      }
      
      for (let i = 0; i < logEntries.length; i++) {
        const entry = logEntries[i];
        const text = entry.textContent || entry.innerText;
        logLines.push(text);
      }
      
      const logText = logLines.join('\n');
      
      // 尝试使用现代剪贴板API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(logText);
        this.showNotification('✅ 日志已复制到剪贴板', '#00ff00');
      } else {
        // 回退到传统方法
        const textArea = document.createElement('textarea');
        textArea.value = logText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          this.showNotification('✅ 日志已复制到剪贴板', '#00ff00');
        } catch (err) {
          this.showNotification('❌ 复制失败，请手动选择文本', '#ff6666');
        }
        
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('复制日志失败:', error);
      this.showNotification('❌ 复制失败: ' + error.message, '#ff6666');
    }
  }
  
  /**
   * 清空调试日志
   */
  clearDebugLogs() {
    const logContent = document.getElementById('debug-log-content');
    if (logContent) {
      logContent.innerHTML = '';
      this.showNotification('🗑️ 日志已清空', '#ffaa00');
    }
  }
  
  /**
   * 显示操作通知
   */
  showNotification(message, color = '#00ff00') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: ${color};
      padding: 10px 15px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      z-index: 10001;
      border: 1px solid ${color};
      animation: fadeInOut 3s ease-in-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 添加动画样式
    if (!document.getElementById('notification-keyframes')) {
      const style = document.createElement('style');
      style.id = 'notification-keyframes';
      style.textContent = `
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * 初始化语言管理器
   */
  init() {
    this.loadTranslations();
    this.detectAppLanguage();
    this.loadStoredLanguage();
    this.setupLanguageToggle();
    this.applyLanguage();
  }

  /**
   * 加载翻译数据
   */
  loadTranslations() {
    this.translations = {
      zh: {
        privacy_policy_title: '隐私政策',
        select_language: '选择语言',
        effective_date: '生效日期: 2025年8月1日',
        introduction_title: '引言',
        introduction_content: '欢迎使用我们的应用程序。本隐私政策说明重庆银南科技有限公司（"我们"、"我们的"或"我们"）在您使用我们的移动应用程序、网站和相关服务（统称"服务"）时如何收集、使用、存储和披露您的信息。<br><br>您的隐私对我们至关重要。本政策旨在帮助您了解您的隐私权以及我们如何保护您的数据。通过访问或使用我们的服务，您表示您已阅读、理解并同意我们按照本隐私政策和使用条款中所述收集、存储、使用和披露您的个人信息。',
        info_collect_title: '1. 我们收集的信息',
        info_collect_intro: '为了提供和改进我们的服务，我们通过多种方式收集信息。',
        info_direct_title: 'A. 您直接提供给我们的信息',
        info_direct_content: '当您创建帐户、联系我们寻求支持或以其他方式使用服务时，我们可能会收集以下个人信息：<br><br><strong>帐户信息：</strong>您的姓名、电子邮件地址、电话号码。<br><strong>用户内容：</strong>您在使用服务时创建、导入或上传的照片、笔记和其他信息。<br><strong>社交网络信息：</strong>如果您选择通过社交网络登录，我们可能会从您的社交网络个人资料中接收信息，取决于您在该平台上的隐私设置。<br><strong>地理位置数据：</strong>在您明确同意的情况下，我们可能会收集您的精确位置（GPS数据）以提供基于位置的功能。您可以随时在设备设置中禁用此功能。',
        info_auto_title: 'B. 我们自动收集的信息',
        info_auto_content: '当您使用我们的服务时，我们会自动从您的设备收集某些技术信息：<br><br><strong>设备信息：</strong>设备类型、硬件型号、操作系统及版本、唯一设备标识符（UDI）和设备设置。<br><strong>使用数据：</strong>关于您如何与我们的服务交互的信息，例如使用的功能、使用频率、崩溃报告和性能数据。我们通过cookie或类似技术收集这些信息，以改善我们服务的稳定性和功能。<br><br>这些自动收集的信息通常是聚合的或去标识化的，不用于个人身份识别。',
        info_use_title: '2. 我们如何使用您的信息',
        info_use_content: '我们将收集的信息用于以下目的：<br><br><strong>提供和维护服务：</strong>创建您的帐户，提供核心功能，并确保我们的服务正常运行。<br><strong>改进和个性化服务：</strong>了解我们的用户如何与服务交互，提供更个性化的体验，并开发新功能。<br><strong>与您沟通：</strong>向您发送技术通知、安全警报、更新、营销材料，并回应您的意见、问题和客户服务请求。<br><strong>安全和保障：</strong>调查和防止欺诈交易、未经授权的访问和其他非法活动，并执行我们的使用条款。',
        info_share_title: '3. 我们如何分享您的信息',
        info_share_intro: '我们不出售您的个人信息。我们仅在以下情况下与第三方分享您的信息：',
        third_party_title: 'A. 与第三方服务提供商',
        third_party_content: '我们与第三方合作伙伴合作，帮助我们运营、提供、改进和营销我们的服务。这些合作伙伴有合同义务保护您的数据，并且仅限于将其用于我们指定的目的。我们可能与以下服务分享信息：<br><br><strong>分析和崩溃报告：</strong>帮助我们了解使用模式并修复错误。<br>示例：Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>广告：</strong>在我们的应用中显示广告。这些服务可能收集设备标识符以显示个性化广告。您通常可以在设备设置中选择退出个性化广告。<br>示例：AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle 等<br><br><strong>云托管：</strong>安全存储您的数据。<br>示例：Amazon Web Services (AWS)<br><br>这些第三方服务符合GDPR等主要数据保护法规。我们鼓励您查看他们的隐私政策以了解他们的数据处理做法。',
        legal_reasons_title: 'B. 出于法律原因和保护我们的权利',
        legal_reasons_content: '如果我们认为法律、传票或其他法律程序要求，或者我们有充分理由相信披露对于以下目的是合理必要的，我们可能会披露您的信息：(i) 保护任何人的安全，(ii) 解决欺诈、安全或技术问题，或 (iii) 保护我们的权利或财产。',
        with_consent_title: 'C. 经您同意',
        with_consent_content: '我们可能在获得您明确同意的情况下为其他目的分享您的信息。例如，您可能选择将我们应用中的内容分享到其他平台，如您的电子邮件或社交媒体帐户。',
        your_rights_title: '4. 您的权利和选择',
        your_rights_content: '我们相信让您控制自己的信息。您对个人数据拥有以下权利：<br><br><strong>访问和更正权：</strong>您可以直接在应用设置中访问和更新大部分帐户信息。对于您无法自己访问的任何信息，您可以联系我们。<br><strong>删除权（擦除）：</strong>您可以请求删除您的帐户和相关个人数据。请注意，由于技术原因，从我们的备份系统中完全擦除可能需要长达90天。<br><strong>反对处理权：</strong>您有权反对我们为某些目的处理您的个人数据，例如直接营销。<br><strong>数据可携带权：</strong>您可能有权以结构化、机器可读的格式接收您的个人数据副本。<br><strong>撤回同意权：</strong>在我们依赖您的同意处理信息的情况下（如地理位置），您可以随时撤回同意。<br><br>要行使这些权利中的任何一项，请通过 sven775288@gmail.com 联系我们。我们将在30天内回复您的请求。为了保护您，我们可能要求您在我们处理您的请求之前验证您的身份。',
        data_security_title: '5. 数据安全',
        data_security_content: '我们实施强大的管理、技术和物理安全措施来保护您的信息免受丢失、盗窃、误用和未经授权的访问。这些措施包括：<br><br>传输中（SSL/TLS）和静态数据的加密。<br>严格的访问控制，确保只有必要的人员才能访问您的数据。<br>定期安全评估和漏洞扫描。<br><br>然而，没有安全系统是无懈可击的。虽然我们努力保护您的数据，但我们无法保证其绝对安全。',
        data_transfers_title: '6. 国际数据传输',
        data_transfers_content: '我们的服务由Amazon Web Services (AWS)托管，您的信息可能在世界各国的服务器上存储和处理。通过使用我们的服务，您理解并同意将您的信息传输、处理和存储到您居住国之外的国家，这些国家可能有不同的数据保护规则。',
        children_privacy_title: '7. 儿童隐私',
        children_privacy_content: '我们的服务不适用于或针对16岁以下的儿童（或相关司法管辖区的等效最低年龄）。我们不会故意收集儿童的个人信息。如果我们得知我们收集了儿童的个人信息，我们将尽快采取措施删除该信息。',
        policy_changes_title: '8. 本隐私政策的变更',
        policy_changes_content: '我们可能会不时更新本隐私政策。如果我们进行重大变更，我们将通过应用、电子邮件通知您，或要求您在继续使用服务之前查看并接受新版本。',
        contact_title: '9. 联系我们',
        contact_content: '如果您对本隐私政策有任何问题、疑虑或反馈，请随时联系我们。<br><br><strong>公司名称：</strong>重庆银南科技有限公司<br><strong>电子邮件：</strong><a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>地址：</strong>中国重庆市两江新区鱼嘴镇河旭路172号5号楼2楼',
        terms_of_service: '服务条款',
        contact_us: '联系我们'
      },
      en: {
        privacy_policy_title: 'Privacy Policy',
        select_language: 'Select Language',
        effective_date: 'Effective Date: August 1, 2025',
        introduction_title: 'Introduction',
        introduction_content: 'Welcome to our application. This Privacy Policy explains how Chongqing Yinnan Technology Co., Ltd. ("we," "us," or "our") collects, uses, stores, and discloses your information when you use our mobile applications, websites, and related services (collectively, the "Services").<br><br>Your privacy is critically important to us. This policy is designed to help you understand your privacy rights and how we protect your data. By accessing or using our Services, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Use.',
        info_collect_title: '1. Information We Collect',
        info_collect_intro: 'To provide and improve our Services, we collect information in several ways.',
        info_direct_title: 'A. Information You Provide to Us Directly',
        info_direct_content: 'When you create an account, contact us for support, or otherwise use the Services, we may collect the following personal information:<br><br><strong>Account Information:</strong> Your name, email address, phone number.<br><strong>User Content:</strong> Photos, notes, and other information you create, import, or upload while using the Services.<br><strong>Social Network Information:</strong> If you choose to log in via a social network, we may receive information from your social network profile, subject to your privacy settings on that platform.<br><strong>Geolocation Data:</strong> We may collect your precise location (GPS data) with your explicit consent to provide location-based features. You can disable this at any time in your device settings.',
        info_auto_title: 'B. Information We Collect Automatically',
        info_auto_content: 'When you use our Services, we automatically collect certain technical information from your device:<br><br><strong>Device Information:</strong> Type of device, hardware model, operating system and version, unique device identifiers (UDIs), and device settings.<br><strong>Usage Data:</strong> Information about how you interact with our Services, such as features used, frequency of use, crash reports, and performance data. We collect this via cookies or similar technologies to improve the stability and functionality of our Services.<br><br>This automatically collected information is typically aggregated or de-identified and is not used to personally identify you.',
        info_use_title: '2. How We Use Your Information',
        info_use_content: 'We use the information we collect for the following purposes:<br><br><strong>To Provide and Maintain the Services:</strong> To create your account, provide core features, and ensure our Services are working correctly.<br><strong>To Improve and Personalize the Services:</strong> To understand how our users interact with the Services, deliver a more personalized experience, and develop new features.<br><strong>To Communicate with You:</strong> To send you technical notices, security alerts, updates, marketing materials, and to respond to your comments, questions, and customer service requests.<br><strong>For Safety and Security:</strong> To investigate and prevent fraudulent transactions, unauthorized access, and other illegal activities, and to enforce our Terms of Use.',
        info_share_title: '3. How We Share Your Information',
        info_share_intro: 'We do not sell your personal information. We only share your information with third parties in the following circumstances:',
        third_party_title: 'A. With Third-Party Service Providers',
        third_party_content: 'We work with third-party partners to help us operate, provide, improve, and market our Services. These partners are contractually obligated to protect your data and are restricted to using it only for the purposes we specify. We may share information with services for:<br><br><strong>Analytics and Crash Reporting:</strong> To help us understand usage patterns and fix bugs.<br>Examples: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Advertising:</strong> To display advertisements within our app. These services may collect device identifiers to show personalized ads. You can typically opt-out of personalized advertising in your device settings.<br>Examples: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, etc.<br><br><strong>Cloud Hosting:</strong> To store your data securely.<br>Example: Amazon Web Services (AWS)<br><br>These third-party services are compliant with major data protection regulations like GDPR. We encourage you to review their privacy policies to understand their data practices.',
        legal_reasons_title: 'B. For Legal Reasons and to Protect Our Rights',
        legal_reasons_content: 'We may disclose your information if we believe it\'s required by law, subpoena, or other legal process, or if we have a good faith belief that disclosure is reasonably necessary to (i) protect the safety of any person, (ii) address fraud, security, or technical issues, or (iii) protect our rights or property.',
        with_consent_title: 'C. With Your Consent',
        with_consent_content: 'We may share your information for other purposes with your explicit consent. For example, you may choose to share content from our app to other platforms like your email or social media accounts.',
        your_rights_title: '4. Your Rights and Choices',
        your_rights_content: 'We believe in giving you control over your information. You have the following rights regarding your personal data:<br><br><strong>Right to Access and Correct:</strong> You can access and update most of your account information directly within the app\'s settings. For any information you cannot access yourself, you can contact us.<br><strong>Right to Deletion (Erasure):</strong> You can request the deletion of your account and associated personal data. Please note that for technical reasons, complete erasure from our backup systems may take up to 90 days.<br><strong>Right to Object to Processing:</strong> You have the right to object to us processing your personal data for certain purposes, such as direct marketing.<br><strong>Right to Data Portability:</strong> You may have the right to receive a copy of your personal data in a structured, machine-readable format.<br><strong>Right to Withdraw Consent:</strong> Where we rely on your consent to process information (like for geolocation), you can withdraw it at any time.<br><br>To exercise any of these rights, please contact us at sven775288@gmail.com. We will respond to your request within 30 days. For your protection, we may require you to verify your identity before we process your request.',
        data_security_title: '5. Data Security',
        data_security_content: 'We implement robust administrative, technical, and physical security measures to protect your information from loss, theft, misuse, and unauthorized access. These measures include:<br><br>Encryption of data in transit (SSL/TLS) and at rest.<br>Strict access controls to ensure only necessary personnel can access your data.<br>Regular security assessments and vulnerability scanning.<br><br>However, no security system is impenetrable. While we strive to protect your data, we cannot guarantee its absolute security.',
        data_transfers_title: '6. International Data Transfers',
        data_transfers_content: 'Our Services are hosted by Amazon Web Services (AWS), and your information may be stored and processed on servers located in various countries around the world. By using our Services, you understand and consent to the transfer, processing, and storage of your information in countries outside of your country of residence, which may have different data protection rules.',
        children_privacy_title: '7. Children\'s Privacy',
        children_privacy_content: 'Our Services are not intended for or directed to children under the age of 16 (or the equivalent minimum age in the relevant jurisdiction). We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete that information as quickly as possible.',
        policy_changes_title: '8. Changes to This Privacy Policy',
        policy_changes_content: 'We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the app, by email, or by requiring you to review and accept the new version before continuing to use the Services.',
        contact_title: '9. Contact Us',
        contact_content: 'If you have any questions, concerns, or feedback about this Privacy Policy, please do not hesitate to contact us.<br><br><strong>Company Name:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>Email:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Address:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Terms of Service',
        contact_us: 'Contact Us'
      },
      ar: {
        privacy_policy_title: 'سياسة الخصوصية',
        select_language: 'اختر اللغة',
        effective_date: 'تاريخ السريان: 1 أغسطس 2025',
        introduction_title: 'مقدمة',
        introduction_content: 'مرحبًا بك في تطبيقنا. تشرح سياسة الخصوصية هذه كيف تقوم شركة Chongqing Yinnan Technology Co., Ltd. ("نحن"، "لنا"، أو "خاصتنا") بجمع واستخدام وتخزين والكشف عن معلوماتك عند استخدامك لتطبيقاتنا المحمولة ومواقعنا الإلكترونية والخدمات ذات الصلة (يُشار إليها مجتمعة بـ "الخدمات").<br><br>خصوصيتك تهمنا بشكل بالغ. تم تصميم هذه السياسة لمساعدتك على فهم حقوق خصوصيتك وكيف نحمي بياناتك. من خلال الوصول إلى خدماتنا أو استخدامها، فإنك تقر بأنك قد قرأت وفهمت ووافقت على جمعنا وتخزيننا واستخدامنا والكشف عن معلوماتك الشخصية كما هو موضح في سياسة الخصوصية هذه وشروط الاستخدام الخاصة بنا.',
        info_collect_title: '1. المعلومات التي نجمعها',
        info_collect_intro: 'لتقديم خدماتنا وتحسينها، نقوم بجمع المعلومات بعدة طرق.',
        info_direct_title: 'أ. المعلومات التي تقدمها لنا مباشرة',
        info_direct_content: 'عندما تنشئ حسابًا، أو تتصل بنا للحصول على الدعم، أو تستخدم الخدمات بأي طريقة أخرى، قد نجمع المعلومات الشخصية التالية:<br><br><strong>معلومات الحساب:</strong> اسمك، عنوان بريدك الإلكتروني، رقم هاتفك.<br><strong>محتوى المستخدم:</strong> الصور والملاحظات والمعلومات الأخرى التي تنشئها أو تستوردها أو تحملها أثناء استخدام الخدمات.<br><strong>معلومات الشبكات الاجتماعية:</strong> إذا اخترت تسجيل الدخول عبر شبكة اجتماعية، فقد نتلقى معلومات من ملفك الشخصي على تلك الشبكة، وذلك وفقًا لإعدادات الخصوصية الخاصة بك على تلك المنصة.<br><strong>بيانات الموقع الجغرافي:</strong> قد نجمع موقعك الدقيق (بيانات GPS) بموافقتك الصريحة لتقديم ميزات تعتمد على الموقع. يمكنك تعطيل هذا في أي وقت من إعدادات جهازك.',
        info_auto_title: 'ب. المعلومات التي نجمعها تلقائيًا',
        info_auto_content: 'عندما تستخدم خدماتنا، نقوم تلقائيًا بجمع بعض المعلومات التقنية من جهازك:<br><br><strong>معلومات الجهاز:</strong> نوع الجهاز، طراز الجهاز، نظام التشغيل وإصداره، معرفات الجهاز الفريدة (UDIs)، وإعدادات الجهاز.<br><strong>بيانات الاستخدام:</strong> معلومات حول كيفية تفاعلك مع خدماتنا، مثل الميزات المستخدمة، وتكرار الاستخدام، وتقارير الأعطال، وبيانات الأداء. نقوم بجمع هذه المعلومات عبر ملفات تعريف الارتباط أو تقنيات مشابهة لتحسين استقرار ووظائف خدماتنا.<br><br>عادةً ما تكون هذه المعلومات التي يتم جمعها تلقائيًا مجمعة أو مجهولة الهوية ولا تُستخدم لتعريفك شخصيًا.',
        info_use_title: '2. كيف نستخدم معلوماتك',
        info_use_content: 'نستخدم المعلومات التي نجمعها للأغراض التالية:<br><br><strong>لتقديم الخدمات وصيانتها:</strong> لإنشاء حسابك، وتوفير الميزات الأساسية، وضمان عمل خدماتنا بشكل صحيح.<br><strong>لتحسين الخدمات وتخصيصها:</strong> لفهم كيفية تفاعل مستخدمينا مع الخدمات، وتقديم تجربة أكثر تخصيصًا، وتطوير ميزات جديدة.<br><strong>للتواصل معك:</strong> لإرسال إشعارات فنية، وتنبيهات أمنية، وتحديثات، ومواد تسويقية، والرد على تعليقاتك وأسئلتك وطلبات خدمة العملاء.<br><strong>للسلامة والأمان:</strong> للتحقيق في ومنع المعاملات الاحتيالية، والوصول غير المصرح به، والأنشطة غير القانونية الأخرى، ولتطبيق شروط الاستخدام الخاصة بنا.',
        info_share_title: '3. كيف نشارك معلوماتك',
        info_share_intro: 'نحن لا نبيع معلوماتك الشخصية. نحن نشارك معلوماتك فقط مع أطراف ثالثة في الظروف التالية:',
        third_party_title: 'أ. مع مزودي الخدمات من الأطراف الثالثة',
        third_party_content: 'نحن نعمل مع شركاء من أطراف ثالثة لمساعدتنا في تشغيل وتوفير وتحسين وتسويق خدماتنا. هؤلاء الشركاء ملزمون تعاقديًا بحماية بياناتك ويقتصر استخدامهم لها على الأغراض التي نحددها فقط. قد نشارك المعلومات مع خدمات لـ:<br><br><strong>التحليلات وتقارير الأعطال:</strong> لمساعدتنا على فهم أنماط الاستخدام وإصلاح الأخطاء.<br>أمثلة: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>الإعلانات:</strong> لعرض الإعلانات داخل تطبيقنا. قد تجمع هذه الخدمات معرفات الجهاز لعرض إعلانات مخصصة. يمكنك عادةً إلغاء الاشتراك في الإعلانات المخصصة من إعدادات جهازك.<br>أمثلة: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, إلخ.<br><br><strong>الاستضافة السحابية:</strong> لتخزين بياناتك بشكل آمن.<br>مثال: Amazon Web Services (AWS)<br><br>تتوافق خدمات الأطراف الثالثة هذه مع لوائح حماية البيانات الرئيسية مثل اللائحة العامة لحماية البيانات (GDPR). نشجعك على مراجعة سياسات الخصوصية الخاصة بهم لفهم ممارساتهم المتعلقة بالبيانات.',
        legal_reasons_title: 'ب. لأسباب قانونية ولحماية حقوقنا',
        legal_reasons_content: 'قد نكشف عن معلوماتك إذا اعتقدنا أن ذلك مطلوب بموجب القانون، أو أمر استدعاء، أو أي إجراء قانوني آخر، أو إذا كان لدينا اعتقاد حسن النية بأن الكشف ضروري بشكل معقول لـ (1) حماية سلامة أي شخص، (2) معالجة الاحتيال أو المشكلات الأمنية أو الفنية، أو (3) حماية حقوقنا أو ممتلكاتنا.',
        with_consent_title: 'ج. بموافقتك',
        with_consent_content: 'قد نشارك معلوماتك لأغراض أخرى بموافقتك الصريحة. على سبيل المثال، قد تختار مشاركة محتوى من تطبيقنا إلى منصات أخرى مثل بريدك الإلكتروني أو حساباتك على وسائل التواصل الاجتماعي.',
        your_rights_title: '4. حقوقك وخياراتك',
        your_rights_content: 'نحن نؤمن بمنحك التحكم في معلوماتك. لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:<br><br><strong>الحق في الوصول والتصحيح:</strong> يمكنك الوصول إلى معظم معلومات حسابك وتحديثها مباشرة من خلال إعدادات التطبيق. لأي معلومات لا يمكنك الوصول إليها بنفسك، يمكنك الاتصال بنا.<br><strong>الحق في الحذف (المحو):</strong> يمكنك طلب حذف حسابك والبيانات الشخصية المرتبطة به. يرجى ملاحظة أنه لأسباب فنية، قد يستغرق المحو الكامل من أنظمة النسخ الاحتياطي لدينا ما يصل إلى 90 يومًا.<br><strong>الحق في الاعتراض على المعالجة:</strong> لديك الحق في الاعتراض على معالجتنا لبياناتك الشخصية لأغراض معينة، مثل التسويق المباشر.<br><strong>الحق في نقل البيانات:</strong> قد يكون لديك الحق في الحصول على نسخة من بياناتك الشخصية بتنسيق منظم وشائع الاستخدام وقابل للقراءة آليًا.<br><strong>الحق في سحب الموافقة:</strong> حيث نعتمد على موافقتك لمعالجة المعلومات (مثل بيانات الموقع الجغرافي)، يمكنك سحبها في أي وقت.<br><br>لممارسة أي من هذه الحقوق، يرجى الاتصال بنا على sven775288@gmail.com. سنرد على طلبك في غضون 30 يومًا. لحمايتك، قد نطلب منك التحقق من هويتك قبل معالجة طلبك.',
        data_security_title: '5. أمن البيانات',
        data_security_content: 'نحن نطبق تدابير أمنية إدارية وتقنية ومادية قوية لحماية معلوماتك من الفقدان والسرقة وسوء الاستخدام والوصول غير المصرح به. تشمل هذه التدابير:<br><br>تشفير البيانات أثناء النقل (SSL/TLS) وفي حالة السكون.<br>ضوابط وصول صارمة لضمان أن الموظفين الضروريين فقط يمكنهم الوصول إلى بياناتك.<br>تقييمات أمنية منتظمة وفحص للثغرات.<br><br>ومع ذلك، لا يوجد نظام أمني منيع. بينما نسعى جاهدين لحماية بياناتك، لا يمكننا ضمان أمنها المطلق.',
        data_transfers_title: '6. عمليات نقل البيانات الدولية',
        data_transfers_content: 'تتم استضافة خدماتنا بواسطة Amazon Web Services (AWS)، وقد يتم تخزين معلوماتك ومعالجتها على خوادم تقع في بلدان مختلفة حول العالم. باستخدامك لخدماتنا، فإنك تفهم وتوافق على نقل ومعالجة وتخزين معلوماتك في بلدان خارج بلد إقامتك، والتي قد يكون لديها قواعد مختلفة لحماية البيانات.',
        children_privacy_title: '7. خصوصية الأطفال',
        children_privacy_content: 'خدماتنا ليست مخصصة للأطفال دون سن 16 عامًا (أو الحد الأدنى للعمر المعادل في الولاية القضائية ذات الصلة) وليست موجهة إليهم. نحن لا نجمع معلومات شخصية عن قصد من الأطفال. إذا علمنا أننا قد جمعنا معلومات شخصية من طفل، فسنتخذ خطوات لحذف تلك المعلومات في أسرع وقت ممكن.',
        policy_changes_title: '8. التغييرات على سياسة الخصوصية هذه',
        policy_changes_content: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. إذا قمنا بإجراء تغييرات جوهرية، فسنخطرك من خلال التطبيق، أو عبر البريد الإلكتروني، أو عن طريق مطالبتك بمراجعة وقبول الإصدار الجديد قبل متابعة استخدام الخدمات.',
        contact_title: '9. اتصل بنا',
        contact_content: 'إذا كان لديك أي أسئلة أو مخاوف أو ملاحظات حول سياسة الخصوصية هذه، فلا تتردد في الاتصال بنا.<br><br><strong>اسم الشركة:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>البريد الإلكتروني:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>العنوان:</strong> الطابق الثاني، مبنى 5، رقم 172 طريق هيكسو، بلدة يوزوي، منطقة ليانغجيانغ الجديدة، مدينة تشونغتشينغ، الصين.',
        terms_of_service: 'شروط الخدمة',
        contact_us: 'اتصل بنا'
      },
      bn: {
        privacy_policy_title: 'গোপনীয়তা নীতি',
        select_language: 'ভাষা নির্বাচন করুন',
        effective_date: 'কার্যকরী তারিখ: আগস্ট ১, ২০২৫',
        introduction_title: 'ভূমিকা',
        introduction_content: 'আমাদের অ্যাপ্লিকেশনে আপনাকে স্বাগতম। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে চংকিং ইনান টেকনোলজি কোং, লিমিটেড ("আমরা," "আমাদের," বা "আমাদের প্রতিষ্ঠান") কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ এবং প্রকাশ করে যখন আপনি আমাদের মোবাইল অ্যাপ্লিকেশন, ওয়েবসাইট এবং সম্পর্কিত পরিষেবাগুলি (সম্মিলিতভাবে, "পরিষেবা") ব্যবহার করেন।<br><br>আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ। এই নীতিটি আপনাকে আপনার গোপনীয়তার অধিকার এবং আমরা কীভাবে আপনার ডেটা সুরক্ষিত রাখি তা বুঝতে সাহায্য করার জন্য তৈরি করা হয়েছে। আমাদের পরিষেবাগুলি অ্যাক্সেস বা ব্যবহার করার মাধ্যমে, আপনি স্বীকার করছেন যে আপনি এই গোপনীয়তা নীতি এবং আমাদের ব্যবহারের শর্তাবলীতে বর্ণিত আপনার ব্যক্তিগত তথ্য সংগ্রহ, সংরক্ষণ, ব্যবহার এবং প্রকাশে সম্মত হয়েছেন এবং তা পড়েছেন ও বুঝেছেন।',
        info_collect_title: '১. আমরা যে তথ্য সংগ্রহ করি',
        info_collect_intro: 'আমাদের পরিষেবা প্রদান এবং উন্নত করার জন্য, আমরা বিভিন্ন উপায়ে তথ্য সংগ্রহ করি।',
        info_direct_title: 'ক. আপনার সরাসরি প্রদান করা তথ্য',
        info_direct_content: 'যখন আপনি একটি অ্যাকাউন্ট তৈরি করেন, সহায়তার জন্য আমাদের সাথে যোগাযোগ করেন, বা অন্যথায় পরিষেবাগুলি ব্যবহার করেন, তখন আমরা নিম্নলিখিত ব্যক্তিগত তথ্য সংগ্রহ করতে পারি:<br><br><strong>অ্যাকাউন্ট তথ্য:</strong> আপনার নাম, ইমেল ঠিকানা, ফোন নম্বর।<br><strong>ব্যবহারকারীর সামগ্রী:</strong> পরিষেবাগুলি ব্যবহার করার সময় আপনার তৈরি, আমদানি বা আপলোড করা ফটো, নোট এবং অন্যান্য তথ্য।<br><strong>সামাজিক নেটওয়ার্ক তথ্য:</strong> আপনি যদি কোনও সামাজিক নেটওয়ার্কের মাধ্যমে লগ ইন করতে চান, তাহলে আমরা আপনার সামাজিক নেটওয়ার্ক প্রোফাইল থেকে তথ্য পেতে পারি, যা সেই প্ল্যাটফর্মে আপনার গোপনীয়তা সেটিংসের উপর নির্ভরশীল।<br><strong>ভৌগলিক অবস্থান ডেটা:</strong> আমরা অবস্থান-ভিত্তিক বৈশিষ্ট্য সরবরাহ করার জন্য আপনার স্পষ্ট সম্মতিতে আপনার সঠিক অবস্থান (GPS ডেটা) সংগ্রহ করতে পারি। আপনি আপনার ডিভাইসের সেটিংসে যেকোনো সময় এটি নিষ্ক্রিয় করতে পারেন।',
        info_auto_title: 'খ. আমরা স্বয়ংক্রিয়ভাবে যে তথ্য সংগ্রহ করি',
        info_auto_content: 'আপনি যখন আমাদের পরিষেবাগুলি ব্যবহার করেন, তখন আমরা আপনার ডিভাইস থেকে স্বয়ংক্রিয়ভাবে কিছু প্রযুক্তিগত তথ্য সংগ্রহ করি:<br><br><strong>ডিভাইসের তথ্য:</strong> ডিভাইসের ধরন, হার্ডওয়্যার মডেল, অপারেটিং সিস্টেম এবং সংস্করণ, অনন্য ডিভাইস শনাক্তকারী (UDIs), এবং ডিভাইস সেটিংস।<br><strong>ব্যবহারের ডেটা:</strong> আপনি আমাদের পরিষেবাগুলির সাথে কীভাবে ইন্টারঅ্যাক্ট করেন সে সম্পর্কিত তথ্য, যেমন ব্যবহৃত বৈশিষ্ট্য, ব্যবহারের ফ্রিকোয়েন্সি, ক্র্যাশ রিপোর্ট এবং কর্মক্ষমতা ডেটা। আমরা আমাদের পরিষেবাগুলির স্থিতিশীলতা এবং কার্যকারিতা উন্নত করতে কুকি বা অনুরূপ প্রযুক্তির মাধ্যমে এটি সংগ্রহ করি।<br><br>এই স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য সাধারণত একত্রিত বা ডি-আইডেন্টিফাইড থাকে এবং আপনাকে ব্যক্তিগতভাবে শনাক্ত করতে ব্যবহৃত হয় না।',
        info_use_title: '২. আমরা কীভাবে আপনার তথ্য ব্যবহার করি',
        info_use_content: 'আমরা সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:<br><br><strong>পরিষেবা প্রদান এবং রক্ষণাবেক্ষণের জন্য:</strong> আপনার অ্যাকাউন্ট তৈরি করতে, মূল বৈশিষ্ট্যগুলি সরবরাহ করতে এবং আমাদের পরিষেবাগুলি সঠিকভাবে কাজ করছে তা নিশ্চিত করতে।<br><strong>পরিষেবা উন্নত এবং ব্যক্তিগতকৃত করার জন্য:</strong> আমাদের ব্যবহারকারীরা পরিষেবাগুলির সাথে কীভাবে ইন্টারঅ্যাক্ট করে তা বুঝতে, আরও ব্যক্তিগতকৃত অভিজ্ঞতা প্রদান করতে এবং নতুন বৈশিষ্ট্য বিকাশ করতে।<br><strong>আপনার সাথে যোগাযোগের জন্য:</strong> আপনাকে প্রযুক্তিগত বিজ্ঞপ্তি, নিরাপত্তা সতর্কতা, আপডেট, বিপণন সামগ্রী পাঠাতে এবং আপনার মন্তব্য, প্রশ্ন এবং গ্রাহক পরিষেবা অনুরোধের প্রতিক্রিয়া জানাতে।<br><strong>নিরাপত্তা এবং সুরক্ষার জন্য:</strong> প্রতারণামূলক লেনদেন, অননুমোদিত অ্যাক্সেস এবং অন্যান্য অবৈধ কার্যকলাপ তদন্ত ও প্রতিরোধ করতে এবং আমাদের ব্যবহারের শর্তাবলী প্রয়োগ করতে।',
        info_share_title: '৩. আমরা কীভাবে আপনার তথ্য শেয়ার করি',
        info_share_intro: 'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। আমরা শুধুমাত্র নিম্নলিখিত পরিস্থিতিতে তৃতীয় পক্ষের সাথে আপনার তথ্য শেয়ার করি:',
        third_party_title: 'ক. তৃতীয় পক্ষের পরিষেবা প্রদানকারীদের সাথে',
        third_party_content: 'আমরা আমাদের পরিষেবাগুলি পরিচালনা, প্রদান, উন্নত এবং বাজারজাত করতে সাহায্য করার জন্য তৃতীয় পক্ষের অংশীদারদের সাথে কাজ করি। এই অংশীদাররা চুক্তিগতভাবে আপনার ডেটা সুরক্ষিত রাখতে বাধ্য এবং শুধুমাত্র আমাদের নির্দিষ্ট করা উদ্দেশ্যেই এটি ব্যবহার করতে সীমাবদ্ধ। আমরা নিম্নলিখিত পরিষেবাগুলির জন্য তথ্য শেয়ার করতে পারি:<br><br><strong>বিশ্লেষণ এবং ক্র্যাশ রিপোর্টিং:</strong> ব্যবহারের ধরণ বুঝতে এবং বাগ সংশোধন করতে আমাদের সাহায্য করার জন্য।<br>উদাহরণ: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>বিজ্ঞাপন:</strong> আমাদের অ্যাপের মধ্যে বিজ্ঞাপন প্রদর্শন করার জন্য। এই পরিষেবাগুলি ব্যক্তিগতকৃত বিজ্ঞাপন দেখানোর জন্য ডিভাইস শনাক্তকারী সংগ্রহ করতে পারে। আপনি সাধারণত আপনার ডিভাইস সেটিংসে ব্যক্তিগতকৃত বিজ্ঞাপন থেকে অপ্ট-আউট করতে পারেন।<br>উদাহরণ: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, ইত্যাদি।<br><br><strong>ক্লাউড হোস্টিং:</strong> আপনার ডেটা নিরাপদে সংরক্ষণ করার জন্য।<br>উদাহরণ: Amazon Web Services (AWS)<br><br>এই তৃতীয় পক্ষের পরিষেবাগুলি GDPR-এর মতো প্রধান ডেটা সুরক্ষা প্রবিধানগুলির সাথে সঙ্গতিপূর্ণ। আমরা আপনাকে তাদের ডেটা অনুশীলনগুলি বোঝার জন্য তাদের গোপনীয়তা নীতিগুলি পর্যালোচনা করতে উৎসাহিত করি।',
        legal_reasons_title: 'খ. আইনি কারণে এবং আমাদের অধিকার রক্ষার জন্য',
        legal_reasons_content: 'আমরা আপনার তথ্য প্রকাশ করতে পারি যদি আমরা বিশ্বাস করি যে এটি আইন, সাবপিনা বা অন্যান্য আইনি প্রক্রিয়ার দ্বারা প্রয়োজনীয়, অথবা যদি আমাদের একটি সরল বিশ্বাস থাকে যে প্রকাশটি (i) কোনো ব্যক্তির নিরাপত্তা রক্ষা করার জন্য, (ii) জালিয়াতি, নিরাপত্তা বা প্রযুক্তিগত সমস্যা মোকাবেলা করার জন্য, বা (iii) আমাদের অধিকার বা সম্পত্তি রক্ষা করার জন্য যুক্তিসঙ্গতভাবে প্রয়োজনীয়।',
        with_consent_title: 'গ. আপনার সম্মতিতে',
        with_consent_content: 'আমরা আপনার স্পষ্ট সম্মতিতে অন্যান্য উদ্দেশ্যে আপনার তথ্য শেয়ার করতে পারি। উদাহরণস্বরূপ, আপনি আমাদের অ্যাপ থেকে আপনার ইমেল বা সামাজিক মিডিয়া অ্যাকাউন্টের মতো অন্যান্য প্ল্যাটফর্মে সামগ্রী শেয়ার করতে পারেন।',
        your_rights_title: '৪. আপনার অধিকার এবং পছন্দ',
        your_rights_content: 'আমরা আপনাকে আপনার তথ্যের উপর নিয়ন্ত্রণ দেওয়ার বিশ্বাস করি। আপনার ব্যক্তিগত ডেটা সম্পর্কিত আপনার নিম্নলিখিত অধিকার রয়েছে:<br><br><strong>অ্যাক্সেস এবং সংশোধনের অধিকার:</strong> আপনি অ্যাপের সেটিংসের মধ্যে সরাসরি আপনার বেশিরভাগ অ্যাকাউন্টের তথ্য অ্যাক্সেস এবং আপডেট করতে পারেন। আপনি নিজে অ্যাক্সেস করতে না পারা যেকোনো তথ্যের জন্য, আপনি আমাদের সাথে যোগাযোগ করতে পারেন।<br><strong>মুছে ফেলার অধিকার (বিলোপ):</strong> আপনি আপনার অ্যাকাউন্ট এবং সম্পর্কিত ব্যক্তিগত ডেটা মুছে ফেলার অনুরোধ করতে পারেন। দয়া করে মনে রাখবেন যে প্রযুক্তিগত কারণে, আমাদের ব্যাকআপ সিস্টেম থেকে সম্পূর্ণ বিলোপ হতে ৯০ দিন পর্যন্ত সময় লাগতে পারে।<br><strong>প্রক্রিয়াকরণে আপত্তির অধিকার:</strong> আপনার কাছে আমাদের দ্বারা আপনার ব্যক্তিগত ডেটা নির্দিষ্ট উদ্দেশ্যে, যেমন সরাসরি বিপণনের জন্য, প্রক্রিয়াকরণে আপত্তি জানানোর অধিকার রয়েছে।<br><strong>ডেটা পোর্টেবিলিটির অধিকার:</strong> আপনার একটি কাঠামোবদ্ধ, মেশিন-পঠনযোগ্য বিন্যাসে আপনার ব্যক্তিগত ডেটার একটি অনুলিপি পাওয়ার অধিকার থাকতে পারে।<br><strong>সম্মতি প্রত্যাহারের অধিকার:</strong> যেখানে আমরা তথ্য প্রক্রিয়াকরণের জন্য আপনার সম্মতির উপর নির্ভর করি (যেমন ভৌগলিক অবস্থানের জন্য), আপনি যেকোনো সময় তা প্রত্যাহার করতে পারেন।<br><br>এই অধিকারগুলির যেকোনো একটি প্রয়োগ করতে, দয়া করে আমাদের সাথে sven775288@gmail.com এ যোগাযোগ করুন। আমরা ৩০ দিনের মধ্যে আপনার অনুরোধের প্রতিক্রিয়া জানাব। আপনার সুরক্ষার জন্য, আমরা আপনার অনুরোধ প্রক্রিয়া করার আগে আপনাকে আপনার পরিচয় যাচাই করার প্রয়োজন হতে পারে।',
        data_security_title: '৫. ডেটা নিরাপত্তা',
        data_security_content: 'আমরা আপনার তথ্য ক্ষতি, চুরি, অপব্যবহার এবং অননুমোদিত অ্যাক্সেস থেকে রক্ষা করার জন্য শক্তিশালী প্রশাসনিক, প্রযুক্তিগত এবং শারীরিক নিরাপত্তা ব্যবস্থা প্রয়োগ করি। এই ব্যবস্থাগুলির মধ্যে রয়েছে:<br><br>ট্রানজিটে (SSL/TLS) এবং বিশ্রামে ডেটার এনক্রিপশন।<br>শুধুমাত্র প্রয়োজনীয় কর্মীরা আপনার ডেটা অ্যাক্সেস করতে পারে তা নিশ্চিত করার জন্য কঠোর অ্যাক্সেস নিয়ন্ত্রণ।<br>নিয়মিত নিরাপত্তা মূল্যায়ন এবং দুর্বলতা স্ক্যানিং।<br><br>তবে, কোনো নিরাপত্তা ব্যবস্থা দুর্ভেদ্য নয়। যদিও আমরা আপনার ডেটা রক্ষা করার জন্য সচেষ্ট, আমরা এর সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারি না।',
        data_transfers_title: '৬. আন্তর্জাতিক ডেটা স্থানান্তর',
        data_transfers_content: 'আমাদের পরিষেবাগুলি Amazon Web Services (AWS) দ্বারা হোস্ট করা হয়, এবং আপনার তথ্য বিশ্বের বিভিন্ন দেশে অবস্থিত সার্ভারগুলিতে সংরক্ষণ এবং প্রক্রিয়া করা হতে পারে। আমাদের পরিষেবাগুলি ব্যবহার করে, আপনি আপনার বসবাসের দেশের বাইরে আপনার তথ্য স্থানান্তর, প্রক্রিয়াকরণ এবং সংরক্ষণে সম্মত হন, যেখানে বিভিন্ন ডেটা সুরক্ষা নিয়ম থাকতে পারে।',
        children_privacy_title: '৭. শিশুদের গোপনীয়তা',
        children_privacy_content: 'আমাদের পরিষেবাগুলি ১৬ বছরের কম বয়সী (বা সংশ্লিষ্ট এখতিয়ারে সমতুল্য ন্যূনতম বয়স) শিশুদের জন্য ಉದ್ದೇಶিত বা নির্দেশিত নয়। আমরা জেনেশুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না। যদি আমরা জানতে পারি যে আমরা একটি শিশুর কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করেছি, আমরা যত তাড়াতাড়ি সম্ভব সেই তথ্য মুছে ফেলার পদক্ষেপ নেব।',
        policy_changes_title: '৮. এই গোপনীয়তা নীতিতে পরিবর্তন',
        policy_changes_content: 'আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। যদি আমরা উপাদান পরিবর্তন করি, আমরা আপনাকে অ্যাপের মাধ্যমে, ইমেলের মাধ্যমে বা পরিষেবাগুলি ব্যবহার চালিয়ে যাওয়ার আগে নতুন সংস্করণ পর্যালোচনা এবং গ্রহণ করার প্রয়োজন দ্বারা অবহিত করব।',
        contact_title: '৯. আমাদের সাথে যোগাযোগ করুন',
        contact_content: 'এই গোপনীয়তা নীতি সম্পর্কে আপনার কোনো প্রশ্ন, উদ্বেগ বা প্রতিক্রিয়া থাকলে, দয়া করে আমাদের সাথে যোগাযোগ করতে দ্বিধা করবেন না।<br><br><strong>কোম্পানির নাম:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>ইমেল:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>ঠিকানা:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'পরিষেবার শর্তাবলী',
        contact_us: 'আমাদের সাথে যোগাযোগ করুন'
      },
      de: {
        privacy_policy_title: 'Datenschutzerklärung',
        select_language: 'Sprache auswählen',
        effective_date: 'Gültigkeitsdatum: 1. August 2025',
        introduction_title: 'Einleitung',
        introduction_content: 'Willkommen bei unserer Anwendung. Diese Datenschutzerklärung erläutert, wie die Chongqing Yinnan Technology Co., Ltd. („wir“, „uns“ oder „unser“) Ihre Informationen sammelt, verwendet, speichert und offenlegt, wenn Sie unsere mobilen Anwendungen, Websites und zugehörigen Dienste (zusammenfassend die „Dienste“) nutzen.<br><br>Ihre Privatsphäre ist uns von entscheidender Bedeutung. Diese Richtlinie soll Ihnen helfen, Ihre Datenschutzrechte zu verstehen und wie wir Ihre Daten schützen. Durch den Zugriff auf oder die Nutzung unserer Dienste bestätigen Sie, dass Sie die Erfassung, Speicherung, Nutzung und Offenlegung Ihrer personenbezogenen Daten, wie in dieser Datenschutzerklärung und unseren Nutzungsbedingungen beschrieben, gelesen und verstanden haben und damit einverstanden sind.',
        info_collect_title: '1. Welche Informationen wir sammeln',
        info_collect_intro: 'Um unsere Dienste bereitzustellen und zu verbessern, sammeln wir Informationen auf verschiedene Weisen.',
        info_direct_title: 'A. Informationen, die Sie uns direkt zur Verfügung stellen',
        info_direct_content: 'Wenn Sie ein Konto erstellen, uns für Support kontaktieren oder die Dienste anderweitig nutzen, können wir die folgenden personenbezogenen Daten sammeln:<br><br><strong>Kontoinformationen:</strong> Ihr Name, Ihre E-Mail-Adresse, Ihre Telefonnummer.<br><strong>Benutzerinhalte:</strong> Fotos, Notizen und andere Informationen, die Sie während der Nutzung der Dienste erstellen, importieren oder hochladen.<br><strong>Informationen aus sozialen Netzwerken:</strong> Wenn Sie sich über ein soziales Netzwerk anmelden, erhalten wir möglicherweise Informationen aus Ihrem Profil in diesem sozialen Netzwerk, abhängig von Ihren Datenschutzeinstellungen auf dieser Plattform.<br><strong>Standortdaten:</strong> Wir können mit Ihrer ausdrücklichen Zustimmung Ihren genauen Standort (GPS-Daten) erfassen, um standortbezogene Funktionen bereitzustellen. Sie können dies jederzeit in Ihren Geräteeinstellungen deaktivieren.',
        info_auto_title: 'B. Informationen, die wir automatisch sammeln',
        info_auto_content: 'Wenn Sie unsere Dienste nutzen, sammeln wir automatisch bestimmte technische Informationen von Ihrem Gerät:<br><br><strong>Geräteinformationen:</strong> Gerätetyp, Hardwaremodell, Betriebssystem und Version, eindeutige Gerätekennungen (UDIs) und Geräteeinstellungen.<br><strong>Nutzungsdaten:</strong> Informationen darüber, wie Sie mit unseren Diensten interagieren, z. B. genutzte Funktionen, Nutzungshäufigkeit, Absturzberichte und Leistungsdaten. Wir sammeln diese über Cookies oder ähnliche Technologien, um die Stabilität und Funktionalität unserer Dienste zu verbessern.<br><br>Diese automatisch gesammelten Informationen werden in der Regel aggregiert oder anonymisiert und nicht dazu verwendet, Sie persönlich zu identifizieren.',
        info_use_title: '2. Wie wir Ihre Informationen verwenden',
        info_use_content: 'Wir verwenden die von uns gesammelten Informationen für die folgenden Zwecke:<br><br><strong>Zur Bereitstellung und Wartung der Dienste:</strong> Um Ihr Konto zu erstellen, Kernfunktionen bereitzustellen und sicherzustellen, dass unsere Dienste ordnungsgemäß funktionieren.<br><strong>Zur Verbesserung und Personalisierung der Dienste:</strong> Um zu verstehen, wie unsere Benutzer mit den Diensten interagieren, ein persönlicheres Erlebnis zu bieten und neue Funktionen zu entwickeln.<br><strong>Zur Kommunikation mit Ihnen:</strong> Um Ihnen technische Mitteilungen, Sicherheitswarnungen, Updates, Marketingmaterialien zu senden und auf Ihre Kommentare, Fragen und Kundendienstanfragen zu antworten.<br><strong>Für Sicherheit und Schutz:</strong> Um betrügerische Transaktionen, unbefugten Zugriff und andere illegale Aktivitäten zu untersuchen und zu verhindern und unsere Nutzungsbedingungen durchzusetzen.',
        info_share_title: '3. Wie wir Ihre Informationen weitergeben',
        info_share_intro: 'Wir verkaufen Ihre personenbezogenen Daten nicht. Wir geben Ihre Informationen nur unter den folgenden Umständen an Dritte weiter:',
        third_party_title: 'A. Mit Drittanbietern',
        third_party_content: 'Wir arbeiten mit Drittpartnern zusammen, um uns beim Betrieb, der Bereitstellung, der Verbesserung und der Vermarktung unserer Dienste zu unterstützen. Diese Partner sind vertraglich zum Schutz Ihrer Daten verpflichtet und dürfen diese nur für die von uns angegebenen Zwecke verwenden. Wir können Informationen mit Diensten für folgende Zwecke teilen:<br><br><strong>Analyse und Absturzberichte:</strong> Um uns zu helfen, Nutzungsmuster zu verstehen und Fehler zu beheben.<br>Beispiele: Google Analytics für Firebase, Firebase Crashlytics<br><br><strong>Werbung:</strong> Um Werbung in unserer App anzuzeigen. Diese Dienste können Gerätekennungen sammeln, um personalisierte Anzeigen zu schalten. Sie können personalisierte Werbung in der Regel in Ihren Geräteeinstellungen deaktivieren.<br>Beispiele: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, etc.<br><br><strong>Cloud-Hosting:</strong> Um Ihre Daten sicher zu speichern.<br>Beispiel: Amazon Web Services (AWS)<br><br>Diese Drittanbieterdienste entsprechen wichtigen Datenschutzbestimmungen wie der DSGVO. Wir empfehlen Ihnen, deren Datenschutzrichtlinien zu lesen, um deren Datenpraktiken zu verstehen.',
        legal_reasons_title: 'B. Aus rechtlichen Gründen und zum Schutz unserer Rechte',
        legal_reasons_content: 'Wir können Ihre Informationen offenlegen, wenn wir der Ansicht sind, dass dies gesetzlich, per Vorladung oder durch ein anderes rechtliches Verfahren erforderlich ist, oder wenn wir nach Treu und Glauben der Ansicht sind, dass die Offenlegung vernünftigerweise erforderlich ist, um (i) die Sicherheit einer Person zu schützen, (ii) Betrugs-, Sicherheits- oder technische Probleme zu beheben oder (iii) unsere Rechte oder unser Eigentum zu schützen.',
        with_consent_title: 'C. Mit Ihrer Zustimmung',
        with_consent_content: 'Wir können Ihre Informationen für andere Zwecke mit Ihrer ausdrücklichen Zustimmung weitergeben. Beispielsweise können Sie Inhalte aus unserer App auf anderen Plattformen wie Ihren E-Mail- oder Social-Media-Konten teilen.',
        your_rights_title: '4. Ihre Rechte und Wahlmöglichkeiten',
        your_rights_content: 'Wir glauben daran, Ihnen die Kontrolle über Ihre Informationen zu geben. Sie haben die folgenden Rechte in Bezug auf Ihre personenbezogenen Daten:<br><br><strong>Recht auf Auskunft und Berichtigung:</strong> Sie können die meisten Ihrer Kontoinformationen direkt in den Einstellungen der App einsehen und aktualisieren. Für Informationen, auf die Sie nicht selbst zugreifen können, können Sie uns kontaktieren.<br><strong>Recht auf Löschung:</strong> Sie können die Löschung Ihres Kontos und der zugehörigen personenbezogenen Daten verlangen. Bitte beachten Sie, dass aus technischen Gründen die vollständige Löschung aus unseren Backup-Systemen bis zu 90 Tage dauern kann.<br><strong>Widerspruchsrecht gegen die Verarbeitung:</strong> Sie haben das Recht, der Verarbeitung Ihrer personenbezogenen Daten für bestimmte Zwecke, wie z. B. Direktmarketing, zu widersprechen.<br><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben möglicherweise das Recht, eine Kopie Ihrer personenbezogenen Daten in einem strukturierten, maschinenlesbaren Format zu erhalten.<br><strong>Recht auf Widerruf der Einwilligung:</strong> Wenn wir uns auf Ihre Einwilligung zur Verarbeitung von Informationen (wie bei der Geolokalisierung) stützen, können Sie diese jederzeit widerrufen.<br><br>Um eines dieser Rechte auszuüben, kontaktieren Sie uns bitte unter sven775288@gmail.com. Wir werden Ihre Anfrage innerhalb von 30 Tagen beantworten. Zu Ihrem Schutz können wir Sie auffordern, Ihre Identität zu überprüfen, bevor wir Ihre Anfrage bearbeiten.',
        data_security_title: '5. Datensicherheit',
        data_security_content: 'Wir ergreifen robuste administrative, technische und physische Sicherheitsmaßnahmen, um Ihre Informationen vor Verlust, Diebstahl, Missbrauch und unbefugtem Zugriff zu schützen. Diese Maßnahmen umfassen:<br><br>Verschlüsselung von Daten während der Übertragung (SSL/TLS) und im Ruhezustand.<br>Strenge Zugriffskontrollen, um sicherzustellen, dass nur erforderliches Personal auf Ihre Daten zugreifen kann.<br>Regelmäßige Sicherheitsüberprüfungen und Schwachstellenscans.<br><br>Kein Sicherheitssystem ist jedoch undurchdringlich. Obwohl wir uns bemühen, Ihre Daten zu schützen, können wir deren absolute Sicherheit nicht garantieren.',
        data_transfers_title: '6. Internationale Datenübertragungen',
        data_transfers_content: 'Unsere Dienste werden von Amazon Web Services (AWS) gehostet, und Ihre Informationen können auf Servern in verschiedenen Ländern auf der ganzen Welt gespeichert und verarbeitet werden. Durch die Nutzung unserer Dienste verstehen Sie und stimmen Sie der Übertragung, Verarbeitung und Speicherung Ihrer Informationen in Ländern außerhalb Ihres Wohnsitzlandes zu, die möglicherweise andere Datenschutzbestimmungen haben.',
        children_privacy_title: '7. Privatsphäre von Kindern',
        children_privacy_content: 'Unsere Dienste sind nicht für Kinder unter 16 Jahren (oder dem entsprechenden Mindestalter in der jeweiligen Rechtsordnung) bestimmt oder an diese gerichtet. Wir sammeln nicht wissentlich personenbezogene Daten von Kindern. Wenn wir erfahren, dass wir personenbezogene Daten von einem Kind gesammelt haben, werden wir Maßnahmen ergreifen, um diese Informationen so schnell wie möglich zu löschen.',
        policy_changes_title: '8. Änderungen dieser Datenschutzerklärung',
        policy_changes_content: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Wenn wir wesentliche Änderungen vornehmen, werden wir Sie über die App, per E-Mail oder indem wir Sie auffordern, die neue Version zu überprüfen und zu akzeptieren, bevor Sie die Dienste weiterhin nutzen, benachrichtigen.',
        contact_title: '9. Kontakt',
        contact_content: 'Wenn Sie Fragen, Bedenken oder Feedback zu dieser Datenschutzerklärung haben, zögern Sie bitte nicht, uns zu kontaktieren.<br><br><strong>Firmenname:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>E-Mail:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Adresse:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Nutzungsbedingungen',
        contact_us: 'Kontakt'
      },
      es: {
        privacy_policy_title: 'Política de Privacidad',
        select_language: 'Seleccionar Idioma',
        effective_date: 'Fecha de Vigencia: 1 de agosto de 2025',
        introduction_title: 'Introducción',
        introduction_content: 'Bienvenido a nuestra aplicación. Esta Política de Privacidad explica cómo Chongqing Yinnan Technology Co., Ltd. ("nosotros", "nuestro" o "nuestra empresa") recopila, utiliza, almacena y divulga su información cuando utiliza nuestras aplicaciones móviles, sitios web y servicios relacionados (colectivamente, los "Servicios").<br><br>Su privacidad es de vital importancia para nosotros. Esta política está diseñada para ayudarle a comprender sus derechos de privacidad y cómo protegemos sus datos. Al acceder o utilizar nuestros Servicios, usted confirma que ha leído, entendido y acepta nuestra recopilación, almacenamiento, uso y divulgación de su información personal como se describe en esta Política de Privacidad y nuestros Términos de Uso.',
        info_collect_title: '1. Información que Recopilamos',
        info_collect_intro: 'Para proporcionar y mejorar nuestros Servicios, recopilamos información de varias maneras.',
        info_direct_title: 'A. Información que Nos Proporciona Directamente',
        info_direct_content: 'Cuando crea una cuenta, se contacta con nosotros para soporte, o utiliza los Servicios de otra manera, podemos recopilar la siguiente información personal:<br><br><strong>Información de Cuenta:</strong> Su nombre, dirección de correo electrónico, número de teléfono.<br><strong>Contenido del Usuario:</strong> Fotos, notas y otra información que crea, importa o sube mientras usa los Servicios.<br><strong>Información de Redes Sociales:</strong> Si elige iniciar sesión a través de una red social, podemos recibir información de su perfil de red social, sujeto a su configuración de privacidad en esa plataforma.<br><strong>Datos de Geolocalización:</strong> Podemos recopilar su ubicación precisa (datos GPS) con su consentimiento explícito para proporcionar funciones basadas en ubicación. Puede desactivar esto en cualquier momento en la configuración de su dispositivo.',
        info_auto_title: 'B. Información que Recopilamos Automáticamente',
        info_auto_content: 'Cuando utiliza nuestros Servicios, recopilamos automáticamente cierta información técnica de su dispositivo:<br><br><strong>Información del Dispositivo:</strong> Tipo de dispositivo, modelo de hardware, sistema operativo y versión, identificadores únicos de dispositivo (UDIs) y configuración del dispositivo.<br><strong>Datos de Uso:</strong> Información sobre cómo interactúa con nuestros Servicios, como las funciones utilizadas, frecuencia de uso, informes de fallos y datos de rendimiento. Recopilamos esto a través de cookies o tecnologías similares para mejorar la estabilidad y funcionalidad de nuestros Servicios.<br><br>Esta información recopilada automáticamente generalmente se agrega o desidentifica y no se utiliza para identificarlo personalmente.',
        info_use_title: '2. Cómo Utilizamos Su Información',
        info_use_content: 'Utilizamos la información que recopilamos para los siguientes propósitos:<br><br><strong>Para Proporcionar y Mantener los Servicios:</strong> Para crear su cuenta, proporcionar funciones principales y asegurar que nuestros Servicios funcionen correctamente.<br><strong>Para Mejorar y Personalizar los Servicios:</strong> Para entender cómo nuestros usuarios interactúan con los Servicios, ofrecer una experiencia más personalizada y desarrollar nuevas funciones.<br><strong>Para Comunicarnos con Usted:</strong> Para enviarle avisos técnicos, alertas de seguridad, actualizaciones, materiales de marketing y responder a sus comentarios, preguntas y solicitudes de servicio al cliente.<br><strong>Para Seguridad y Protección:</strong> Para investigar y prevenir transacciones fraudulentas, acceso no autorizado y otras actividades ilegales, y hacer cumplir nuestros Términos de Uso.',
        info_share_title: '3. Cómo Compartimos Su Información',
        info_share_intro: 'No vendemos su información personal. Solo compartimos su información con terceros en las siguientes circunstancias:',
        third_party_title: 'A. Con Proveedores de Servicios de Terceros',
        third_party_content: 'Trabajamos con socios terceros para ayudarnos a operar, proporcionar, mejorar y comercializar nuestros Servicios. Estos socios están contractualmente obligados a proteger sus datos y están restringidos a usarlos solo para los propósitos que especificamos. Podemos compartir información con servicios para:<br><br><strong>Análisis e Informes de Fallos:</strong> Para ayudarnos a entender patrones de uso y corregir errores.<br>Ejemplos: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Publicidad:</strong> Para mostrar anuncios dentro de nuestra aplicación. Estos servicios pueden recopilar identificadores de dispositivo para mostrar anuncios personalizados. Generalmente puede optar por no recibir publicidad personalizada en la configuración de su dispositivo.<br>Ejemplos: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, etc.<br><br><strong>Alojamiento en la Nube:</strong> Para almacenar sus datos de forma segura.<br>Ejemplo: Amazon Web Services (AWS)<br><br>Estos servicios de terceros cumplen con las principales regulaciones de protección de datos como GDPR. Le recomendamos revisar sus políticas de privacidad para entender sus prácticas de datos.',
        legal_reasons_title: 'B. Por Razones Legales y para Proteger Nuestros Derechos',
        legal_reasons_content: 'Podemos divulgar su información si creemos que es requerido por ley, citación judicial u otro proceso legal, o si tenemos una creencia de buena fe de que la divulgación es razonablemente necesaria para (i) proteger la seguridad de cualquier persona, (ii) abordar fraude, problemas de seguridad o técnicos, o (iii) proteger nuestros derechos o propiedad.',
        with_consent_title: 'C. Con Su Consentimiento',
        with_consent_content: 'Podemos compartir su información para otros propósitos con su consentimiento explícito. Por ejemplo, puede elegir compartir contenido de nuestra aplicación a otras plataformas como su correo electrónico o cuentas de redes sociales.',
        your_rights_title: '4. Sus Derechos y Opciones',
        your_rights_content: 'Creemos en darle control sobre su información. Tiene los siguientes derechos con respecto a sus datos personales:<br><br><strong>Derecho de Acceso y Corrección:</strong> Puede acceder y actualizar la mayoría de la información de su cuenta directamente dentro de la configuración de la aplicación. Para cualquier información a la que no pueda acceder usted mismo, puede contactarnos.<br><br><strong>Derecho de Eliminación:</strong> Puede solicitar la eliminación de su cuenta y datos personales asociados. Tenga en cuenta que por razones técnicas, la eliminación completa de nuestros sistemas de respaldo puede tomar hasta 90 días.<br><br><strong>Derecho a Oponerse al Procesamiento:</strong> Tiene derecho a oponerse a que procesemos sus datos personales para ciertos propósitos, como marketing directo.<br><br><strong>Derecho a la Portabilidad de Datos:</strong> Puede tener derecho a recibir una copia de sus datos personales en un formato estructurado y legible por máquina.<br><br><strong>Derecho a Retirar el Consentimiento:</strong> Donde dependemos de su consentimiento para procesar información (como para geolocalización), puede retirarlo en cualquier momento.<br><br>Para ejercer cualquiera de estos derechos, contáctenos en sven775288@gmail.com. Responderemos a su solicitud dentro de 30 días. Para su protección, podemos requerirle que verifique su identidad antes de procesar su solicitud.',
        data_security_title: '5. Seguridad de Datos',
        data_security_content: 'Implementamos medidas de seguridad administrativas, técnicas y físicas robustas para proteger su información de pérdida, robo, uso indebido y acceso no autorizado. Estas medidas incluyen:<br><br>Encriptación de datos en tránsito (SSL/TLS) y en reposo.<br>Controles de acceso estrictos para asegurar que solo el personal necesario pueda acceder a sus datos.<br>Evaluaciones de seguridad regulares y escaneo de vulnerabilidades.<br><br>Sin embargo, ningún sistema de seguridad es impenetrable. Aunque nos esforzamos por proteger sus datos, no podemos garantizar su seguridad absoluta.',
        data_transfers_title: '6. Transferencias Internacionales de Datos',
        data_transfers_content: 'Nuestros Servicios son alojados por Amazon Web Services (AWS), y su información puede ser almacenada y procesada en servidores ubicados en varios países alrededor del mundo. Al usar nuestros Servicios, entiende y consiente la transferencia, procesamiento y almacenamiento de su información en países fuera de su país de residencia, que pueden tener diferentes reglas de protección de datos.',
        children_privacy_title: '7. Privacidad de Menores',
        children_privacy_content: 'Nuestros Servicios no están destinados o dirigidos a niños menores de 16 años (o la edad mínima equivalente en la jurisdicción relevante). No recopilamos a sabiendas información personal de niños. Si nos enteramos de que hemos recopilado información personal de un niño, tomaremos medidas para eliminar esa información lo más rápido posible.',
        policy_changes_title: '8. Cambios a Esta Política de Privacidad',
        policy_changes_content: 'Podemos actualizar esta Política de Privacidad de vez en cuando. Si hacemos cambios materiales, le notificaremos a través de la aplicación, por correo electrónico, o requiriéndole que revise y acepte la nueva versión antes de continuar usando los Servicios.',
        contact_title: '9. Contáctenos',
        contact_content: 'Si tiene preguntas, preocupaciones o comentarios sobre esta Política de Privacidad, no dude en contactarnos.<br><br><strong>Nombre de la Empresa:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>Correo Electrónico:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Dirección:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Términos de Servicio',
        contact_us: 'Contáctanos'
      },
      fr: {
        privacy_policy_title: 'Politique de Confidentialité',
        select_language: 'Sélectionner la Langue',
        effective_date: 'Date d\'entrée en vigueur : 1er août 2025',
        introduction_title: 'Introduction',
        introduction_content: 'Bienvenue dans notre application. Cette Politique de Confidentialité explique comment Chongqing Yinnan Technology Co., Ltd. (« nous », « notre » ou « notre société ») collecte, utilise, stocke et divulgue vos informations lorsque vous utilisez nos applications mobiles, sites web et services connexes (collectivement, les « Services »).<br><br>Votre vie privée est d\'une importance cruciale pour nous. Cette politique est conçue pour vous aider à comprendre vos droits à la vie privée et comment nous protégeons vos données. En accédant ou en utilisant nos Services, vous confirmez que vous avez lu, compris et accepté notre collecte, stockage, utilisation et divulgation de vos informations personnelles comme décrit dans cette Politique de Confidentialité et nos Conditions d\'Utilisation.',
        info_collect_title: '1. Informations que Nous Collectons',
        info_collect_intro: 'Pour fournir et améliorer nos Services, nous collectons des informations de plusieurs manières.',
        info_direct_title: 'A. Informations que Vous Nous Fournissez Directement',
        info_direct_content: 'Lorsque vous créez un compte, nous contactez pour un support, ou utilisez les Services d\'une autre manière, nous pouvons collecter les informations personnelles suivantes :<br><br><strong>Informations de Compte :</strong> Votre nom, adresse e-mail, numéro de téléphone.<br><strong>Contenu Utilisateur :</strong> Photos, notes et autres informations que vous créez, importez ou téléchargez lors de l\'utilisation des Services.<br><strong>Informations de Réseau Social :</strong> Si vous choisissez de vous connecter via un réseau social, nous pouvons recevoir des informations de votre profil de réseau social, selon vos paramètres de confidentialité sur cette plateforme.<br><strong>Données de Géolocalisation :</strong> Nous pouvons collecter votre localisation précise (données GPS) avec votre consentement explicite pour fournir des fonctionnalités basées sur la localisation. Vous pouvez désactiver cela à tout moment dans les paramètres de votre appareil.',
        info_auto_title: 'B. Informations que Nous Collectons Automatiquement',
        info_auto_content: 'Lorsque vous utilisez nos Services, nous collectons automatiquement certaines informations techniques de votre appareil :<br><br><strong>Informations de l\'Appareil :</strong> Type d\'appareil, modèle matériel, système d\'exploitation et version, identifiants uniques d\'appareil (UDI) et paramètres de l\'appareil.<br><strong>Données d\'Usage :</strong> Informations sur la façon dont vous interagissez avec nos Services, telles que les fonctionnalités utilisées, la fréquence d\'utilisation, les rapports de plantage et les données de performance. Nous collectons cela via des cookies ou des technologies similaires pour améliorer la stabilité et la fonctionnalité de nos Services.<br><br>Ces informations collectées automatiquement sont généralement agrégées ou dés-identifiées et ne sont pas utilisées pour vous identifier personnellement.',
        info_use_title: '2. Comment Nous Utilisons Vos Informations',
        info_use_content: 'Nous utilisons les informations que nous collectons aux fins suivantes :<br><br><strong>Pour Fournir et Maintenir les Services :</strong> Pour créer votre compte, fournir les fonctionnalités principales et assurer le bon fonctionnement de nos Services.<br><strong>Pour Améliorer et Personnaliser les Services :</strong> Pour comprendre comment nos utilisateurs interagissent avec les Services, offrir une expérience plus personnalisée et développer de nouvelles fonctionnalités.<br><strong>Pour Communiquer avec Vous :</strong> Pour vous envoyer des notifications techniques, des alertes de sécurité, des mises à jour, du matériel de marketing et répondre à vos commentaires, questions et demandes de service client.<br><strong>Pour la Sécurité et la Protection :</strong> Pour enquêter et prévenir les transactions frauduleuses, l\'accès non autorisé et autres activités illégales, et faire respecter nos Conditions d\'Utilisation.',
        info_share_title: '3. Comment Nous Partageons Vos Informations',
        info_share_intro: 'Nous ne vendons pas vos informations personnelles. Nous ne partageons vos informations avec des tiers que dans les circonstances suivantes :',
        third_party_title: 'A. Avec des Fournisseurs de Services Tiers',
        third_party_content: 'Nous travaillons avec des partenaires tiers pour nous aider à exploiter, fournir, améliorer et commercialiser nos Services. Ces partenaires sont contractuellement tenus de protéger vos données et sont limités à les utiliser uniquement aux fins que nous spécifions. Nous pouvons partager des informations avec des services pour :<br><br><strong>Analytique et Rapports de Plantage :</strong> Pour nous aider à comprendre les modèles d\'usage et corriger les bugs.<br>Exemples : Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Publicité :</strong> Pour afficher des publicités dans notre application. Ces services peuvent collecter des identifiants d\'appareil pour afficher des publicités personnalisées. Vous pouvez généralement refuser la publicité personnalisée dans les paramètres de votre appareil.<br>Exemples : AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, etc.<br><br><strong>Hébergement Cloud :</strong> Pour stocker vos données en sécurité.<br>Exemple : Amazon Web Services (AWS)<br><br>Ces services tiers sont conformes aux principales réglementations de protection des données comme le RGPD. Nous vous encourageons à consulter leurs politiques de confidentialité pour comprendre leurs pratiques de données.',
        legal_reasons_title: 'B. Pour des Raisons Légales et pour Protéger Nos Droits',
        legal_reasons_content: 'Nous pouvons divulguer vos informations si nous croyons qu\'elle est exigée par la loi, une assignation ou autre procédure légale, ou si nous avons une croyance de bonne foi que la divulgation est raisonnablement nécessaire pour (i) protéger la sécurité de toute personne, (ii) traiter la fraude, la sécurité ou les problèmes techniques, ou (iii) protéger nos droits ou propriété.',
        with_consent_title: 'C. Avec Votre Consentement',
        with_consent_content: 'Nous pouvons partager vos informations à d\'autres fins avec votre consentement explicite. Par exemple, vous pouvez choisir de partager du contenu de notre application vers d\'autres plateformes comme votre e-mail ou comptes de réseaux sociaux.',
        your_rights_title: '4. Vos Droits et Choix',
        your_rights_content: 'Nous croyons qu\'il faut vous donner le contrôle sur vos informations. Vous avez les droits suivants concernant vos données personnelles :<br><br><strong>Droit d\'Accès et de Correction :</strong> Vous pouvez accéder et mettre à jour la plupart des informations de votre compte directement dans les paramètres de l\'application. Pour toute information à laquelle vous ne pouvez pas accéder vous-même, vous pouvez nous contacter.<br><br><strong>Droit de Suppression (Effacement) :</strong> Vous pouvez demander la suppression de votre compte et des données personnelles associées. Veuillez noter que pour des raisons techniques, l\'effacement complet de nos systèmes de sauvegarde peut prendre jusqu\'à 90 jours.<br><br><strong>Droit de S\'Opposer au Traitement :</strong> Vous avez le droit de vous opposer à ce que nous traitions vos données personnelles à certaines fins, comme le marketing direct.<br><br><strong>Droit à la Portabilité des Données :</strong> Vous pouvez avoir le droit de recevoir une copie de vos données personnelles dans un format structuré et lisible par machine.<br><br><strong>Droit de Retirer le Consentement :</strong> Lorsque nous nous appuyons sur votre consentement pour traiter les informations (comme pour la géolocalisation), vous pouvez le retirer à tout moment.<br><br>Pour exercer l\'un de ces droits, veuillez nous contacter à sven775288@gmail.com. Nous répondrons à votre demande dans les 30 jours. Pour votre protection, nous pouvons vous demander de vérifier votre identité avant de traiter votre demande.',
        data_security_title: '5. Sécurité des Données',
        data_security_content: 'Nous mettons en place des mesures de sécurité administratives, techniques et physiques robustes pour protéger vos informations contre la perte, le vol, l\'utilisation abusive et l\'accès non autorisé. Ces mesures comprennent :<br><br>Chiffrement des données en transit (SSL/TLS) et au repos.<br>Contrôles d\'accès stricts pour s\'assurer que seul le personnel nécessaire peut accéder à vos données.<br>Évaluations de sécurité régulières et analyse des vulnérabilités.<br><br>Cependant, aucun système de sécurité n\'est impénétrable. Bien que nous nous efforcions de protéger vos données, nous ne pouvons pas garantir leur sécurité absolue.',
        data_transfers_title: '6. Transferts Internationaux de Données',
        data_transfers_content: 'Nos Services sont hébergés par Amazon Web Services (AWS), et vos informations peuvent être stockées et traitées sur des serveurs situés dans divers pays du monde. En utilisant nos Services, vous comprenez et consentez au transfert, traitement et stockage de vos informations dans des pays en dehors de votre pays de résidence, qui peuvent avoir des règles de protection des données différentes.',
        children_privacy_title: '7. Confidentialité des Enfants',
        children_privacy_content: 'Nos Services ne sont pas destinés ou dirigés vers les enfants de moins de 16 ans (ou l\'âge minimum équivalent dans la juridiction pertinente). Nous ne collectons pas sciemment d\'informations personnelles d\'enfants. Si nous apprenons que nous avons collecté des informations personnelles d\'un enfant, nous prendrons des mesures pour supprimer ces informations le plus rapidement possible.',
        policy_changes_title: '8. Modifications de Cette Politique de Confidentialité',
        policy_changes_content: 'Nous pouvons mettre à jour cette Politique de Confidentialité de temps en temps. Si nous apportons des changements matériels, nous vous en informerons par l\'application, par e-mail, ou en vous demandant de consulter et d\'accepter la nouvelle version avant de continuer à utiliser les Services.',
        contact_title: '9. Nous Contacter',
        contact_content: 'Si vous avez des questions, préoccupations ou commentaires sur cette Politique de Confidentialité, n\'hésitez pas à nous contacter.<br><br><strong>Nom de l\'Entreprise :</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>E-mail :</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Adresse :</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Conditions de Service',
        contact_us: 'Nous Contacter'
      },
      ja: {
        privacy_policy_title: 'プライバシーポリシー',
        select_language: '言語を選択',
        effective_date: '発効日：2025年8月1日',
        introduction_title: 'はじめに',
        introduction_content: '私たちのアプリケーションへようこそ。このプライバシーポリシーは、重慶銀南科技有限公司（「当社」、「私たち」、または「当社」）が、お客様が当社のモバイルアプリケーション、ウェブサイト、および関連サービス（総称して「サービス」）を使用される際に、お客様の情報をどのように収集、使用、保存、開示するかを説明します。<br><br>お客様のプライバシーは当社にとって非常に重要です。このポリシーは、お客様のプライバシー権と当社がお客様のデータをどのように保護するかを理解していただくために設計されています。当社のサービスにアクセスまたは使用することにより、お客様は、このプライバシーポリシーおよび利用規約に記載されているとおり、お客様の個人情報の収集、保存、使用、および開示を読み、理解し、同意したことを表明します。',
        info_collect_title: '1. 収集する情報',
        info_collect_intro: 'サービスの提供と改善のため、当社は複数の方法で情報を収集します。',
        info_direct_title: 'A. お客様が直接提供される情報',
        info_direct_content: 'アカウントの作成、サポートへのお問い合わせ、またはその他の方法でサービスをご利用いただく際に、以下の個人情報を収集することがあります：<br><br><strong>アカウント情報：</strong>お名前、メールアドレス、電話番号。<br><strong>ユーザーコンテンツ：</strong>サービスのご利用中に作成、インポート、またはアップロードされる写真、メモ、その他の情報。<br><strong>ソーシャルネットワーク情報：</strong>ソーシャルネットワークを通じてログインを選択された場合、そのプラットフォームでのプライバシー設定に従って、ソーシャルネットワークプロフィールから情報を受け取ることがあります。<br><strong>位置情報データ：</strong>位置ベースの機能を提供するため、お客様の明示的な同意のもと、正確な位置（GPSデータ）を収集することがあります。これはデバイス設定でいつでも無効にできます。',
        info_auto_title: 'B. 自動的に収集される情報',
        info_auto_content: 'サービスをご利用いただく際、お客様のデバイスから特定の技術情報を自動的に収集します：<br><br><strong>デバイス情報：</strong>デバイスタイプ、ハードウェアモデル、オペレーティングシステムとバージョン、固有デバイス識別子（UDI）、デバイス設定。<br><strong>使用データ：</strong>お客様がサービスとどのように相互作用するかの情報、例えば使用される機能、使用頻度、クラッシュレポート、パフォーマンスデータ。当社はCookieまたは類似技術を通じてこの情報を収集し、サービスの安定性と機能性を向上させます。<br><br>この自動収集される情報は通常集約または匿名化され、お客様を個人的に識別するために使用されることはありません。',
        info_use_title: '2. 情報の使用方法',
        info_use_content: '当社は収集した情報を以下の目的で使用します：<br><br><strong>サービスの提供と維持：</strong>お客様のアカウント作成、コア機能の提供、サービスの正常な動作の確保。<br><strong>サービスの改善とパーソナライゼーション：</strong>ユーザーがサービスとどのように相互作用するかの理解、よりパーソナライズされた体験の提供、新機能の開発。<br><strong>お客様とのコミュニケーション：</strong>技術的通知、セキュリティアラート、アップデート、マーケティング資料の送信、お客様のコメント、質問、カスタマーサービス要求への回答。<br><br><strong>安全とセキュリティ：</strong>不正取引、不正アクセス、その他の違法活動の調査と防止、利用規約の実施。',
        info_share_title: '3. 情報の共有方法',
        info_share_intro: '当社はお客様の個人情報を販売しません。以下の状況でのみ第三者と情報を共有します：',
        third_party_title: 'A. 第三者サービスプロバイダーとの共有',
        third_party_content: '当社は、サービスの運営、提供、改善、マーケティングを支援する第三者パートナーと協力しています。これらのパートナーは契約上お客様のデータを保護する義務があり、当社が指定する目的にのみ使用が制限されています。以下のサービスと情報を共有する場合があります：<br><br><strong>分析とクラッシュレポート：</strong>使用パターンの理解とバグ修正の支援。<br>例：Google Analytics for Firebase、Firebase Crashlytics<br><br><strong>広告：</strong>アプリ内での広告表示。これらのサービスは、パーソナライズされた広告を表示するためにデバイス識別子を収集する場合があります。通常、デバイス設定でパーソナライズ広告をオプトアウトできます。<br>例：AdMob、Meta（Facebook）、AppLovin、Vungle、ironSource、Pangle等<br><br><strong>クラウドホスティング：</strong>データの安全な保存。<br>例：Amazon Web Services（AWS）<br><br>これらの第三者サービスは、GDPRなどの主要なデータ保護規制に準拠しています。それらのデータ慣行を理解するため、プライバシーポリシーの確認をお勧めします。',
        legal_reasons_title: 'B. 法的理由と権利保護のため',
        legal_reasons_content: '法律、召喚状、その他の法的手続きにより必要とされると判断した場合、または以下のために開示が合理的に必要であると善意で判断した場合、お客様の情報を開示することがあります：(i)任意の人の安全の保護、(ii)詐欺、セキュリティ、技術的問題への対処、または(iii)当社の権利や財産の保護。',
        with_consent_title: 'C. お客様の同意による共有',
        with_consent_content: 'お客様の明示的な同意を得て、その他の目的で情報を共有することがあります。例えば、お客様がアプリのコンテンツをメールやソーシャルメディアアカウントなど他のプラットフォームに共有することを選択される場合があります。',
        your_rights_title: '4. お客様の権利と選択',
        your_rights_content: '当社は、お客様が自分の情報をコントロールできるようにすることを信念としています。お客様の個人データに関して以下の権利があります：<br><br><strong>アクセスと訂正の権利：</strong>アプリの設定内で直接、アカウント情報の大部分にアクセスし更新できます。ご自身でアクセスできない情報については、当社までお問い合わせください。<br><br><strong>削除（消去）の権利：</strong>アカウントと関連する個人データの削除を要求できます。技術的理由により、バックアップシステムからの完全な消去には最大90日かかる場合があることをご了承ください。<br><br><strong>処理への異議申し立ての権利：</strong>ダイレクトマーケティングなど、特定の目的での個人データ処理に異議を申し立てる権利があります。<br><br><strong>データポータビリティの権利：</strong>構造化された機械読み取り可能な形式で個人データのコピーを受け取る権利がある場合があります。<br><br><strong>同意撤回の権利：</strong>情報処理において同意に依存している場合（位置情報など）、いつでも同意を撤回できます。<br><br>これらの権利を行使するには、sven775288@gmail.comまでお問い合わせください。30日以内にご要求にお応えします。お客様保護のため、要求を処理する前に身元確認をお願いする場合があります。',
        data_security_title: '5. データセキュリティ',
        data_security_content: '当社は、お客様の情報を紛失、盗難、誤用、不正アクセスから保護するため、堅牢な管理的、技術的、物理的セキュリティ対策を実施しています。これらの対策には以下が含まれます：<br><br>転送中（SSL/TLS）および保存時のデータ暗号化。<br>必要な担当者のみがお客様のデータにアクセスできるようにする厳格なアクセス制御。<br>定期的なセキュリティ評価と脆弱性スキャン。<br><br>ただし、完全に安全なシステムは存在しません。お客様のデータを保護するよう努めていますが、絶対的な安全性を保証することはできません。',
        data_transfers_title: '6. 国際データ転送',
        data_transfers_content: '当社のサービスはAmazon Web Services（AWS）によってホストされており、お客様の情報は世界各国のサーバーに保存・処理される場合があります。サービスを使用することにより、お客様は、異なるデータ保護規則を持つ可能性のある居住国外での情報の転送、処理、保存について理解し、同意されます。',
        children_privacy_title: '7. 児童のプライバシー',
        children_privacy_content: '当社のサービスは、16歳未満（または関連する管轄区域での同等の最低年齢）の児童を対象としたものではなく、児童に向けられたものでもありません。当社は故意に児童から個人情報を収集しません。児童から個人情報を収集したことが判明した場合、可能な限り速やかにその情報を削除する措置を取ります。',
        policy_changes_title: '8. このプライバシーポリシーの変更',
        policy_changes_content: '当社は時々このプライバシーポリシーを更新することがあります。重要な変更を行う場合、アプリ、メール、またはサービスの継続使用前に新バージョンの確認と受諾を求めることにより、お客様に通知します。',
        contact_title: '9. お問い合わせ',
        contact_content: 'このプライバシーポリシーについてご質問、ご懸念、フィードバックがございましたら、お気軽にお問い合わせください。<br><br><strong>会社名：</strong>重慶銀南科技有限公司<br><strong>メール：</strong><a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>住所：</strong>中国重慶市両江新区魚嘴鎮河旭路172号5号楼2階',
        terms_of_service: '利用規約',
        contact_us: 'お問い合わせ'
      },
      ko: {
        privacy_policy_title: '개인정보처리방침',
        select_language: '언어 선택',
        effective_date: '시행일: 2025년 8월 1일',
        introduction_title: '소개',
        introduction_content: '저희 애플리케이션에 오신 것을 환영합니다. 이 개인정보처리방침은 충칭인난기술유한공사("저희", "당사" 또는 "회사")가 귀하가 저희의 모바일 애플리케이션, 웹사이트 및 관련 서비스(총칭하여 "서비스")를 사용할 때 귀하의 정보를 어떻게 수집, 사용, 저장 및 공개하는지 설명합니다.<br><br>귀하의 개인정보보호는 저희에게 매우 중요합니다. 이 정책은 귀하의 개인정보보호 권리와 저희가 귀하의 데이터를 어떻게 보호하는지 이해하는 데 도움을 주기 위해 마련되었습니다. 저희 서비스에 액세스하거나 사용함으로써, 귀하는 이 개인정보처리방침 및 이용약관에 설명된 바와 같이 귀하의 개인정보 수집, 저장, 사용 및 공개를 읽고 이해하며 동의한다는 것을 표명합니다.',
        info_collect_title: '1. 수집하는 정보',
        info_collect_intro: '서비스를 제공하고 개선하기 위해 여러 방법으로 정보를 수집합니다.',
        info_direct_title: 'A. 귀하가 직접 제공하는 정보',
        info_direct_content: '계정을 생성하거나, 지원을 위해 저희에게 연락하거나, 기타 방법으로 서비스를 사용할 때 다음과 같은 개인정보를 수집할 수 있습니다:<br><br><strong>계정 정보:</strong> 이름, 이메일 주소, 전화번호.<br><strong>사용자 콘텐츠:</strong> 서비스 사용 중 생성, 가져오기 또는 업로드하는 사진, 메모 및 기타 정보.<br><strong>소셜 네트워크 정보:</strong> 소셜 네트워크를 통해 로그인하기로 선택하는 경우, 해당 플랫폼의 개인정보 설정에 따라 소셜 네트워크 프로필에서 정보를 받을 수 있습니다.<br><strong>위치 정보 데이터:</strong> 위치 기반 기능을 제공하기 위해 명시적인 동의 하에 정확한 위치(GPS 데이터)를 수집할 수 있습니다. 언제든지 기기 설정에서 이를 비활성화할 수 있습니다.',
        info_auto_title: 'B. 자동으로 수집되는 정보',
        info_auto_content: '서비스를 사용할 때 기기에서 특정 기술적 정보를 자동으로 수집합니다:<br><br><strong>기기 정보:</strong> 기기 유형, 하드웨어 모델, 운영 체제 및 버전, 고유 기기 식별자(UDI), 기기 설정.<br><strong>사용 데이터:</strong> 사용된 기능, 사용 빈도, 충돌 보고서, 성능 데이터 등 서비스와 상호 작용하는 방법에 대한 정보. 서비스의 안정성과 기능을 개선하기 위해 쿠키나 유사한 기술을 통해 이를 수집합니다.<br><br>자동으로 수집되는 이 정보는 일반적으로 집계되거나 비식별화되며 개인을 식별하는 데 사용되지 않습니다.',
        info_use_title: '2. 정보 사용 방법',
        info_use_content: '수집한 정보를 다음 목적으로 사용합니다:<br><br><strong>서비스 제공 및 유지:</strong> 계정 생성, 핵심 기능 제공, 서비스의 올바른 작동 보장.<br><strong>서비스 개선 및 개인화:</strong> 사용자가 서비스와 상호 작용하는 방법 이해, 더 개인화된 경험 제공, 새로운 기능 개발.<br><br><strong>의사소통:</strong> 기술적 통지, 보안 경고, 업데이트, 마케팅 자료 전송 및 의견, 질문, 고객 서비스 요청에 대한 응답.<br><br><strong>안전 및 보안:</strong> 사기 거래, 무단 액세스 및 기타 불법 활동 조사 및 방지, 이용약관 시행.',
        info_share_title: '3. 정보 공유 방법',
        info_share_intro: '개인정보를 판매하지 않습니다. 다음과 같은 경우에만 제3자와 정보를 공유합니다:',
        third_party_title: 'A. 제3자 서비스 제공업체와',
        third_party_content: '서비스 운영, 제공, 개선 및 마케팅을 지원하는 제3자 파트너와 협력합니다. 이들 파트너는 계약상 귀하의 데이터를 보호할 의무가 있으며 저희가 지정한 목적으로만 사용하도록 제한됩니다. 다음 서비스와 정보를 공유할 수 있습니다:<br><br><strong>분석 및 충돌 보고:</strong> 사용 패턴을 이해하고 버그를 수정하는 데 도움.<br>예시: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>광고:</strong> 앱 내 광고 표시. 이러한 서비스는 개인화된 광고를 표시하기 위해 기기 식별자를 수집할 수 있습니다. 일반적으로 기기 설정에서 개인화된 광고를 거부할 수 있습니다.<br>예시: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle 등<br><br><strong>클라우드 호스팅:</strong> 데이터를 안전하게 저장.<br>예시: Amazon Web Services (AWS)<br><br>이러한 제3자 서비스는 GDPR과 같은 주요 데이터 보호 규정을 준수합니다. 데이터 관행을 이해하기 위해 개인정보처리방침을 검토하시기 바랍니다.',
        legal_reasons_title: 'B. 법적 사유 및 권리 보호를 위해',
        legal_reasons_content: '법률, 소환장 또는 기타 법적 절차에 의해 요구된다고 판단하거나, (i) 개인의 안전 보호, (ii) 사기, 보안 또는 기술적 문제 해결, (iii) 저희의 권리나 재산 보호를 위해 공개가 합리적으로 필요하다고 선의로 판단하는 경우 귀하의 정보를 공개할 수 있습니다.',
        with_consent_title: 'C. 귀하의 동의로',
        with_consent_content: '명시적인 동의를 받아 다른 목적으로 정보를 공유할 수 있습니다. 예를 들어, 앱의 콘텐츠를 이메일이나 소셜 미디어 계정과 같은 다른 플랫폼에 공유하기로 선택할 수 있습니다.',
        your_rights_title: '4. 귀하의 권리와 선택',
        your_rights_content: '정보에 대한 통제권을 제공하는 것을 믿습니다. 개인 데이터와 관련하여 다음과 같은 권리가 있습니다:<br><br><strong>액세스 및 수정 권리:</strong> 앱 설정에서 직접 대부분의 계정 정보에 액세스하고 업데이트할 수 있습니다. 직접 액세스할 수 없는 정보가 있으면 저희에게 연락하십시오.<br><strong>삭제(소거) 권리:</strong> 계정 및 관련 개인 데이터의 삭제를 요청할 수 있습니다. 기술적 이유로 백업 시스템에서 완전한 소거는 최대 90일이 걸릴 수 있습니다.<br><strong>처리 거부 권리:</strong> 직접 마케팅과 같은 특정 목적으로 개인 데이터를 처리하는 것에 반대할 권리가 있습니다.<br><strong>데이터 이동 권리:</strong> 구조화되고 기계가 읽을 수 있는 형식으로 개인 데이터 사본을 받을 권리가 있을 수 있습니다.<br><strong>동의 철회 권리:</strong> 정보 처리에 대한 동의(위치 정보 등)에 의존하는 경우 언제든지 철회할 수 있습니다.<br><br>이러한 권리 중 하나를 행사하려면 sven775288@gmail.com으로 연락하십시오. 30일 이내에 요청에 응답합니다. 보호를 위해 요청 처리 전에 신원 확인을 요구할 수 있습니다.',
        data_security_title: '5. 데이터 보안',
        data_security_content: '정보를 분실, 도난, 오용 및 무단 액세스로부터 보호하기 위해 강력한 관리적, 기술적, 물리적 보안 조치를 실시합니다. 이러한 조치에는 다음이 포함됩니다:<br><br>전송 중(SSL/TLS) 및 저장 시 데이터 암호화.<br>필요한 직원만 데이터에 액세스할 수 있도록 하는 엄격한 액세스 제어.<br>정기적인 보안 평가 및 취약점 스캔.<br><br>그러나 완벽한 보안 시스템은 없습니다. 데이터 보호를 위해 노력하지만 절대적인 보안을 보장할 수는 없습니다.',
        data_transfers_title: '6. 국제 데이터 전송',
        data_transfers_content: '서비스는 Amazon Web Services(AWS)에서 호스팅되며, 귀하의 정보는 전 세계 여러 국가의 서버에 저장되고 처리될 수 있습니다. 서비스를 사용함으로써 다른 데이터 보호 규칙이 있을 수 있는 거주 국가 외부의 국가로 정보의 전송, 처리 및 저장에 동의하고 이를 이해합니다.',
        children_privacy_title: '7. 아동 개인정보보호',
        children_privacy_content: '서비스는 16세 미만(또는 관련 관할권의 해당 최소 연령) 아동을 대상으로 하거나 지향하지 않습니다. 고의로 아동으로부터 개인정보를 수집하지 않습니다. 아동으로부터 개인정보를 수집했다는 것을 알게 되면 가능한 한 빨리 해당 정보를 삭제하는 조치를 취합니다.',
        policy_changes_title: '8. 개인정보처리방침 변경',
        policy_changes_content: '때때로 이 개인정보처리방침을 업데이트할 수 있습니다. 중요한 변경 사항이 있는 경우 앱을 통해, 이메일로, 또는 서비스를 계속 사용하기 전에 새 버전을 검토하고 수락하도록 요구함으로써 알려드립니다.',
        contact_title: '9. 연락처',
        contact_content: '이 개인정보처리방침에 대한 질문, 우려 사항 또는 피드백이 있으시면 주저하지 마시고 연락하십시오.<br><br><strong>회사명:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>이메일:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><br><strong>주소:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: '서비스 이용약관',
        contact_us: '문의하기'
      },
      pt: {
        privacy_policy_title: 'Política de Privacidade',
        select_language: 'Selecionar Idioma',
        effective_date: 'Data de Vigência: 1 de agosto de 2025',
        introduction_title: 'Introdução',
        introduction_content: 'Bem-vindo à nossa aplicação. Esta Política de Privacidade explica como a Chongqing Yinnan Technology Co., Ltd. ("nós", "nosso" ou "nossa empresa") coleta, utiliza, armazena e divulga suas informações quando você usa nossos aplicativos móveis, sites e serviços relacionados (coletivamente, os "Serviços").<br><br>Sua privacidade é extremamente importante para nós. Esta política foi projetada para ajudá-lo a entender seus direitos de privacidade e como protegemos seus dados. Ao acessar ou usar nossos Serviços, você confirma que leu, entendeu e concorda com nossa coleta, armazenamento, uso e divulgação de suas informações pessoais conforme descrito nesta Política de Privacidade e nossos Termos de Uso.',
        info_collect_title: '1. Informações que Coletamos',
        info_collect_intro: 'Para fornecer e melhorar nossos Serviços, coletamos informações de várias maneiras.',
        info_direct_title: 'A. Informações que Você Nos Fornece Diretamente',
        info_direct_content: 'Quando você cria uma conta, nos contata para suporte ou usa os Serviços de outra forma, podemos coletar as seguintes informações pessoais:<br><br><strong>Informações da Conta:</strong> Seu nome, endereço de e-mail, número de telefone.<br><strong>Conteúdo do Usuário:</strong> Fotos, notas e outras informações que você cria, importa ou carrega ao usar os Serviços.<br><strong>Informações de Rede Social:</strong> Se você escolher fazer login por meio de uma rede social, podemos receber informações do seu perfil de rede social, sujeito às suas configurações de privacidade nessa plataforma.<br><strong>Dados de Geolocalização:</strong> Podemos coletar sua localização precisa (dados GPS) com seu consentimento explícito para fornecer recursos baseados em localização. Você pode desativar isso a qualquer momento nas configurações do seu dispositivo.',
        info_auto_title: 'B. Informações que Coletamos Automaticamente',
        info_auto_content: 'Quando você usa nossos Serviços, coletamos automaticamente certas informações técnicas do seu dispositivo:<br><br><strong>Informações do Dispositivo:</strong> Tipo de dispositivo, modelo de hardware, sistema operacional e versão, identificadores únicos de dispositivo (UDIs) e configurações do dispositivo.<br><strong>Dados de Uso:</strong> Informações sobre como você interage com nossos Serviços, como recursos usados, frequência de uso, relatórios de falhas e dados de desempenho. Coletamos isso via cookies ou tecnologias similares para melhorar a estabilidade e funcionalidade dos nossos Serviços.<br><br>Essas informações coletadas automaticamente são tipicamente agregadas ou desidentificadas e não são usadas para identificá-lo pessoalmente.',
        info_use_title: '2. Como Usamos Suas Informações',
        info_use_content: 'Usamos as informações coletadas para os seguintes propósitos:<br><br><strong>Para Fornecer e Manter os Serviços:</strong> Para criar sua conta, fornecer recursos principais e garantir que nossos Serviços funcionem corretamente.<br><strong>Para Melhorar e Personalizar os Serviços:</strong> Para entender como nossos usuários interagem com os Serviços, oferecer uma experiência mais personalizada e desenvolver novos recursos.<br><strong>Para Comunicar com Você:</strong> Para enviar avisos técnicos, alertas de segurança, atualizações, materiais de marketing e responder a seus comentários, perguntas e solicitações de atendimento ao cliente.<br><strong>Para Segurança e Proteção:</strong> Para investigar e prevenir transações fraudulentas, acesso não autorizado e outras atividades ilegais, e fazer cumprir nossos Termos de Uso.',
        info_share_title: '3. Como Compartilhamos Suas Informações',
        info_share_intro: 'Não vendemos suas informações pessoais. Compartilhamos suas informações com terceiros apenas nas seguintes circunstâncias:',
        third_party_title: 'A. Com Provedores de Serviços Terceiros',
        third_party_content: 'Trabalhamos com parceiros terceiros para nos ajudar a operar, fornecer, melhorar e comercializar nossos Serviços. Esses parceiros são contratualmente obrigados a proteger seus dados e são restritos a usá-los apenas para os propósitos que especificamos. Podemos compartilhar informações com serviços para:<br><br><strong>Análises e Relatórios de Falhas:</strong> Para nos ajudar a entender padrões de uso e corrigir bugs.<br>Exemplos: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Publicidade:</strong> Para exibir anúncios em nosso aplicativo. Esses serviços podem coletar identificadores de dispositivo para mostrar anúncios personalizados. Você geralmente pode optar por não receber publicidade personalizada nas configurações do seu dispositivo.<br>Exemplos: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, etc.<br><br><strong>Hospedagem em Nuvem:</strong> Para armazenar seus dados com segurança.<br>Exemplo: Amazon Web Services (AWS)<br><br>Esses serviços terceiros estão em conformidade com as principais regulamentações de proteção de dados como GDPR. Encorajamos você a revisar suas políticas de privacidade para entender suas práticas de dados.',
        legal_reasons_title: 'B. Por Razões Legais e para Proteger Nossos Direitos',
        legal_reasons_content: 'Podemos divulgar suas informações se acreditarmos que é exigido por lei, intimação ou outro processo legal, ou se tivermos uma crença de boa fé de que a divulgação é razoavelmente necessária para (i) proteger a segurança de qualquer pessoa, (ii) abordar fraude, segurança ou questões técnicas, ou (iii) proteger nossos direitos ou propriedade.',
        with_consent_title: 'C. Com Seu Consentimento',
        with_consent_content: 'Podemos compartilhar suas informações para outros propósitos com seu consentimento explícito. Por exemplo, você pode escolher compartilhar conteúdo de nosso aplicativo para outras plataformas como seus e-mails ou contas de mídia social.',
        your_rights_title: '4. Seus Direitos e Escolhas',
        your_rights_content: 'Acreditamos em dar a você controle sobre suas informações. Você tem os seguintes direitos em relação aos seus dados pessoais:<br><br><strong>Direito de Acesso e Correção:</strong> Você pode acessar e atualizar a maioria das informações da sua conta diretamente nas configurações do aplicativo. Para qualquer informação que você não possa acessar sozinho, pode nos contatar.<br><strong>Direito de Exclusão (Apagamento):</strong> Você pode solicitar a exclusão da sua conta e dados pessoais associados. Note que por razões técnicas, o apagamento completo dos nossos sistemas de backup pode levar até 90 dias.<br><strong>Direito de Objeção ao Processamento:</strong> Você tem o direito de se opor ao processamento dos seus dados pessoais para certos propósitos, como marketing direto.<br><strong>Direito à Portabilidade de Dados:</strong> Você pode ter o direito de receber uma cópia dos seus dados pessoais em um formato estruturado e legível por máquina.<br><strong>Direito de Retirar Consentimento:</strong> Onde dependemos do seu consentimento para processar informações (como para geolocalização), você pode retirá-lo a qualquer momento.<br><br>Para exercer qualquer desses direitos, entre em contato conosco em sven775288@gmail.com. Responderemos à sua solicitação em 30 dias. Para sua proteção, podemos exigir que você verifique sua identidade antes de processarmos sua solicitação.',
        data_security_title: '5. Segurança de Dados',
        data_security_content: 'Implementamos medidas de segurança administrativas, técnicas e físicas robustas para proteger suas informações contra perda, roubo, uso indevido e acesso não autorizado. Essas medidas incluem:<br><br>Criptografia de dados em trânsito (SSL/TLS) e em repouso.<br>Controles de acesso rigorosos para garantir que apenas o pessoal necessário possa acessar seus dados.<br>Avaliações de segurança regulares e varredura de vulnerabilidades.<br><br>No entanto, nenhum sistema de segurança é impenetrável. Embora nos esforcemos para proteger seus dados, não podemos garantir sua segurança absoluta.',
        data_transfers_title: '6. Transferências Internacionais de Dados',
        data_transfers_content: 'Nossos Serviços são hospedados pela Amazon Web Services (AWS), e suas informações podem ser armazenadas e processadas em servidores localizados em vários países ao redor do mundo. Ao usar nossos Serviços, você entende e consente com a transferência, processamento e armazenamento de suas informações em países fora do seu país de residência, que podem ter regras diferentes de proteção de dados.',
        children_privacy_title: '7. Privacidade de Crianças',
        children_privacy_content: 'Nossos Serviços não são destinados ou direcionados para crianças menores de 16 anos (ou a idade mínima equivalente na jurisdição relevante). Não coletamos conscientemente informações pessoais de crianças. Se soubermos que coletamos informações pessoais de uma criança, tomaremos medidas para excluir essas informações o mais rapidamente possível.',
        policy_changes_title: '8. Mudanças nesta Política de Privacidade',
        policy_changes_content: 'Podemos atualizar esta Política de Privacidade de tempos em tempos. Se fizermos mudanças materiais, notificaremos você através do aplicativo, por e-mail, ou exigindo que você revise e aceite a nova versão antes de continuar a usar os Serviços.',
        contact_title: '9. Entre em Contato Conosco',
        contact_content: 'Se você tiver alguma pergunta, preocupação ou feedback sobre esta Política de Privacidade, não hesite em nos contatar.<br><br><strong>Nome da Empresa:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>E-mail:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Endereço:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Termos de Serviço',
        contact_us: 'Entre em Contato'
      },
      ru: {
        privacy_policy_title: 'Политика Конфиденциальности',
        select_language: 'Выбрать Язык',
        effective_date: 'Дата вступления в силу: 1 августа 2025 г.',
        introduction_title: 'Введение',
        introduction_content: 'Добро пожаловать в наше приложение. Данная Политика Конфиденциальности объясняет, как компания Chongqing Yinnan Technology Co., Ltd. ("мы", "наш" или "наша компания") собирает, использует, хранит и раскрывает вашу информацию при использовании вами наших мобильных приложений, веб-сайтов и связанных услуг (совместно именуемых "Услуги").<br><br>Ваша конфиденциальность чрезвычайно важна для нас. Данная политика разработана, чтобы помочь вам понять ваши права на конфиденциальность и то, как мы защищаем ваши данные. Получая доступ к нашим Услугам или используя их, вы подтверждаете, что прочитали, поняли и согласились с нашим сбором, хранением, использованием и раскрытием вашей личной информации, как описано в данной Политике Конфиденциальности и наших Условиях Использования.',
        info_collect_title: '1. Информация, которую мы собираем',
        info_collect_intro: 'Для предоставления и улучшения наших Услуг мы собираем информацию несколькими способами.',
        info_direct_title: 'А. Информация, которую вы предоставляете нам напрямую',
        info_direct_content: 'Когда вы создаете учетную запись, обращаетесь к нам за поддержкой или иным образом используете Услуги, мы можем собирать следующую личную информацию:<br><br><strong>Информация об учетной записи:</strong> Ваше имя, адрес электронной почты, номер телефона.<br><strong>Пользовательский контент:</strong> Фотографии, заметки и другая информация, которую вы создаете, импортируете или загружаете при использовании Услуг.<br><strong>Информация из социальных сетей:</strong> Если вы выбираете вход через социальную сеть, мы можем получать информацию из вашего профиля в социальной сети в соответствии с вашими настройками конфиденциальности на этой платформе.<br><strong>Данные геолокации:</strong> Мы можем собирать ваше точное местоположение (данные GPS) с вашего явного согласия для предоставления функций на основе местоположения. Вы можете отключить это в любое время в настройках вашего устройства.',
        info_auto_title: 'Б. Информация, которую мы собираем автоматически',
        info_auto_content: 'Когда вы используете наши Услуги, мы автоматически собираем определенную техническую информацию с вашего устройства:<br><br><strong>Информация об устройстве:</strong> Тип устройства, модель оборудования, операционная система и версия, уникальные идентификаторы устройства (UDI) и настройки устройства.<br><strong>Данные об использовании:</strong> Информация о том, как вы взаимодействуете с нашими Услугами, такая как используемые функции, частота использования, отчеты о сбоях и данные о производительности. Мы собираем это через файлы cookie или аналогичные технологии для улучшения стабильности и функциональности наших Услуг.<br><br>Эта автоматически собираемая информация обычно агрегируется или деидентифицируется и не используется для личной идентификации.',
        info_use_title: '2. Как мы используем вашу информацию',
        info_use_content: 'Мы используем собранную информацию для следующих целей:<br><br><strong>Для предоставления и поддержания Услуг:</strong> Для создания вашей учетной записи, предоставления основных функций и обеспечения правильной работы наших Услуг.<br><strong>Для улучшения и персонализации Услуг:</strong> Для понимания того, как наши пользователи взаимодействуют с Услугами, предоставления более персонализированного опыта и разработки новых функций.<br><strong>Для общения с вами:</strong> Для отправки технических уведомлений, предупреждений безопасности, обновлений, маркетинговых материалов и ответов на ваши комментарии, вопросы и запросы службы поддержки.<br><strong>Для безопасности и защиты:</strong> Для расследования и предотвращения мошеннических транзакций, несанкционированного доступа и других незаконных действий, а также для обеспечения соблюдения наших Условий использования.',
        info_share_title: '3. Как мы делимся вашей информацией',
        info_share_intro: 'Мы не продаем вашу личную информацию. Мы делимся вашей информацией с третьими лицами только в следующих обстоятельствах:',
        third_party_title: 'А. С поставщиками услуг третьих лиц',
        third_party_content: 'Мы работаем с партнерами третьих лиц, чтобы помочь нам управлять, предоставлять, улучшать и продвигать наши Услуги. Эти партнеры договорно обязаны защищать ваши данные и ограничены в их использовании только для целей, которые мы указываем. Мы можем делиться информацией с услугами для:<br><br><strong>Аналитика и отчеты о сбоях:</strong> Чтобы помочь нам понимать модели использования и исправлять ошибки.<br>Примеры: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Реклама:</strong> Для отображения рекламы в нашем приложении. Эти службы могут собирать идентификаторы устройств для показа персонализированной рекламы. Обычно вы можете отказаться от персонализированной рекламы в настройках вашего устройства.<br>Примеры: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle и др.<br><br><strong>Облачный хостинг:</strong> Для безопасного хранения ваших данных.<br>Пример: Amazon Web Services (AWS)<br><br>Эти сторонние службы соответствуют основным регулированиям защиты данных, таким как GDPR. Мы рекомендуем вам ознакомиться с их политиками конфиденциальности, чтобы понимать их практики работы с данными.',
        legal_reasons_title: 'Б. По правовым причинам и для защиты наших прав',
        legal_reasons_content: 'Мы можем раскрывать вашу информацию, если мы считаем, что это требуется по закону, повестке или другому правовому процессу, или если у нас есть добросовестная вера в то, что раскрытие разумно необходимо для (i) защиты безопасности любого лица, (ii) решения вопросов мошенничества, безопасности или технических проблем, или (iii) защиты наших прав или собственности.',
        with_consent_title: 'В. С вашего согласия',
        with_consent_content: 'Мы можем делиться вашей информацией для других целей с вашего явного согласия. Например, вы можете выбрать поделиться контентом из нашего приложения на других платформах, таких как ваша электронная почта или учетные записи в социальных сетях.',
        your_rights_title: '4. Ваши права и выбор',
        your_rights_content: 'Мы верим в предоставление вам контроля над вашей информацией. У вас есть следующие права в отношении ваших персональных данных:<br><br><strong>Право на доступ и исправление:</strong> Вы можете получать доступ и обновлять большую часть информации вашей учетной записи непосредственно в настройках приложения. Для любой информации, к которой вы не можете получить доступ самостоятельно, вы можете связаться с нами.<br><strong>Право на удаление (стирание):</strong> Вы можете запросить удаление вашей учетной записи и связанных персональных данных. Обратите внимание, что по техническим причинам полное стирание из наших резервных систем может занять до 90 дней.<br><strong>Право возразить против обработки:</strong> У вас есть право возразить против обработки нами ваших персональных данных для определенных целей, таких как прямой маркетинг.<br><strong>Право на портативность данных:</strong> Вы можете иметь право получить копию ваших персональных данных в структурированном, машиночитаемом формате.<br><strong>Право отозвать согласие:</strong> Где мы полагаемся на ваше согласие для обработки информации (например, для геолокации), вы можете отозвать его в любое время.<br><br>Для осуществления любого из этих прав, пожалуйста, свяжитесь с нами по адресу sven775288@gmail.com. Мы ответим на ваш запрос в течение 30 дней. Для вашей защиты мы можем потребовать от вас подтверждения вашей личности перед обработкой вашего запроса.',
        data_security_title: '5. Безопасность данных',
        data_security_content: 'Мы внедряем надежные административные, технические и физические меры безопасности для защиты вашей информации от потери, кражи, неправильного использования и несанкционированного доступа. Эти меры включают:<br><br>Шифрование данных в процессе передачи (SSL/TLS) и в покое.<br>Строгие средства контроля доступа, чтобы обеспечить доступ к вашим данным только необходимого персонала.<br>Регулярные оценки безопасности и сканирование уязвимостей.<br><br>Однако ни одна система безопасности не является непроницаемой. Хотя мы стремимся защищать ваши данные, мы не можем гарантировать их абсолютную безопасность.',
        data_transfers_title: '6. Международные передачи данных',
        data_transfers_content: 'Наши Услуги размещены на Amazon Web Services (AWS), и ваша информация может храниться и обрабатываться на серверах, расположенных в различных странах по всему миру. Используя наши Услуги, вы понимаете и соглашаетесь на передачу, обработку и хранение вашей информации в странах за пределами страны вашего проживания, которые могут иметь различные правила защиты данных.',
        children_privacy_title: '7. Конфиденциальность детей',
        children_privacy_content: 'Наши Услуги не предназначены и не направлены на детей младше 16 лет (или эквивалентного минимального возраста в соответствующей юрисдикции). Мы не собираем сознательно персональную информацию от детей. Если мы узнаем, что собрали персональную информацию от ребенка, мы предпримем шаги для удаления этой информации как можно быстрее.',
        policy_changes_title: '8. Изменения в данной Политике Конфиденциальности',
        policy_changes_content: 'Мы можем время от времени обновлять данную Политику Конфиденциальности. Если мы вносим существенные изменения, мы уведомим вас через приложение, по электронной почте или потребовав от вас ознакомиться и принять новую версию перед продолжением использования Услуг.',
        contact_title: '9. Свяжитесь с нами',
        contact_content: 'Если у вас есть какие-либо вопросы, опасения или отзывы об этой Политике Конфиденциальности, пожалуйста, не стесняйтесь связаться с нами.<br><br><strong>Название компании:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>Электронная почта:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Адрес:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Условия Обслуживания',
        contact_us: 'Связаться с Нами'
      },
      hi: {
        privacy_policy_title: 'गोपनीयता नीति',
        select_language: 'भाषा चुनें',
        effective_date: 'प्रभावी तिथि: 1 अगस्त, 2025',
        introduction_title: 'परिचय',
        introduction_content: 'हमारे एप्लिकेशन में आपका स्वागत है। यह गोपनीयता नीति बताती है कि चोंगकिंग यिन्नान टेक्नोलॉजी कं, लिमिटेड ("हम", "हमारा" या "हमारी कंपनी") आपकी जानकारी को कैसे एकत्र, उपयोग, संग्रहीत और प्रकट करती है जब आप हमारे मोबाइल एप्लिकेशन, वेबसाइट और संबंधित सेवाओं (सामूहिक रूप से, "सेवाएं") का उपयोग करते हैं।<br><br>आपकी गोपनीयता हमारे लिए अत्यंत महत्वपूर्ण है। यह नीति आपको अपने गोपनीयता अधिकारों और हम आपके डेटा की सुरक्षा कैसे करते हैं, यह समझने में मदद करने के लिए डिज़ाइन की गई है। हमारी सेवाओं का उपयोग या पहुंच प्राप्त करके, आप पुष्टि करते हैं कि आपने इस गोपनीयता नीति और हमारी उपयोग की शर्तों में वर्णित अपनी व्यक्तिगत जानकारी के संग्रह, भंडारण, उपयोग और प्रकटीकरण को पढ़ा, समझा और सहमति दी है।',
        info_collect_title: '1. हम कौन सी जानकारी एकत्र करते हैं',
        info_collect_intro: 'हमारी सेवाएं प्रदान करने और सुधारने के लिए, हम कई तरीकों से जानकारी एकत्र करते हैं।',
        info_direct_title: 'A. आप जो जानकारी हमें सीधे प्रदान करते हैं',
        info_direct_content: 'जब आप खाता बनाते हैं, सहायता के लिए हमसे संपर्क करते हैं, या अन्यथा सेवाओं का उपयोग करते हैं, तो हम निम्नलिखित व्यक्तिगत जानकारी एकत्र कर सकते हैं:<br><br><strong>खाता जानकारी:</strong> आपका नाम, ईमेल पता, फोन नंबर।<br><strong>उपयोगकर्ता सामग्री:</strong> फोटो, नोट्स और अन्य जानकारी जो आप सेवाओं का उपयोग करते समय बनाते, आयात या अपलोड करते हैं।<br><strong>सामाजिक नेटवर्क जानकारी:</strong> यदि आप सामाजिक नेटवर्क के माध्यम से लॉग इन करना चुनते हैं, तो हम आपकी सामाजिक नेटवर्क प्रोफ़ाइल से जानकारी प्राप्त कर सकते हैं, जो उस प्लेटफ़ॉर्म पर आपकी गोपनीयता सेटिंग्स के अधीन है।<br><strong>भौगोलिक स्थान डेटा:</strong> स्थान-आधारित सुविधाएं प्रदान करने के लिए हम आपकी स्पष्ट सहमति से आपका सटीक स्थान (GPS डेटा) एकत्र कर सकते हैं। आप इसे अपने डिवाइस सेटिंग्स में किसी भी समय अक्षम कर सकते हैं।',
        info_auto_title: 'B. हम जो जानकारी स्वचालित रूप से एकत्र करते हैं',
        info_auto_content: 'जब आप हमारी सेवाओं का उपयोग करते हैं, तो हम आपके डिवाइस से कुछ तकनीकी जानकारी स्वचालित रूप से एकत्र करते हैं:<br><br><strong>डिवाइस जानकारी:</strong> डिवाइस का प्रकार, हार्डवेयर मॉडल, ऑपरेटिंग सिस्टम और संस्करण, अद्वितीय डिवाइस पहचानकर्ता (UDI), और डिवाइस सेटिंग्स।<br><strong>उपयोग डेटा:</strong> आप हमारी सेवाओं के साथ कैसे बातचीत करते हैं, इसकी जानकारी, जैसे उपयोग की गई सुविधाएं, उपयोग की आवृत्ति, क्रैश रिपोर्ट, और प्रदर्शन डेटा। हम हमारी सेवाओं की स्थिरता और कार्यक्षमता में सुधार के लिए कुकीज़ या समान तकनीकों के माध्यम से यह एकत्र करते हैं।<br><br>यह स्वचालित रूप से एकत्रित जानकारी आमतौर पर एकत्रित या डी-आइडेंटिफाइड होती है और व्यक्तिगत रूप से आपकी पहचान करने के लिए उपयोग नहीं की जाती।',
        info_use_title: '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
        info_use_content: 'हम एकत्रित जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:<br><br><strong>सेवाएं प्रदान करने और बनाए रखने के लिए:</strong> आपका खाता बनाने, मुख्य सुविधाएं प्रदान करने और यह सुनिश्चित करने के लिए कि हमारी सेवाएं सही तरीके से काम कर रही हैं।<br><strong>सेवाओं को सुधारने और व्यक्तिगत बनाने के लिए:</strong> यह समझने के लिए कि हमारे उपयोगकर्ता सेवाओं के साथ कैसे बातचीत करते हैं, अधिक व्यक्तिगत अनुभव प्रदान करने और नई सुविधाएं विकसित करने के लिए।<br><strong>आपके साथ संवाद करने के लिए:</strong> तकनीकी सूचनाएं, सुरक्षा चेतावनी, अपडेट, मार्केटिंग सामग्री भेजने और आपकी टिप्पणियों, प्रश्नों और ग्राहक सेवा अनुरोधों का जवाब देने के लिए।<br><strong>सुरक्षा और संरक्षण के लिए:</strong> धोखाधड़ी के लेनदेन, अनधिकृत पहुंच और अन्य अवैध गतिविधियों की जांच और रोकथाम के लिए, और हमारी उपयोग की शर्तों को लागू करने के लिए।',
        info_share_title: '3. हम आपकी जानकारी कैसे साझा करते हैं',
        info_share_intro: 'हम आपकी व्यक्तिगत जानकारी बेचते नहीं हैं। हम केवल निम्नलिखित परिस्थितियों में तीसरे पक्ष के साथ आपकी जानकारी साझा करते हैं:',
        third_party_title: 'A. तीसरे पक्ष की सेवा प्रदाताओं के साथ',
        third_party_content: 'हम तीसरे पक्ष के भागीदारों के साथ काम करते हैं जो हमारी सेवाओं को संचालित करने, प्रदान करने, सुधारने और विपणन करने में मदद करते हैं। ये भागीदार अनुबंधित रूप से आपके डेटा की सुरक्षा के लिए बाध्य हैं और केवल उन उद्देश्यों के लिए इसका उपयोग करने के लिए प्रतिबंधित हैं जो हम निर्दिष्ट करते हैं। हम निम्नलिखित सेवाओं के साथ जानकारी साझा कर सकते हैं:<br><br><strong>विश्लेषण और क्रैश रिपोर्टिंग:</strong> उपयोग के पैटर्न को समझने और बग्स को ठीक करने में हमारी मदद करने के लिए।<br>उदाहरण: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>विज्ञापन:</strong> हमारे ऐप के भीतर विज्ञापन प्रदर्शित करने के लिए। ये सेवाएं व्यक्तिगत विज्ञापन दिखाने के लिए डिवाइस पहचानकर्ता एकत्र कर सकती हैं। आप आमतौर पर अपने डिवाइस सेटिंग्स में व्यक्तिगत विज्ञापन से ऑप्ट-आउट कर सकते हैं।<br>उदाहरण: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle आदि<br><br><strong>क्लाउड होस्टिंग:</strong> आपके डेटा को सुरक्षित रूप से संग्रहीत करने के लिए।<br>उदाहरण: Amazon Web Services (AWS)<br><br>ये तीसरे पक्ष की सेवाएं GDPR जैसे प्रमुख डेटा सुरक्षा नियमों का अनुपालन करती हैं। हम आपको उनकी डेटा प्रथाओं को समझने के लिए उनकी गोपनीयता नीतियों की समीक्षा करने के लिए प्रोत्साहित करते हैं।',
        legal_reasons_title: 'B. कानूनी कारणों से और अपने अधिकारों की रक्षा के लिए',
        legal_reasons_content: 'हम आपकी जानकारी का खुलासा कर सकते हैं यदि हम मानते हैं कि यह कानून, सम्मन या अन्य कानूनी प्रक्रिया द्वारा आवश्यक है, या यदि हमारा अच्छा विश्वास है कि खुलासा उचित रूप से आवश्यक है (i) किसी भी व्यक्ति की सुरक्षा की रक्षा के लिए, (ii) धोखाधड़ी, सुरक्षा या तकनीकी मुद्दों को संबोधित करने के लिए, या (iii) हमारे अधिकारों या संपत्ति की रक्षा के लिए।',
        with_consent_title: 'C. आपकी सहमति के साथ',
        with_consent_content: 'हम आपकी स्पष्ट सहमति के साथ अन्य उद्देश्यों के लिए आपकी जानकारी साझा कर सकते हैं। उदाहरण के लिए, आप हमारे ऐप से सामग्री को अन्य प्लेटफॉर्म जैसे आपके ईमेल या सोशल मीडिया खातों में साझा करना चुन सकते हैं।',
        your_rights_title: '4. आपके अधिकार और विकल्प',
        your_rights_content: 'हम आपको अपनी जानकारी पर नियंत्रण देने में विश्वास करते हैं। आपके व्यक्तिगत डेटा के संबंध में आपके निम्नलिखित अधिकार हैं:<br><br><strong>पहुंच और सुधार का अधिकार:</strong> आप ऐप की सेटिंग्स में सीधे अपनी अधिकांश खाता जानकारी तक पहुंच सकते हैं और अपडेट कर सकते हैं। किसी भी जानकारी के लिए जो आप स्वयं एक्सेस नहीं कर सकते, आप हमसे संपर्क कर सकते हैं।<br><strong>विलोपन (मिटाने) का अधिकार:</strong> आप अपने खाते और संबंधित व्यक्तिगत डेटा के विलोपन का अनुरोध कर सकते हैं। कृपया ध्यान दें कि तकनीकी कारणों से, हमारे बैकअप सिस्टम से पूर्ण मिटाने में 90 दिन तक का समय लग सकता है।<br><strong>प्रसंस्करण पर आपत्ति का अधिकार:</strong> आपको हमारे द्वारा कुछ उद्देश्यों के लिए आपके व्यक्तिगत डेटा के प्रसंस्करण पर आपत्ति करने का अधिकार है, जैसे प्रत्यक्ष विपणन।<br><strong>डेटा पोर्टेबिलिटी का अधिकार:</strong> आपको संरचित, मशीन-पठनीय प्रारूप में अपने व्यक्तिगत डेटा की एक प्रति प्राप्त करने का अधिकार हो सकता है।<br><strong>सहमति वापस लेने का अधिकार:</strong> जहां हम जानकारी को प्रोसेस करने के लिए आपकी सहमति पर निर्भर करते हैं (जैसे भौगोलिक स्थान के लिए), आप इसे किसी भी समय वापस ले सकते हैं।<br><br>इनमें से किसी भी अधिकार का प्रयोग करने के लिए, कृपया sven775288@gmail.com पर हमसे संपर्क करें। हम 30 दिनों के भीतर आपके अनुरोध का जवाब देंगे। आपकी सुरक्षा के लिए, हम आपके अनुरोध को संसाधित करने से पहले आपकी पहचान सत्यापित करने की आवश्यकता हो सकती है।',
        data_security_title: '5. डेटा सुरक्षा',
        data_security_content: 'हम आपकी जानकारी को हानि, चोरी, दुरुपयोग और अनधिकृत पहुंच से बचाने के लिए मजबूत प्रशासनिक, तकनीकी और भौतिक सुरक्षा उपाय लागू करते हैं। इन उपायों में शामिल हैं:<br><br>ट्रांजिट (SSL/TLS) और विश्राम में डेटा एन्क्रिप्शन।<br>सख्त पहुंच नियंत्रण यह सुनिश्चित करने के लिए कि केवल आवश्यक कर्मचारी आपके डेटा तक पहुंच सकें।<br>नियमित सुरक्षा मूल्यांकन और भेद्यता स्कैनिंग।<br><br>हालांकि, कोई भी सुरक्षा प्रणाली अभेद्य नहीं है। हालांकि हम आपके डेटा की सुरक्षा के लिए प्रयास करते हैं, हम इसकी पूर्ण सुरक्षा की गारंटी नहीं दे सकते।',
        data_transfers_title: '6. अंतर्राष्ट्रीय डेटा स्थानांतरण',
        data_transfers_content: 'हमारी सेवाएं Amazon Web Services (AWS) द्वारा होस्ट की जाती हैं, और आपकी जानकारी दुनिया भर के विभिन्न देशों में स्थित सर्वर पर संग्रहीत और संसाधित हो सकती है। हमारी सेवाओं का उपयोग करके, आप अपने निवास देश के बाहर के देशों में अपनी जानकारी के स्थानांतरण, प्रसंस्करण और भंडारण को समझते हैं और सहमति देते हैं, जिनके अलग डेटा सुरक्षा नियम हो सकते हैं।',
        children_privacy_title: '7. बच्चों की गोपनीयता',
        children_privacy_content: 'हमारी सेवाएं 16 वर्ष से कम आयु के बच्चों (या संबंधित न्यायाधिकार में समकक्ष न्यूनतम आयु) के लिए अभिप्रेत या निर्देशित नहीं हैं। हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र नहीं करते हैं। यदि हमें पता चलता है कि हमने किसी बच्चे से व्यक्तिगत जानकारी एकत्र की है, तो हम उस जानकारी को यथाशीघ्र हटाने के लिए कदम उठाएंगे।',
        policy_changes_title: '8. इस गोपनीयता नीति में परिवर्तन',
        policy_changes_content: 'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। यदि हम महत्वपूर्ण परिवर्तन करते हैं, तो हम आपको ऐप के माध्यम से, ईमेल द्वारा, या सेवाओं का उपयोग जारी रखने से पहले नए संस्करण की समीक्षा और स्वीकार करने की आवश्यकता के द्वारा सूचित करेंगे।',
        contact_title: '9. हमसे संपर्क करें',
        contact_content: 'यदि इस गोपनीयता नीति के बारे में आपके कोई प्रश्न, चिंताएं या फीडबैक हैं, तो कृपया हमसे संपर्क करने में संकोच न करें।<br><br><strong>कंपनी का नाम:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>ईमेल:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>पता:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'सेवा की शर्तें',
        contact_us: 'संपर्क करें'
      },
      ur: {
        privacy_policy_title: 'پرائیویسی پالیسی',
        select_language: 'زبان منتخب کریں',
        effective_date: 'نافذ التاریخ: 1 اگست، 2025',
        introduction_title: 'تعارف',
        introduction_content: 'ہماری ایپلیکیشن میں خوش آمدید۔ یہ پرائیویسی پالیسی وضاحت کرتی ہے کہ چونگکنگ یننان ٹیکنالوجی کمپنی، لمیٹڈ ("ہم"، "ہمارا" یا "ہماری کمپنی") آپ کی معلومات کو کیسے جمع، استعمال، محفوظ اور ظاہر کرتی ہے جب آپ ہمارے موبائل ایپلیکیشنز، ویب سائٹس اور متعلقہ خدمات (مجموعی طور پر، "خدمات") استعمال کرتے ہیں۔<br><br>آپ کی پرائیویسی ہمارے لیے انتہائی اہم ہے۔ یہ پالیسی آپ کو اپنے پرائیویسی حقوق اور ہم آپ کے ڈیٹا کی حفاظت کیسے کرتے ہیں، یہ سمجھنے میں مدد کے لیے ڈیزائن کی گئی ہے۔ ہماری خدمات تک رسائی یا استعمال کرکے، آپ تصدیق کرتے ہیں کہ آپ نے اس پرائیویسی پالیسی اور ہماری استعمال کی شرائط میں بیان کردہ اپنی ذاتی معلومات کے جمع کرنے، محفوظ کرنے، استعمال اور انکشاف کو پڑھا، سمجھا اور اس سے اتفاق کیا ہے۔',
        info_collect_title: '1. ہم کون سی معلومات جمع کرتے ہیں',
        info_collect_intro: 'ہماری خدمات فراہم کرنے اور بہتر بنانے کے لیے، ہم کئی طریقوں سے معلومات جمع کرتے ہیں۔',
        info_direct_title: 'A. وہ معلومات جو آپ ہمیں براہ راست فراہم کرتے ہیں',
        info_direct_content: 'جب آپ اکاؤنٹ بناتے ہیں، مدد کے لیے ہم سے رابطہ کرتے ہیں، یا کسی اور طریقے سے خدمات استعمال کرتے ہیں، تو ہم مندرجہ ذیل ذاتی معلومات جمع کر سکتے ہیں:<br><br><strong>اکاؤنٹ کی معلومات:</strong> آپ کا نام، ای میل ایڈریس، فون نمبر۔<br><strong>صارف کا مواد:</strong> فوٹوز، نوٹس اور دیگر معلومات جو آپ خدمات استعمال کرتے وقت بناتے، درآمد یا اپ لوڈ کرتے ہیں۔<br><strong>سوشل نیٹ ورک کی معلومات:</strong> اگر آپ سوشل نیٹ ورک کے ذریعے لاگ ان کرنے کا انتخاب کرتے ہیں، تو ہم آپ کے سوشل نیٹ ورک پروفائل سے معلومات حاصل کر سکتے ہیں، جو اس پلیٹ فارم پر آپ کی پرائیویسی سیٹنگز کے تابع ہے۔<br><strong>جغرافیائی مقام کا ڈیٹا:</strong> ہم مقام پر مبنی خصوصیات فراہم کرنے کے لیے آپ کی واضح رضامندی سے آپ کا درست مقام (GPS ڈیٹا) جمع کر سکتے ہیں۔ آپ اسے اپنے ڈیوائس کی سیٹنگز میں کسی بھی وقت غیر فعال کر سکتے ہیں۔',
        info_auto_title: 'B. وہ معلومات جو ہم خودکار طور پر جمع کرتے ہیں',
        info_auto_content: 'جب آپ ہماری خدمات استعمال کرتے ہیں، تو ہم آپ کے ڈیوائس سے کچھ تکنیکی معلومات خودکار طور پر جمع کرتے ہیں:<br><br><strong>ڈیوائس کی معلومات:</strong> ڈیوائس کی قسم، ہارڈ ویئر ماڈل، آپریٹنگ سسٹم اور ورژن، منفرد ڈیوائس شناختی (UDI)، اور ڈیوائس کی سیٹنگز۔<br><strong>استعمال کا ڈیٹا:</strong> آپ ہماری خدمات کے ساتھ کیسے تعامل کرتے ہیں اس کی معلومات، جیسے استعمال شدہ خصوصیات، استعمال کی تعدد، کریش رپورٹس، اور کارکردگی کا ڈیٹا۔ ہم اپنی خدمات کی استحکام اور فعالیت کو بہتر بنانے کے لیے کوکیز یا اسی طرح کی ٹیکنالوجیز کے ذریعے یہ جمع کرتے ہیں۔<br><br>یہ خودکار طور پر جمع شدہ معلومات عام طور پر مجموعی یا غیر شناختی ہوتی ہیں اور ذاتی طور پر آپ کی شناخت کے لیے استعمال نہیں ہوتیں۔',
        info_use_title: '2. ہم آپ کی معلومات کا استعمال کیسے کرتے ہیں',
        info_use_content: 'ہم جمع شدہ معلومات کا استعمال مندرجہ ذیل مقاصد کے لیے کرتے ہیں:<br><br><strong>خدمات فراہم کرنے اور برقرار رکھنے کے لیے:</strong> آپ کا اکاؤنٹ بنانے، بنیادی خصوصیات فراہم کرنے اور یقینی بنانے کے لیے کہ ہماری خدمات صحیح طریقے سے کام کر رہی ہیں۔<br><strong>خدمات کو بہتر اور ذاتی بنانے کے لیے:</strong> یہ سمجھنے کے لیے کہ ہمارے صارفین خدمات کے ساتھ کیسے تعامل کرتے ہیں، زیادہ ذاتی تجربہ فراہم کرنے اور نئی خصوصیات تیار کرنے کے لیے۔<br><br><strong>آپ کے ساتھ رابطہ کرنے کے لیے:</strong> تکنیکی اطلاعات، سیکیورٹی کے انتباہات، اپ ڈیٹس، مارکیٹنگ مواد بھیجنے اور آپ کے تبصروں، سوالات اور کسٹمر سروس کی درخواستوں کا جواب دینے کے لیے۔<br><br><strong>حفاظت اور تحفظ کے لیے:</strong> دھوکہ دہی کے لین دین، غیر مجاز رسائی اور دیگر غیر قانونی سرگرمیوں کی تحقیقات اور روک تھام کے لیے، اور ہماری استعمال کی شرائط کو نافذ کرنے کے لیے۔',
        info_share_title: '3. ہم آپ کی معلومات کیسے شیئر کرتے ہیں',
        info_share_intro: 'ہم آپ کی ذاتی معلومات نہیں بیچتے۔ ہم صرف مندرجہ ذیل حالات میں تیسرے فریق کے ساتھ آپ کی معلومات شیئر کرتے ہیں:',
        third_party_title: 'A. تیسرے فریق کے سروس فراہم کنندگان کے ساتھ',
        third_party_content: 'ہم تیسرے فریق کے شراکت داروں کے ساتھ کام کرتے ہیں جو ہماری خدمات کو چلانے، فراہم کرنے، بہتر بنانے اور مارکیٹ کرنے میں مدد کرتے ہیں۔ یہ شراکت دار معاہدے کے ذریعے آپ کے ڈیٹا کی حفاظت کرنے کے پابند ہیں اور صرف ان مقاصد کے لیے اسے استعمال کرنے کے لیے محدود ہیں جو ہم مخصوص کرتے ہیں۔ ہم مندرجہ ذیل خدمات کے ساتھ معلومات شیئر کر سکتے ہیں:<br><br><strong>تجزیات اور کریش رپورٹنگ:</strong> استعمال کے انداز کو سمجھنے اور بگز کو ٹھیک کرنے میں ہماری مدد کے لیے۔<br>مثالیں: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>اشتہارات:</strong> ہمارے ایپ کے اندر اشتہارات دکھانے کے لیے۔ یہ خدمات ذاتی اشتہارات دکھانے کے لیے ڈیوائس کی شناخت جمع کر سکتی ہیں۔ آپ عام طور پر اپنے ڈیوائس کی سیٹنگز میں ذاتی اشتہارات سے آپٹ آؤٹ کر سکتے ہیں۔<br>مثالیں: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle وغیرہ<br><br><strong>کلاؤڈ ہوسٹنگ:</strong> آپ کے ڈیٹا کو محفوظ طریقے سے محفوظ کرنے کے لیے۔<br>مثال: Amazon Web Services (AWS)<br><br>یہ تیسرے فریق کی خدمات GDPR جیسے اہم ڈیٹا پروٹیکشن ضوابط کا احترام کرتی ہیں۔ ہم آپ کو ان کے ڈیٹا پریکٹسز کو سمجھنے کے لیے ان کی پرائیویسی پالیسیوں کا جائزہ لینے کی حوصلہ افزائی کرتے ہیں۔',
        legal_reasons_title: 'B. قانونی وجوہات اور اپنے حقوق کی حفاظت کے لیے',
        legal_reasons_content: 'ہم آپ کی معلومات کا انکشاف کر سکتے ہیں اگر ہم سمجھتے ہیں کہ یہ قانون، عدالتی حکم یا دیگر قانونی عمل کے ذریعے ضروری ہے، یا اگر ہمارا نیک فیث یقین ہے کہ انکشاف معقول طور پر ضروری ہے (i) کسی بھی شخص کی حفاظت کے لیے، (ii) دھوکہ دہی، سیکیورٹی یا تکنیکی مسائل کو حل کرنے کے لیے، یا (iii) اپنے حقوق یا املاک کی حفاظت کے لیے۔',
        with_consent_title: 'C. آپ کی رضامندی کے ساتھ',
        with_consent_content: 'ہم آپ کی واضح رضامندی کے ساتھ دیگر مقاصد کے لیے آپ کی معلومات شیئر کر سکتے ہیں۔ مثال کے طور پر، آپ ہمارے ایپ سے مواد کو دیگر پلیٹ فارمز جیسے آپ کے ای میل یا سوشل میڈیا اکاؤنٹس میں شیئر کرنے کا انتخاب کر سکتے ہیں۔',
        your_rights_title: '4. آپ کے حقوق اور انتخاب',
        your_rights_content: 'ہم آپ کو اپنی معلومات پر کنٹرول دینے میں یقین رکھتے ہیں۔ آپ کے ذاتی ڈیٹا کے حوالے سے آپ کے مندرجہ ذیل حقوق ہیں:<br><br><strong>رسائی اور درستگی کا حق:</strong> آپ ایپ کی سیٹنگز میں براہ راست اپنی زیادہ تر اکاؤنٹ کی معلومات تک رسائی حاصل کر سکتے ہیں اور انہیں اپ ڈیٹ کر سکتے ہیں۔ کسی بھی معلومات کے لیے جن تک آپ خود رسائی نہیں حاصل کر سکتے، آپ ہم سے رابطہ کر سکتے ہیں۔<br><strong>ڈیلیٹ (مٹانے) کا حق:</strong> آپ اپنے اکاؤنٹ اور منسلک ذاتی ڈیٹا کو ڈیلیٹ کرنے کی درخواست کر سکتے ہیں۔ براہ کرم نوٹ کریں کہ تکنیکی وجوہات کی بناء پر، ہمارے بیک اپ سسٹمز سے مکمل صفائی میں 90 دن تک کا وقت لگ سکتا ہے۔<br><strong>پروسیسنگ پر اعتراض کا حق:</strong> آپ کو کچھ مقاصد کے لیے، جیسے براہ راست مارکیٹنگ کے لیے، اپنے ذاتی ڈیٹا کی پروسیسنگ پر اعتراض کرنے کا حق ہے۔<br><br><strong>ڈیٹا پورٹیبلٹی کا حق:</strong> آپ کو منظم، مشین پڑھنے کے قابل فارمیٹ میں اپنے ذاتی ڈیٹا کی کاپی حاصل کرنے کا حق ہو سکتا ہے۔<br><br><strong>رضامندی واپس لینے کا حق:</strong> جہاں ہم معلومات پروسیس کرنے کے لیے آپ کی رضامندی پر انحصار کرتے ہیں (جیسے جغرافیائی مقام کے لیے)، آپ اسے کسی بھی وقت واپس لے سکتے ہیں۔<br><br>ان میں سے کوئی بھی حق استعمال کرنے کے لیے، براہ کرم sven775288@gmail.com پر ہم سے رابطہ کریں۔ ہم 30 دنوں کے اندر آپ کی درخواست کا جواب دیں گے۔ آپ کی حفاظت کے لیے، ہم آپ کی درخواست پر عمل کرنے سے پہلے آپ کی شناخت کی تصدیق کرنے کی ضرورت ہو سکتی ہے۔',
        data_security_title: '5. ڈیٹا سیکیورٹی',
        data_security_content: 'ہم آپ کی معلومات کو نقصان، چوری، غلط استعمال اور غیر مجاز رسائی سے بچانے کے لیے مضبوط انتظامی، تکنیکی اور جسمانی سیکیورٹی اقدامات نافذ کرتے ہیں۔ ان اقدامات میں شامل ہیں:<br><br>ٹرانزٹ (SSL/TLS) اور ریسٹ میں ڈیٹا انکرپشن۔<br>سخت رسائی کنٹرولز تاکہ صرف ضروری عملہ آپ کے ڈیٹا تک رسائی حاصل کر سکے۔<br>باقاعدگی سے سیکیورٹی کی تشخیص اور کمزوری کی اسکیننگ۔<br><br>تاہم، کوئی بھی سیکیورٹی سسٹم ناقابل تسخیر نہیں ہے۔ اگرچہ ہم آپ کے ڈیٹا کی حفاظت کے لیے کوشش کرتے ہیں، ہم اس کی مطلق سیکیورٹی کی ضمانت نہیں دے سکتے۔',
        data_transfers_title: '6. بین الاقوامی ڈیٹا ٹرانسفرز',
        data_transfers_content: 'ہماری خدمات Amazon Web Services (AWS) کے ذریعے ہوسٹ کی جاتی ہیں، اور آپ کی معلومات دنیا بھر کے مختلف ممالک میں واقع سرورز پر محفوظ اور پروسیس ہو سکتی ہیں۔ ہماری خدمات استعمال کرکے، آپ اپنے رہائشی ملک سے باہر کے ممالک میں آپ کی معلومات کی منتقلی، پروسیسنگ اور اسٹوریج کو سمجھتے ہیں اور اس سے اتفاق کرتے ہیں، جن کے مختلف ڈیٹا پروٹیکشن قوانین ہو سکتے ہیں۔',
        children_privacy_title: '7. بچوں کی پرائیویسی',
        children_privacy_content: 'ہماری خدمات 16 سال سے کم عمر کے بچوں (یا متعلقہ دائرہ اختیار میں مساوی کم سے کم عمر) کے لیے مخصوص یا ہدایت شدہ نہیں ہیں۔ ہم جانبوجھ کر بچوں سے ذاتی معلومات جمع نہیں کرتے۔ اگر ہمیں معلوم ہوتا ہے کہ ہم نے کسی بچے سے ذاتی معلومات جمع کی ہیں، تو ہم اس معلومات کو جلد سے جلد ڈیلیٹ کرنے کے لیے اقدامات کریں گے۔',
        policy_changes_title: '8. اس پرائیویسی پالیسی میں تبدیلیاں',
        policy_changes_content: 'ہم وقتاً فوقتاً اس پرائیویسی پالیسی کو اپ ڈیٹ کر سکتے ہیں۔ اگر ہم اہم تبدیلیاں کرتے ہیں، تو ہم آپ کو ایپ کے ذریعے، ای میل کے ذریعے، یا خدمات کا استعمال جاری رکھنے سے پہلے نئے ورژن کا جائزہ لینے اور قبول کرنے کی ضرورت کے ذریعے آگاہ کریں گے۔',
        contact_title: '9. ہم سے رابطہ کریں',
        contact_content: 'اگر اس پرائیویسی پالیسی کے بارے میں آپ کے کوئی سوالات، خدشات یا فیڈ بیک ہیں، تو براہ کرم ہم سے رابطہ کرنے میں ہچکچاہٹ نہ کریں۔<br><br><strong>کمپنی کا نام:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>ای میل:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>پتہ:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'خدمات کی شرائط',
        contact_us: 'رابطہ کریں'
      },
      id: {
        privacy_policy_title: 'Kebijakan Privasi',
        select_language: 'Pilih Bahasa',
        effective_date: 'Tanggal Berlaku: 1 Agustus 2025',
        introduction_title: 'Pendahuluan',
        introduction_content: 'Selamat datang di aplikasi kami. Kebijakan Privasi ini menjelaskan bagaimana Chongqing Yinnan Technology Co., Ltd. ("kami", "milik kami" atau "perusahaan kami") mengumpulkan, menggunakan, menyimpan, dan mengungkapkan informasi Anda ketika Anda menggunakan aplikasi mobile, situs web, dan layanan terkait kami (secara kolektif, "Layanan").<br><br>Privasi Anda sangat penting bagi kami. Kebijakan ini dirancang untuk membantu Anda memahami hak privasi Anda dan bagaimana kami melindungi data Anda. Dengan mengakses atau menggunakan Layanan kami, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui pengumpulan, penyimpanan, penggunaan, dan pengungkapan informasi pribadi Anda sebagaimana dijelaskan dalam Kebijakan Privasi ini dan Ketentuan Penggunaan kami.',
        info_collect_title: '1. Informasi yang Kami Kumpulkan',
        info_collect_intro: 'Untuk menyediakan dan meningkatkan Layanan kami, kami mengumpulkan informasi dengan beberapa cara.',
        info_direct_title: 'A. Informasi yang Anda Berikan Langsung kepada Kami',
        info_direct_content: 'Ketika Anda membuat akun, menghubungi kami untuk dukungan, atau menggunakan Layanan dengan cara lain, kami dapat mengumpulkan informasi pribadi berikut:<br><br><strong>Informasi Akun:</strong> Nama, alamat email, nomor telepon Anda.<br><strong>Konten Pengguna:</strong> Foto, catatan, dan informasi lain yang Anda buat, impor, atau unggah saat menggunakan Layanan.<br><strong>Informasi Jaringan Sosial:</strong> Jika Anda memilih untuk masuk melalui jaringan sosial, kami dapat menerima informasi dari profil jaringan sosial Anda, tergantung pada pengaturan privasi Anda di platform tersebut.<br><strong>Data Geolokasi:</strong> Kami dapat mengumpulkan lokasi tepat Anda (data GPS) dengan persetujuan eksplisit Anda untuk menyediakan fitur berbasis lokasi. Anda dapat menonaktifkan ini kapan saja di pengaturan perangkat Anda.',
        info_auto_title: 'B. Informasi yang Kami Kumpulkan Secara Otomatis',
        info_auto_content: 'Ketika Anda menggunakan Layanan kami, kami secara otomatis mengumpulkan informasi teknis tertentu dari perangkat Anda:<br><br><strong>Informasi Perangkat:</strong> Jenis perangkat, model perangkat keras, sistem operasi dan versi, pengenal perangkat unik (UDI), dan pengaturan perangkat.<br><strong>Data Penggunaan:</strong> Informasi tentang bagaimana Anda berinteraksi dengan Layanan kami, seperti fitur yang digunakan, frekuensi penggunaan, laporan crash, dan data kinerja. Kami mengumpulkan ini melalui cookie atau teknologi serupa untuk meningkatkan stabilitas dan fungsionalitas Layanan kami.<br><br>Informasi yang dikumpulkan secara otomatis ini biasanya diagregasi atau de-identifikasi dan tidak digunakan untuk mengidentifikasi Anda secara pribadi.',
        info_use_title: '2. Bagaimana Kami Menggunakan Informasi Anda',
        info_use_content: 'Kami menggunakan informasi yang kami kumpulkan untuk tujuan berikut:<br><br><strong>Untuk Menyediakan dan Memelihara Layanan:</strong> Untuk membuat akun Anda, menyediakan fitur inti, dan memastikan Layanan kami berfungsi dengan benar.<br><strong>Untuk Meningkatkan dan Mempersonalisasi Layanan:</strong> Untuk memahami bagaimana pengguna berinteraksi dengan Layanan, memberikan pengalaman yang lebih personal, dan mengembangkan fitur baru.<br><strong>Untuk Berkomunikasi dengan Anda:</strong> Untuk mengirim pemberitahuan teknis, peringatan keamanan, pembaruan, materi pemasaran, dan merespons komentar, pertanyaan, dan permintaan layanan pelanggan Anda.<br><strong>Untuk Keselamatan dan Keamanan:</strong> Untuk menyelidiki dan mencegah transaksi penipuan, akses tidak sah, dan aktivitas ilegal lainnya, serta menegakkan Ketentuan Penggunaan kami.',
        info_share_title: '3. Bagaimana Kami Membagikan Informasi Anda',
        info_share_intro: 'Kami tidak menjual informasi pribadi Anda. Kami hanya membagikan informasi Anda dengan pihak ketiga dalam keadaan berikut:',
        third_party_title: 'A. Dengan Penyedia Layanan Pihak Ketiga',
        third_party_content: 'Kami bekerja dengan mitra pihak ketiga untuk membantu kami mengoperasikan, menyediakan, meningkatkan, dan memasarkan Layanan kami. Mitra ini terikat kontrak untuk melindungi data Anda dan dibatasi untuk menggunakannya hanya untuk tujuan yang kami tentukan. Kami dapat membagikan informasi dengan layanan untuk:<br><br><strong>Analitik dan Pelaporan Crash:</strong> Untuk membantu kami memahami pola penggunaan dan memperbaiki bug.<br>Contoh: Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>Periklanan:</strong> Untuk menampilkan iklan dalam aplikasi kami. Layanan ini dapat mengumpulkan pengenal perangkat untuk menampilkan iklan yang dipersonalisasi. Anda biasanya dapat memilih keluar dari iklan yang dipersonalisasi di pengaturan perangkat Anda.<br>Contoh: AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle, dll.<br><br><strong>Cloud Hosting:</strong> Untuk menyimpan data Anda dengan aman.<br>Contoh: Amazon Web Services (AWS)<br><br>Layanan pihak ketiga ini mematuhi peraturan perlindungan data utama seperti GDPR. Kami mendorong Anda untuk meninjau kebijakan privasi mereka untuk memahami praktik data mereka.',
        legal_reasons_title: 'B. Untuk Alasan Hukum dan Melindungi Hak Kami',
        legal_reasons_content: 'Kami dapat mengungkapkan informasi Anda jika kami yakin hal tersebut diperlukan oleh hukum, surat panggilan, atau proses hukum lainnya, atau jika kami memiliki keyakinan yang baik bahwa pengungkapan secara wajar diperlukan untuk (i) melindungi keselamatan siapa pun, (ii) mengatasi penipuan, masalah keamanan, atau teknis, atau (iii) melindungi hak atau properti kami.',
        with_consent_title: 'C. Dengan Persetujuan Anda',
        with_consent_content: 'Kami dapat membagikan informasi Anda untuk tujuan lain dengan persetujuan eksplisit Anda. Misalnya, Anda dapat memilih untuk membagikan konten dari aplikasi kami ke platform lain seperti email atau akun media sosial Anda.',
        your_rights_title: '4. Hak dan Pilihan Anda',
        your_rights_content: 'Kami percaya dalam memberikan Anda kendali atas informasi Anda. Anda memiliki hak berikut terkait data pribadi Anda:<br><br><strong>Hak untuk Mengakses dan Mengoreksi:</strong> Anda dapat mengakses dan memperbarui sebagian besar informasi akun Anda langsung dalam pengaturan aplikasi. Untuk informasi apa pun yang tidak dapat Anda akses sendiri, Anda dapat menghubungi kami.<br><strong>Hak untuk Penghapusan (Penghapusan):</strong> Anda dapat meminta penghapusan akun dan data pribadi terkait Anda. Harap dicatat bahwa karena alasan teknis, penghapusan lengkap dari sistem cadangan kami dapat memakan waktu hingga 90 hari.<br><strong>Hak untuk Menolak Pemrosesan:</strong> Anda memiliki hak untuk menolak pemrosesan data pribadi Anda untuk tujuan tertentu, seperti pemasaran langsung.<br><strong>Hak Portabilitas Data:</strong> Anda mungkin memiliki hak untuk menerima salinan data pribadi Anda dalam format terstruktur yang dapat dibaca mesin.<br><strong>Hak untuk Menarik Persetujuan:</strong> Ketika kami mengandalkan persetujuan Anda untuk memproses informasi (seperti untuk geolokasi), Anda dapat menariknya kapan saja.<br><br>Untuk menggunakan salah satu hak ini, silakan hubungi kami di sven775288@gmail.com. Kami akan merespons permintaan Anda dalam 30 hari. Untuk perlindungan Anda, kami mungkin memerlukan Anda untuk memverifikasi identitas Anda sebelum kami memproses permintaan Anda.',
        data_security_title: '5. Keamanan Data',
        data_security_content: 'Kami menerapkan langkah-langkah keamanan administratif, teknis, dan fisik yang kuat untuk melindungi informasi Anda dari kehilangan, pencurian, penyalahgunaan, dan akses tidak sah. Langkah-langkah ini meliputi:<br><br>Enkripsi data dalam transit (SSL/TLS) dan saat istirahat.<br>Kontrol akses yang ketat untuk memastikan hanya personel yang diperlukan yang dapat mengakses data Anda.<br>Penilaian keamanan reguler dan pemindaian kerentanan.<br><br>Namun, tidak ada sistem keamanan yang tidak dapat ditembus. Meskipun kami berusaha melindungi data Anda, kami tidak dapat menjamin keamanan absolutnya.',
        data_transfers_title: '6. Transfer Data Internasional',
        data_transfers_content: 'Layanan kami dihosting oleh Amazon Web Services (AWS), dan informasi Anda dapat disimpan dan diproses di server yang berlokasi di berbagai negara di seluruh dunia. Dengan menggunakan Layanan kami, Anda memahami dan menyetujui transfer, pemrosesan, dan penyimpanan informasi Anda di negara-negara di luar negara tempat tinggal Anda, yang mungkin memiliki aturan perlindungan data yang berbeda.',
        children_privacy_title: '7. Privasi Anak',
        children_privacy_content: 'Layanan kami tidak dimaksudkan untuk atau diarahkan kepada anak-anak di bawah usia 16 tahun (atau usia minimum yang setara dalam yurisdiksi yang relevan). Kami tidak secara sadar mengumpulkan informasi pribadi dari anak-anak. Jika kami mengetahui bahwa kami telah mengumpulkan informasi pribadi dari seorang anak, kami akan mengambil langkah untuk menghapus informasi tersebut secepat mungkin.',
        policy_changes_title: '8. Perubahan pada Kebijakan Privasi Ini',
        policy_changes_content: 'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Jika kami membuat perubahan material, kami akan memberi tahu Anda melalui aplikasi, melalui email, atau dengan mengharuskan Anda untuk meninjau dan menerima versi baru sebelum melanjutkan penggunaan Layanan.',
        contact_title: '9. Hubungi Kami',
        contact_content: 'Jika Anda memiliki pertanyaan, kekhawatiran, atau umpan balik tentang Kebijakan Privasi ini, jangan ragu untuk menghubungi kami.<br><br><strong>Nama Perusahaan:</strong> Chongqing Yinnan Technology Co., Ltd.<br><strong>Email:</strong> <a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>Alamat:</strong> 2nd Floor, Building 5, No. 172 Hexu Road, Yuzui Town, Liangjiang New Area, Chongqing City, China.',
        terms_of_service: 'Syarat Layanan',
        contact_us: 'Hubungi Kami'
      },
      'zh-TW': {
        privacy_policy_title: '隱私政策',
        select_language: '選擇語言',
        effective_date: '生效日期：2025年8月1日',
        introduction_title: '簡介',
        introduction_content: '歡迎使用我們的應用程式。本隱私政策說明重慶銀南科技有限公司（「我們」、「我們的」或「我們」）在您使用我們的行動應用程式、網站和相關服務（統稱「服務」）時如何收集、使用、儲存和披露您的資訊。<br><br>您的隱私對我們至關重要。本政策旨在幫助您了解您的隱私權以及我們如何保護您的資料。透過存取或使用我們的服務，您表示您已閱讀、理解並同意我們按照本隱私政策和使用條款中所述收集、儲存、使用和披露您的個人資訊。',
        info_collect_title: '1. 我們收集的資訊',
        info_collect_intro: '為了提供和改善我們的服務，我們透過多種方式收集資訊。',
        info_direct_title: 'A. 您直接提供給我們的資訊',
        info_direct_content: '當您建立帳戶、聯絡我們尋求支援或以其他方式使用服務時，我們可能會收集以下個人資訊：<br><br><strong>帳戶資訊：</strong>您的姓名、電子郵件地址、電話號碼。<br><strong>使用者內容：</strong>您在使用服務時建立、匯入或上傳的照片、筆記和其他資訊。<br><strong>社群網路資訊：</strong>如果您選擇透過社群網路登入，我們可能會從您的社群網路個人檔案中接收資訊，取決於您在該平台上的隱私設定。<br><strong>地理位置資料：</strong>在您明確同意的情況下，我們可能會收集您的精確位置（GPS資料）以提供基於位置的功能。您可以隨時在裝置設定中停用此功能。',
        info_auto_title: 'B. 我們自動收集的資訊',
        info_auto_content: '當您使用我們的服務時，我們會自動從您的裝置收集某些技術資訊：<br><br><strong>裝置資訊：</strong>裝置類型、硬體型號、作業系統及版本、唯一裝置識別碼（UDI）和裝置設定。<br><strong>使用資料：</strong>關於您如何與我們的服務互動的資訊，例如使用的功能、使用頻率、當機報告和效能資料。我們透過Cookie或類似技術收集這些資訊，以改善我們服務的穩定性和功能。<br><br>這些自動收集的資訊通常是彙總的或去識別化的，不用於個人身分識別。',
        info_use_title: '2. 我們如何使用您的資訊',
        info_use_content: '我們將收集的資訊用於以下目的：<br><br><strong>提供和維護服務：</strong>建立您的帳戶，提供核心功能，並確保我們的服務正常運作。<br><strong>改善和個人化服務：</strong>了解我們的使用者如何與服務互動，提供更個人化的體驗，並開發新功能。<br><strong>與您溝通：</strong>向您發送技術通知、安全警示、更新、行銷資料，並回應您的意見、問題和客戶服務請求。<br><strong>安全和保障：</strong>調查和防止欺詐交易、未經授權的存取和其他非法活動，並執行我們的使用條款。',
        info_share_title: '3. 我們如何分享您的資訊',
        info_share_intro: '我們不出售您的個人資訊。我們僅在以下情況下與第三方分享您的資訊：',
        third_party_title: 'A. 與第三方服務提供商',
        third_party_content: '我們與第三方合作夥伴合作，幫助我們營運、提供、改善和行銷我們的服務。這些合作夥伴有合約義務保護您的資料，並且僅限於將其用於我們指定的目的。我們可能與以下服務分享資訊：<br><br><strong>分析和當機報告：</strong>幫助我們了解使用模式並修復錯誤。<br>範例：Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>廣告：</strong>在我們的應用程式中顯示廣告。這些服務可能收集裝置識別碼以顯示個人化廣告。您通常可以在裝置設定中選擇退出個人化廣告。<br>範例：AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle 等<br><br><strong>雲端託管：</strong>安全儲存您的資料。<br>範例：Amazon Web Services (AWS)<br><br>這些第三方服務符合GDPR等主要資料保護法規。我們鼓勵您查看他們的隱私政策以了解他們的資料處理做法。',
        legal_reasons_title: 'B. 出於法律原因和保護我們的權利',
        legal_reasons_content: '如果我們認為法律、傳票或其他法律程序要求，或者我們有充分理由相信披露對於以下目的是合理必要的，我們可能會披露您的資訊：(i) 保護任何人的安全，(ii) 解決欺詐、安全或技術問題，或 (iii) 保護我們的權利或財產。',
        with_consent_title: 'C. 經您同意',
        with_consent_content: '我們可能在獲得您明確同意的情況下為其他目的分享您的資訊。例如，您可能選擇將我們應用程式中的內容分享到其他平台，如您的電子郵件或社群媒體帳戶。',
        your_rights_title: '4. 您的權利和選擇',
        your_rights_content: '我們相信讓您控制自己的資訊。您對個人資料擁有以下權利：<br><br><strong>存取和更正權：</strong>您可以直接在應用程式設定中存取和更新大部分帳戶資訊。對於您無法自己存取的任何資訊，您可以聯絡我們。<br><strong>刪除權（擦除）：</strong>您可以請求刪除您的帳戶和相關個人資料。請注意，由於技術原因，從我們的備份系統中完全擦除可能需要長達90天。<br><strong>反對處理權：</strong>您有權反對我們為某些目的處理您的個人資料，例如直接行銷。<br><strong>資料可攜帶權：</strong>您可能有權以結構化、機器可讀的格式接收您的個人資料副本。<br><strong>撤回同意權：</strong>在我們依賴您的同意處理資訊的情況下（如地理位置），您可以隨時撤回同意。<br><br>要行使這些權利中的任何一項，請透過 sven775288@gmail.com 聯絡我們。我們將在30天內回覆您的請求。為了保護您，我們可能要求您在我們處理您的請求之前驗證您的身分。',
        data_security_title: '5. 資料安全',
        data_security_content: '我們實施強大的管理、技術和物理安全措施來保護您的資訊免受遺失、盜竊、誤用和未經授權的存取。這些措施包括：<br><br>傳輸中（SSL/TLS）和靜態資料的加密。<br>嚴格的存取控制，確保只有必要的人員才能存取您的資料。<br>定期安全評估和漏洞掃描。<br><br>然而，沒有安全系統是無懈可擊的。雖然我們努力保護您的資料，但我們無法保證其絕對安全。',
        data_transfers_title: '6. 國際資料傳輸',
        data_transfers_content: '我們的服務由Amazon Web Services (AWS)託管，您的資訊可能在世界各國的伺服器上儲存和處理。透過使用我們的服務，您理解並同意將您的資訊傳輸、處理和儲存到您居住國之外的國家，這些國家可能有不同的資料保護規則。',
        children_privacy_title: '7. 兒童隱私',
        children_privacy_content: '我們的服務不適用於或針對16歲以下的兒童（或相關司法管轄區的等效最低年齡）。我們不會故意收集兒童的個人資訊。如果我們得知我們收集了兒童的個人資訊，我們將儘快採取措施刪除該資訊。',
        policy_changes_title: '8. 本隱私政策的變更',
        policy_changes_content: '我們可能會不時更新本隱私政策。如果我們進行重大變更，我們將透過應用程式、電子郵件通知您，或要求您在繼續使用服務之前查看並接受新版本。',
        contact_title: '9. 聯絡我們',
        contact_content: '如果您對本隱私政策有任何問題、疑慮或反饋，請隨時聯絡我們。<br><br><strong>公司名稱：</strong>重慶銀南科技有限公司<br><strong>電子郵件：</strong><a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>地址：</strong>中國重慶市兩江新區魚嘴鎮河旭路172號5號樓2樓',
        terms_of_service: '服務條款',
        contact_us: '聯絡我們'
      },
      'zh-HK': {
        privacy_policy_title: '私隱政策',
        select_language: '選擇語言',
        effective_date: '生效日期：2025年8月1日',
        introduction_title: '簡介',
        introduction_content: '歡迎使用我們的應用程式。本私隱政策説明重慶銀南科技有限公司（「我們」、「我們的」或「我們」）在您使用我們的流動應用程式、網站和相關服務（統稱「服務」）時如何收集、使用、儲存和披露您的資訊。<br><br>您的私隱對我們至關重要。本政策旨在幫助您了解您的私隱權以及我們如何保護您的資料。透過存取或使用我們的服務，您表示您已閱讀、理解並同意我們按照本私隱政策和使用條款中所述收集、儲存、使用和披露您的個人資訊。',
        info_collect_title: '1. 我們收集的資訊',
        info_collect_intro: '為了提供和改善我們的服務，我們透過多種方式收集資訊。',
        info_direct_title: 'A. 您直接提供給我們的資訊',
        info_direct_content: '當您建立帳戶、聯絡我們尋求支援或以其他方式使用服務時，我們可能會收集以下個人資訊：<br><br><strong>帳戶資訊：</strong>您的姓名、電郵地址、電話號碼。<br><strong>用戶內容：</strong>您在使用服務時建立、匯入或上載的照片、筆記和其他資訊。<br><strong>社交網絡資訊：</strong>如果您選擇透過社交網絡登入，我們可能會從您的社交網絡個人檔案中接收資訊，取決於您在該平台上的私隱設定。<br><br><strong>地理位置資料：</strong>在您明確同意的情況下，我們可能會收集您的精確位置（GPS資料）以提供基於位置的功能。您可以隨時在裝置設定中停用此功能。',
        info_auto_title: 'B. 我們自動收集的資訊',
        info_auto_content: '當您使用我們的服務時，我們會自動從您的裝置收集某些技術資訊：<br><br><strong>裝置資訊：</strong>裝置類型、硬件型號、作業系統及版本、唯一裝置識別碼（UDI）和裝置設定。<br><strong>使用資料：</strong>關於您如何與我們的服務互動的資訊，例如使用的功能、使用頻率、當機報告和效能資料。我們透過Cookie或類似技術收集這些資訊，以改善我們服務的穩定性和功能。<br><br>這些自動收集的資訊通常是彙總的或去識別化的，不用於個人身份識別。',
        info_use_title: '2. 我們如何使用您的資訊',
        info_use_content: '我們將收集的資訊用於以下目的：<br><br><strong>提供和維護服務：</strong>建立您的帳戶，提供核心功能，並確保我們的服務正常運作。<br><strong>改善和個人化服務：</strong>了解我們的用戶如何與服務互動，提供更個人化的體驗，並開發新功能。<br><strong>與您溝通：</strong>向您發送技術通知、安全警示、更新、行銷資料，並回應您的意見、問題和客戶服務請求。<br><strong>安全和保障：</strong>調查和防止欺詐交易、未經授權的存取和其他非法活動，並執行我們的使用條款。',
        info_share_title: '3. 我們如何分享您的資訊',
        info_share_intro: '我們不出售您的個人資訊。我們僅在以下情況下與第三方分享您的資訊：',
        third_party_title: 'A. 與第三方服務提供商',
        third_party_content: '我們與第三方合作夥伴合作，幫助我們營運、提供、改善和行銷我們的服務。這些合作夥伴有合約義務保護您的資料，並且僅限於將其用於我們指定的目的。我們可能與以下服務分享資訊：<br><br><strong>分析和當機報告：</strong>幫助我們了解使用模式並修復錯誤。<br>範例：Google Analytics for Firebase, Firebase Crashlytics<br><br><strong>廣告：</strong>在我們的應用程式中顯示廣告。這些服務可能收集裝置識別碼以顯示個人化廣告。您通常可以在裝置設定中選擇退出個人化廣告。<br>範例：AdMob, Meta (Facebook), AppLovin, Vungle, ironSource, Pangle 等<br><br><strong>雲端託管：</strong>安全儲存您的資料。<br>範例：Amazon Web Services (AWS)<br><br>這些第三方服務符合GDPR等主要資料保護法規。我們鼓勵您查看他們的私隱政策以了解他們的資料處理做法。',
        legal_reasons_title: 'B. 出於法律原因和保護我們的權利',
        legal_reasons_content: '如果我們認為法律、傳票或其他法律程序要求，或者我們有充分理由相信披露對於以下目的是合理必要的，我們可能會披露您的資訊：(i) 保護任何人的安全，(ii) 解決欺詐、安全或技術問題，或 (iii) 保護我們的權利或財產。',
        with_consent_title: 'C. 經您同意',
        with_consent_content: '我們可能在獲得您明確同意的情況下為其他目的分享您的資訊。例如，您可能選擇將我們應用程式中的內容分享到其他平台，如您的電郵或社交媒體帳戶。',
        your_rights_title: '4. 您的權利和選擇',
        your_rights_content: '我們相信讓您控制自己的資訊。您對個人資料擁有以下權利：<br><br><strong>存取和更正權：</strong>您可以直接在應用程式設定中存取和更新大部分帳戶資訊。對於您無法自己存取的任何資訊，您可以聯絡我們。<br><strong>刪除權（擦除）：</strong>您可以請求刪除您的帳戶和相關個人資料。請注意，由於技術原因，從我們的備份系統中完全擦除可能需要長達90天。<br><strong>反對處理權：</strong>您有權反對我們為某些目的處理您的個人資料，例如直接行銷。<br><strong>資料可攜帶權：</strong>您可能有權以結構化、機器可讀的格式接收您的個人資料副本。<br><strong>撤回同意權：</strong>在我們依賴您的同意處理資訊的情況下（如地理位置），您可以隨時撤回同意。<br><br>要行使這些權利中的任何一項，請透過 sven775288@gmail.com 聯絡我們。我們將在30天內回覆您的請求。為了保護您，我們可能要求您在我們處理您的請求之前驗證您的身份。',
        data_security_title: '5. 資料安全',
        data_security_content: '我們實施強大的管理、技術和物理安全措施來保護您的資訊免受遺失、盜竊、誤用和未經授權的存取。這些措施包括：<br><br>傳輸中（SSL/TLS）和靜態資料的加密。<br>嚴格的存取控制，確保只有必要的人員才能存取您的資料。<br>定期安全評估和漏洞掃描。<br><br>然而，沒有安全系統是無懈可擊的。雖然我們努力保護您的資料，但我們無法保證其絕對安全。',
        data_transfers_title: '6. 國際資料傳輸',
        data_transfers_content: '我們的服務由Amazon Web Services (AWS)託管，您的資訊可能在世界各國的伺服器上儲存和處理。透過使用我們的服務，您理解並同意將您的資訊傳輸、處理和儲存到您居住國之外的國家，這些國家可能有不同的資料保護規則。',
        children_privacy_title: '7. 兒童私隱',
        children_privacy_content: '我們的服務不適用於或針對16歲以下的兒童（或相關司法管轄區的等效最低年齡）。我們不會故意收集兒童的個人資訊。如果我們得知我們收集了兒童的個人資訊，我們將盡快採取措施刪除該資訊。',
        policy_changes_title: '8. 本私隱政策的變更',
        policy_changes_content: '我們可能會不時更新本私隱政策。如果我們進行重大變更，我們將透過應用程式、電郵通知您，或要求您在繼續使用服務之前查看並接受新版本。',
        contact_title: '9. 聯絡我們',
        contact_content: '如果您對本私隱政策有任何問題、疑慮或反饋，請隨時聯絡我們。<br><br><strong>公司名稱：</strong>重慶銀南科技有限公司<br><strong>電郵：</strong><a href="mailto:sven775288@gmail.com" class="email-link">sven775288@gmail.com</a><br><strong>地址：</strong>中國重慶市兩江新區魚嘴鎮河旭路172號5號樓2樓',
        terms_of_service: '服務條款',
        contact_us: '聯絡我們'
      }
    };
  }

  /**
   * 检测Flutter应用的当前语言设置
   */
  detectAppLanguage() {
    try {
      console.log('=== 开始语言检测 ===');
      console.log('当前URL:', window.location.href);
      console.log('URL路径:', window.location.pathname);
      console.log('URL参数:', window.location.search);
      
      // 方法0: 从URL路径获取语言设置 (支持 /zh/, /en/ 等路径)
      const pathname = window.location.pathname;
      const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
      console.log('路径段:', pathSegments);
      
      // 检查路径中的第一个或最后一个段是否为语言代码
      for (const segment of pathSegments) {
        console.log('检查路径段:', segment, '长度:', segment.length);
        // 只检查长度2-5个字符的段，排除项目名称等
        if (segment.length >= 2 && segment.length <= 5) {
          console.log('  -> 检查是否支持:', this.isLanguageSupported(segment));
          if (this.isLanguageSupported(segment)) {
            this.currentLanguage = this.normalizeLanguageCode(segment);
            console.log('✅ 从URL路径检测到语言:', segment, '-> 规范化为:', this.currentLanguage);
            return;
          }
        } else {
          console.log('  -> 跳过（长度不符合语言代码规范）');
        }
      }
      console.log('❌ URL路径中未检测到语言代码');
      
      // 方法1: 从URL参数获取语言设置
      const urlParams = new URLSearchParams(window.location.search);
      const langFromUrl = urlParams.get('lang') || urlParams.get('language');
      console.log('URL参数中的语言:', langFromUrl);
      if (langFromUrl && this.isLanguageSupported(langFromUrl)) {
        this.currentLanguage = this.normalizeLanguageCode(langFromUrl);
        console.log('✅ 从URL参数检测到语言:', langFromUrl, '-> 规范化为:', this.currentLanguage);
        return;
      }
      console.log('❌ URL参数中未检测到语言代码');

      // 方法2: 从postMessage获取Flutter应用的语言设置
      // Flutter应用可以通过postMessage发送当前语言
      console.log('设置postMessage监听器...');
      window.addEventListener('message', (event) => {
        console.log('收到postMessage:', event.data);
        if (event.data && event.data.type === 'flutter_language') {
          const flutterLang = event.data.language;
          console.log('Flutter发送的语言:', flutterLang);
          if (flutterLang && this.isLanguageSupported(flutterLang)) {
            console.log('✅ 从postMessage检测到语言:', flutterLang);
            this.setLanguage(this.normalizeLanguageCode(flutterLang));
          }
        }
      });

      // 方法3: 从localStorage获取Flutter应用的语言设置
      const flutterLang = localStorage.getItem('selected_locale') || 
                         localStorage.getItem('flutter_locale');
      console.log('localStorage中的语言设置:');
      console.log('  selected_locale:', localStorage.getItem('selected_locale'));
      console.log('  flutter_locale:', localStorage.getItem('flutter_locale'));
      console.log('  最终获取到:', flutterLang);
      
      if (flutterLang && this.isLanguageSupported(flutterLang)) {
        this.currentLanguage = this.normalizeLanguageCode(flutterLang);
        console.log('✅ 从localStorage检测到语言:', flutterLang, '-> 规范化为:', this.currentLanguage);
        return;
      }
      console.log('❌ localStorage中未检测到语言代码');

      // 方法4: 检测浏览器语言
      const browserLang = navigator.language || navigator.languages[0];
      console.log('浏览器语言:', browserLang);
      console.log('浏览器支持的语言列表:', navigator.languages);
      
      if (browserLang && this.isLanguageSupported(browserLang)) {
        this.currentLanguage = this.normalizeLanguageCode(browserLang);
        console.log('✅ 从浏览器检测到语言:', browserLang, '-> 规范化为:', this.currentLanguage);
        return;
      }
      console.log('❌ 浏览器语言不受支持或未检测到');
      
      console.log('🔄 所有语言检测方法都失败，使用默认语言:', this.currentLanguage);

    } catch (error) {
      console.warn('Failed to detect app language:', error);
    }
  }

  /**
   * 检查语言是否受支持
   */
  isLanguageSupported(langCode) {
    if (!langCode) {
      console.log('isLanguageSupported: 语言代码为空');
      return false;
    }
    
    const normalizedLang = this.normalizeLanguageCode(langCode);
    const isSupported = this.supportedLanguages.includes(normalizedLang) || 
                       this.translations[normalizedLang];
    
    console.log(`isLanguageSupported: ${langCode} -> ${normalizedLang} -> ${isSupported ? '支持' : '不支持'}`);
    return isSupported;
  }

  /**
   * 规范化语言代码
   */
  normalizeLanguageCode(langCode) {
    console.log(`normalizeLanguageCode: 输入 ${langCode}`);
    
    if (!langCode) {
      console.log('normalizeLanguageCode: 输入为空，返回默认 en');
      return 'en';
    }
    
    // 处理特殊情况
    const langMap = {
      'zh-CN': 'zh',
      'zh_CN': 'zh', 
      'zh-TW': 'zh-TW',
      'zh_TW': 'zh-TW',
      'zh-HK': 'zh-HK',
      'zh_HK': 'zh-HK',
      'en-US': 'en',
      'en_US': 'en',
      'en-GB': 'en',
      'en_GB': 'en'
    };

    if (langMap[langCode]) {
      console.log(`normalizeLanguageCode: 特殊映射 ${langCode} -> ${langMap[langCode]}`);
      return langMap[langCode];
    }

    // 提取主要语言代码
    const mainLang = langCode.split('-')[0].split('_')[0].toLowerCase();
    console.log(`normalizeLanguageCode: 提取主语言代码 ${langCode} -> ${mainLang}`);
    
    // 检查是否在支持列表中
    if (this.supportedLanguages.includes(mainLang)) {
      console.log(`normalizeLanguageCode: 支持列表中找到 ${mainLang}`);
      return mainLang;
    }

    console.log(`normalizeLanguageCode: 未找到支持的语言，返回默认 en`);
    return 'en'; // 默认返回英文
  }

  /**
   * 从本地存储加载语言设置
   */
  loadStoredLanguage() {
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.isLanguageSupported(storedLang)) {
      this.currentLanguage = this.normalizeLanguageCode(storedLang);
    }
  }

  /**
   * 设置语言切换按钮
   */
  setupLanguageToggle() {
    const languageButton = document.getElementById('language-button');
    const modal = document.getElementById('language-modal');
    const closeModal = document.getElementById('close-language-modal');
    
    if (languageButton && modal) {
      languageButton.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }
    
    if (closeModal && modal) {
      closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }
    
    // 语言选项点击事件
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.getAttribute('data-lang');
        if (lang && this.translations[lang]) {
          this.setLanguage(lang);
          modal.classList.remove('active');
        }
      });
    });
  }

  /**
   * 设置语言
   */
  setLanguage(lang) {
    const normalizedLang = this.normalizeLanguageCode(lang);
    
    // 如果有对应的翻译，使用该语言
    if (this.translations[normalizedLang]) {
      this.currentLanguage = normalizedLang;
    } else {
      // 否则回退到英文
      console.warn(`Language '${normalizedLang}' not supported, falling back to English`);
      this.currentLanguage = 'en';
    }
    
    this.applyLanguage();
    this.saveLanguage();
    this.updateLanguageSelection();
  }

  /**
   * 应用语言到DOM
   */
  applyLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      let content = null;

      // 尝试获取当前语言的翻译
      if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
        content = this.translations[this.currentLanguage][key];
      } 
      // 如果当前语言没有翻译，回退到英文
      else if (this.translations['en'] && this.translations['en'][key]) {
        content = this.translations['en'][key];
      }
      // 如果英文也没有，显示key作为备用
      else {
        content = key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }

      if (content) {
        // 检查内容是否包含HTML标签
        if (content.includes('<') && content.includes('>')) {
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
    });
    
    // 更新HTML lang属性
    document.documentElement.lang = this.getHtmlLangCode();
    
    // 设置文本方向 (RTL for Arabic, Urdu, Hebrew etc.)
    const rtlLanguages = ['ar', 'ur', 'he'];
    if (rtlLanguages.includes(this.currentLanguage)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  /**
   * 获取HTML lang属性值
   */
  getHtmlLangCode() {
    const langMap = {
      'zh': 'zh-CN',
      'zh-TW': 'zh-TW', 
      'zh-HK': 'zh-HK',
      'en': 'en',
      'es': 'es',
      'fr': 'fr', 
      'de': 'de',
      'ja': 'ja',
      'ko': 'ko',
      'pt': 'pt',
      'ru': 'ru',
      'ar': 'ar',
      'hi': 'hi',
      'bn': 'bn',
      'ur': 'ur',
      'id': 'id'
    };
    return langMap[this.currentLanguage] || 'en';
  }

  /**
   * 更新语言选择状态
   */
  updateLanguageSelection() {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      const checkIcon = option.querySelector('.material-icons');
      
      if (lang === this.currentLanguage) {
        // 添加选中样式
        option.classList.add('md3-surface-variant');
        // 显示勾选图标
        if (checkIcon) {
          checkIcon.style.opacity = '1';
          checkIcon.style.color = 'var(--md-sys-color-primary)';
        }
      } else {
        // 移除选中样式
        option.classList.remove('md3-surface-variant');
        // 隐藏勾选图标
        if (checkIcon) {
          checkIcon.style.opacity = '0';
          checkIcon.style.color = 'transparent';
        }
      }
    });
  }

  /**
   * 保存语言设置
   */
  saveLanguage() {
    localStorage.setItem(this.storageKey, this.currentLanguage);
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

// 全局语言管理器实例
window.languageManager = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});