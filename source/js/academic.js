'use strict';

(() => {
  const languageKey = 'academic-language';
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let activeLanguage = readLanguage();
  let sourcePageTitle = document.title;

  const zh = {
    'Zhiyang Liu': '刘志扬',
    'Zhi-Yang Liu': '刘志扬',
    'Zhiyang Liu — Academic Homepage': '刘志扬 — 个人学术主页',
    'Zhi-Yang Liu — Academic Homepage': '刘志扬 — 个人学术主页',
    'Home': '首页',
    'Research': '研究',
    'Publications': '论文',
    'Projects': '项目',
    'Blog': '博客',
    'Blog Home': '博客首页',
    'Archives': '归档',
    'Categories': '分类',
    'Tags': '标签',
    'About': '关于',
    'Curriculum Vitae': '个人简历',
    'CV': '简历',
    'Search': '搜索',
    'Search notes': '搜索笔记',
    'Search articles and pages': '搜索文章与页面',
    'Articles': '文章',
    'Profile': '简介',
    'About me': '关于我',
    'More about me': '进一步了解',
    'Focus': '研究',
    'Research interests': '研究方向',
    'Current research directions and related open resources.': '当前研究方向及相关开放资源。',
    'Quantum Communication': '量子通信',
    'Optical Communications': '光通信',
    'Time and Frequency Transfer': '时频传递',
    'Optics–Algorithm Integration': '光学与算法交叉',
    'Quantum Two-Way Time Transfer (QTWTT)': '量子双向时间同步（QTWTT）',
    'Algorithmic Dispersion Compensation for QTWTT': '量子双向时间同步色散补偿算法',
    'This research investigates high-precision time-offset estimation and stability analysis in quantum two-way time transfer. It develops correlation-based processing, coincidence-peak readout, and data-analysis methods, together with optical sampling, to support reliable synchronization measurements.': '面向量子双向时间同步中的高精度时间差估计与稳定性分析，研究符合事件的互相关处理、峰值读数和数据分析方法，并结合光学采样提升同步测量的可靠性。',
    'This direction studies compensation algorithms for dispersion-broadened coincidence peaks in QTWTT. It combines physics-constrained estimation, template matching, and data-driven models to improve time-center readout and stability assessment under broadened-peak conditions.': '针对光纤色散引起的符合峰展宽及其对时间中心读数的影响，研究融合物理约束、模板匹配和数据驱动模型的补偿算法，以改善宽峰条件下的时间估计与稳定性评估。',
    'Correlation-based time-offset estimation': '互相关时间偏移估计',
    'Coincidence-peak localization and readout': '符合峰定位与读数',
    'Stability analysis of synchronization data': '同步数据稳定性分析',
    'Dispersion-induced peak broadening': '色散导致的峰形展宽',
    'Physics-constrained compensation': '物理约束补偿',
    'PSF and time-center readout modeling': '点扩散函数与中心读数建模',
    'Optical sampling': '光学采样',
    'Correlation analysis': '互相关分析',
    'Physics-constrained algorithms': '物理约束算法',
    'Related projects': '相关项目',
    'histgram_py — correlation, coincidence, pipeline, and time-tag data processing': 'histgram_py — 互相关、符合事件、处理流程与时间标签数据处理',
    'fiber-dispersion-v11 — V17 template bank and likelihood reader': 'fiber-dispersion-v11 — V17 模板库与似然读数器',
    'Three modular directions ready to be replaced with your verified research.': '以下方向为占位内容，待研究工作公开后更新。',
    'Work': '工作',
    'Selected projects': '代表项目',
    'Representative projects, methods, and open resources.': '代表性项目、研究方法与开放资源。',
    'Writing': '成果',
    'Selected publications': '代表论文',
    'A compact selection; all entries below are clearly marked placeholders.': '论文条目将在相关工作适合公开后补充。',
    'Notebook': '笔记',
    'Recent blog posts': '近期文章',
    'Notes on research, learning, technology, and daily life.': '记录研究、学习、技术与日常。',
    'View all': '查看全部',
    'Explore direction': '查看方向',
    'Paper': '论文',
    'Code': '代码',
    'Project page': '项目主页',
    'Placeholder': '占位内容',
    'PROJECT': '项目',
    'Published': '已发表',
    'Accepted': '已接收',
    'Preprint': '预印本',
    'Journal': '期刊',
    'Conference': '会议',
    'All': '全部',
    'Research directions are maintained in': '研究方向统一维护于',
    'Every entry below is placeholder content.': '以下条目均为占位内容。',
    'Research questions': '研究问题',
    'Methods': '研究方法',
    'Current projects': '当前项目',
    'Related projects': '相关项目',
    'Related publications': '相关论文',
    'Related code': '相关代码',
    'Publications are listed in reverse order from a single YAML file. Replace every clearly marked placeholder with verified bibliographic data.': '论文由统一的数据文件按时间倒序生成；当前明确标记的内容均为占位信息。',
    'Filter publications': '筛选论文',
    'Projects are rendered from': '项目统一读取自',
    'empty links remain visibly disabled until real resources are supplied.': '在真实资源补充前，空链接将保持禁用状态。',
    'Research notebook': '研究笔记',
    'Notes, methods': '笔记、方法',
    '& ideas.': '与思考',
    'Working records from study, research, code, and life.': '记录学习、研究、代码与生活中的过程。',
    'Browse archive': '浏览归档',
    'Notebook overview': '笔记概览',
    'Entries': '文章',
    'Topics': '主题',
    'Latest update': '最近更新',
    'Latest entries': '最新记录',
    'Recently added': '近期更新',
    'All notes': '全部笔记',
    'Read the note': '阅读笔记',
    'Browse by topic': '按主题浏览',
    'Four streams of notes': '四类笔记',
    'Learning Notes': '学习笔记',
    'Research Thoughts': '研究思考',
    'Technology': '技术记录',
    'Life': '生活随笔',
    'Courses, papers, and concepts worth revisiting.': '课程、论文与值得回顾的概念。',
    'Questions, observations, and ideas in progress.': '尚在推进的问题、观察与想法。',
    'Code, tools, and reproducible technical records.': '代码、工具与可复现的技术记录。',
    'Occasional notes beyond the laboratory.': '实验室之外的日常记录。',
    'Explore the library': '浏览内容库',
    'More ways to browse': '更多浏览方式',
    'Biography': '个人简介',
    'Education': '教育经历',
    'Research experience': '研究经历',
    'Academic service': '学术服务',
    'Awards': '荣誉奖励',
    'Contact': '联系方式',
    'Email': '邮箱',
    'Direct-entry Ph.D. Student': '直博生',
    'Direct-entry Ph.D. Student in Physics': '物理学直博生',
    'Ph.D. Student': '博士',
    'Undergraduate Studies in Optoelectronic Information Science': '光电信息科学本科',
    "Master's Student in Electronic Information": '电子信息硕士生',
    'Ph.D. Student in Physics': '物理学博士生',
    'Physics': '物理学',
    'University of Electronic Science and Technology of China (UESTC)': '电子科技大学（UESTC）',
    'Institute of Fundamental and Frontier Sciences, University of Electronic Science and Technology of China (UESTC)': '电子科技大学基础与前沿研究院（IFFS）',
    'School of Optoelectronic Science and Engineering, University of Electronic Science and Technology of China (UESTC)': '电子科技大学光电科学与工程学院',
    '2026–Present': '2026–至今',
    'Current': '至今',
    'Undergraduate': '本科',
    'Direct-entry Ph.D. student in Physics': '物理学直博生',
    'Undergraduate studies in Optoelectronics': '光电专业本科',
    'Ph.D. student in Physics': '物理学博士生',
    'xIQLabs, University of Electronic Science and Technology of China (UESTC)': '电子科技大学 xIQLabs',
    'Open or download the current CV using the buttons below.': '可使用下方按钮查看或下载当前简历。',
    'The CV has not been supplied yet. Add a verified PDF and update the centralized profile configuration.': '简历文件尚未添加，请补充确认后的 PDF 并更新个人资料配置。',
    'View CV': '查看简历',
    'Download PDF': '下载 PDF',
    'Recommended local path: /files/cv.pdf': '建议本地路径：/files/cv.pdf',
    'How to publish the CV': '如何发布简历',
    'Copy the verified PDF to': '将确认后的 PDF 复制到',
    'Set': '设置',
    'in': '于',
    'Rebuild the site.': '重新构建网站。',
    'Framework': '框架',
    'Theme': '主题',
    'Built with Hexo & Butterfly': '基于 Hexo 与 Butterfly 构建',
    'Settings': '设置',
    'Toggle Between Light and Dark Mode': '切换深浅色模式',
    'Back to Top': '返回顶部',
    'Read Mode': '阅读模式',
    'Copy': '复制',
    'Copied': '已复制',
    'Table of Contents': '目录',
    'Previous Post': '上一篇',
    'Next Post': '下一篇',
    'No notes have been published yet.': '暂时还没有发布笔记。',
    'Open this entry to read more.': '打开条目阅读全文。',
    'Open this post to read more.': '打开文章阅读全文。',
    'Academic profile': '学术信息',
    'Academic profiles and contact': '学术主页与联系方式'
  };

  function readLanguage() {
    try {
      return localStorage.getItem(languageKey) === 'zh' ? 'zh' : 'en';
    } catch (_) {
      return 'en';
    }
  }

  function storeLanguage(language) {
    try {
      localStorage.setItem(languageKey, language);
    } catch (_) {
      // The switch still works for this page when storage is unavailable.
    }
  }

  function translateValue(value) {
    if (zh[value]) return zh[value];

    const noteCount = value.match(/^(\d+) notes?$/i);
    if (noteCount) return `${noteCount[1]} 篇`;

    const date = value.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}), (\d{4})$/);
    if (date) {
      const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
      return `${date[3]}年${months[date[1]]}月${date[2]}日`;
    }

    const month = value.match(/^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/);
    if (month) {
      const months = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 };
      return `${month[2]}年${months[month[1]]}月`;
    }

    if (value.startsWith('Read ')) return `阅读${translateValue(value.slice(5))}`;
    if (value === '© 2026 By Zhiyang Liu') return '© 2026 刘志扬';
    return value;
  }

  function translateTextNode(node, language) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    if (language === 'en') {
      node.nodeValue = source;
      return;
    }

    const trimmed = source.trim();
    if (!trimmed) return;
    const translated = translateValue(trimmed);
    if (translated === trimmed) return;
    node.nodeValue = source.replace(trimmed, translated);
  }

  function translateAttributes(element, language) {
    if (element.id === 'language-toggle') return;
    const names = ['title', 'aria-label', 'placeholder', 'alt'];
    let stored = originalAttributes.get(element);
    if (!stored) {
      stored = {};
      originalAttributes.set(element, stored);
    }

    names.forEach(name => {
      if (!element.hasAttribute(name)) return;
      if (!(name in stored)) stored[name] = element.getAttribute(name);
      element.setAttribute(name, language === 'zh' ? translateValue(stored[name]) : stored[name]);
    });
  }

  function applyLanguage(language) {
    activeLanguage = language;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.documentElement.dataset.language = language;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('script, style, pre, code, textarea, [data-no-translate]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => translateTextNode(node, language));
    document.querySelectorAll('[title], [aria-label], [placeholder], [alt]').forEach(element => translateAttributes(element, language));

    if (language === 'zh') {
      if (!/[\u4e00-\u9fff]/.test(document.title)) sourcePageTitle = document.title;
      document.title = sourcePageTitle.split(' | ').map(part => translateValue(part)).join(' | ');
    } else {
      document.title = sourcePageTitle;
    }

    updateLanguageButton();
  }

  function updateLanguageButton() {
    const button = document.getElementById('language-toggle');
    if (!button) return;
    const showingEnglish = activeLanguage === 'en';
    const label = showingEnglish ? '切换至中文' : 'Switch to English';
    button.innerHTML = `<span class="academic-language-glyph" aria-hidden="true">${showingEnglish ? '中' : 'EN'}</span>`;
    button.title = label;
    button.setAttribute('aria-label', label);
  }

  function ensureLanguageButton() {
    const settings = document.getElementById('rightside-config-hide');
    if (!settings) return;
    let button = document.getElementById('language-toggle');
    if (!button) {
      button = document.createElement('button');
      button.id = 'language-toggle';
      button.type = 'button';
      button.addEventListener('click', () => {
        const language = activeLanguage === 'en' ? 'zh' : 'en';
        storeLanguage(language);
        applyLanguage(language);
        if (window.btf?.snackbarShow) {
          window.btf.snackbarShow(language === 'zh' ? '已切换至中文' : 'Switched to English');
        }
      });
      settings.appendChild(button);
    }
    updateLanguageButton();
  }

  function initAcademicPages() {
    document.documentElement.dataset.academicJs = 'ready';
    document.body.classList.toggle('has-academic-home', Boolean(document.querySelector('.academic-home')));

    document.querySelectorAll('[data-open-search]').forEach(trigger => {
      if (trigger.dataset.academicSearchReady) return;
      trigger.dataset.academicSearchReady = 'true';
      trigger.addEventListener('click', () => {
        const searchButton = document.querySelector('#search-button > .search');
        if (searchButton) window.setTimeout(() => searchButton.click(), 0);
      });
    });

    document.querySelectorAll('[data-publication-filter]').forEach(button => {
      if (button.dataset.academicReady) return;
      button.dataset.academicReady = 'true';
      button.addEventListener('click', () => {
        const filter = button.dataset.publicationFilter;
        document.querySelectorAll('[data-publication-filter]').forEach(item => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        document.querySelectorAll('[data-publication-type]').forEach(item => {
          item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.publicationType !== filter);
        });
      });
    });

    ensureLanguageButton();
    applyLanguage(activeLanguage);
  }

  document.addEventListener('click', event => {
    const placeholder = event.target.closest('[aria-disabled="true"]');
    if (placeholder) {
      event.preventDefault();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAcademicPages);
  } else {
    initAcademicPages();
  }

  document.addEventListener('pjax:complete', () => {
    if (activeLanguage === 'zh' && !/[\u4e00-\u9fff]/.test(document.title)) sourcePageTitle = document.title;
    initAcademicPages();
  });
})();
