/**
 * 语言管理器 - 简化版，支持中英文切换
 */
class LanguageManager {
  constructor() {
    this.currentLanguage = 'zh';
    this.storageKey = 'privacy-policy-language';
    this.translations = {};
    
    this.init();
  }

  /**
   * 初始化语言管理器
   */
  init() {
    this.loadTranslations();
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
      }
    };
  }

  /**
   * 从本地存储加载语言设置
   */
  loadStoredLanguage() {
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.translations[storedLang]) {
      this.currentLanguage = storedLang;
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
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      this.applyLanguage();
      this.saveLanguage();
      this.updateLanguageSelection();
    }
  }

  /**
   * 应用语言到DOM
   */
  applyLanguage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (this.translations[this.currentLanguage][key]) {
        // 检查内容是否包含HTML标签
        const content = this.translations[this.currentLanguage][key];
        if (content.includes('<') && content.includes('>')) {
          element.innerHTML = content;
        } else {
          element.textContent = content;
        }
      }
    });
    
    // 更新HTML lang属性
    document.documentElement.lang = this.currentLanguage === 'zh' ? 'zh-CN' : 'en';
    if (this.currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  /**
   * 更新语言选择状态
   */
  updateLanguageSelection() {
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLanguage) {
        option.classList.add('md3-surface-variant');
      } else {
        option.classList.remove('md3-surface-variant');
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