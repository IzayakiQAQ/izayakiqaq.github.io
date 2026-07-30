'use strict';

const katex = require('katex');

/**
 * Site-owned presentation layer for academic pages.
 * All personal and scholarly content is read from source/_data/*.yml.
 */

const escapeHtml = value => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const isToken = value => /^\{\{[A-Z0-9_]+\}\}$/.test(String(value || '').trim());
const asArray = value => Array.isArray(value) ? value : [];

function dataStore() {
  return hexo.locals.get('data') || {};
}

function profile() {
  return dataStore().profile?.author || {};
}

function rootPath() {
  const root = hexo.config.root || '/';
  return `/${String(root).replace(/^\/+|\/+$/g, '')}${root === '/' ? '' : '/'}`.replace('//', '/');
}

function siteUrl(path = '') {
  const value = String(path || '');
  if (/^(?:https?:|mailto:|tel:|#)/i.test(value)) return value;
  const root = rootPath();
  if (value.startsWith(root)) return value;
  return `${root}${value.replace(/^\/+/, '')}`.replace(/([^:]\/)\/+/g, '$1');
}

function safeHref(value, type = 'url') {
  if (!value || isToken(value)) return '#profile-placeholder';
  if (type === 'email' && !/^mailto:/i.test(value)) return `mailto:${value}`;
  return siteUrl(value);
}

function optionalImage(value) {
  if (typeof value !== 'string') return '';
  const image = value.trim();
  return image && !isToken(image) ? siteUrl(image) : '';
}

function postImage(post) {
  return optionalImage(post?.cover || post?.image || post?.top_img);
}

function noteVisual(image, modifier) {
  if (!image) return '';
  return `<figure class="academic-note-visual academic-note-visual--${modifier}" aria-hidden="true">
    <img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async">
    <span class="academic-note-visual__signal"><i class="fas fa-wave-square" aria-hidden="true"></i></span>
  </figure>`;
}

function actionLink(label, value, icon, type = 'url', compact = false) {
  const href = safeHref(value, type);
  const disabled = href === '#profile-placeholder';
  const target = !disabled && /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="academic-action${compact ? ' academic-action--compact' : ''}${disabled ? ' is-placeholder' : ''}" href="${escapeHtml(href)}"${target}${disabled ? ' aria-disabled="true" title="Configure this link in source/_data/profile.yml"' : ''}><i class="${escapeHtml(icon)}" aria-hidden="true"></i><span>${escapeHtml(label)}</span></a>`;
}

function iconAction(label, value, icon, type = 'url') {
  const href = safeHref(value, type);
  const disabled = href === '#profile-placeholder';
  const target = !disabled && /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  const title = disabled ? `${label} — configure this link in source/_data/profile.yml` : label;
  return `<a class="academic-icon-action${disabled ? ' is-placeholder' : ''}" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(title)}"${target}${disabled ? ' aria-disabled="true"' : ''}><i class="${escapeHtml(icon)}" aria-hidden="true"></i></a>`;
}

hexo.extend.filter.register('marked:extensions', extensions => {
  extensions.push({
    name: 'academicBlockMath',
    level: 'block',
    start(src) {
      const match = src.match(/\\\[/);
      return match ? match.index : undefined;
    },
    tokenizer(src) {
      const match = /^\\\[\s*\n?([\s\S]+?)\n?\\\](?:\n|$)/.exec(src);
      if (!match) return undefined;
      return { type: 'academicBlockMath', raw: match[0], math: match[1] };
    },
    renderer(token) {
      return katex.renderToString(token.math, { displayMode: true, throwOnError: false });
    }
  });

  extensions.push({
    name: 'academicInlineMath',
    level: 'inline',
    start(src) {
      const match = src.match(/\\\(/);
      return match ? match.index : undefined;
    },
    tokenizer(src) {
      const match = /^\\\(([\s\S]+?)\\\)/.exec(src);
      if (!match) return undefined;
      return { type: 'academicInlineMath', raw: match[0], math: match[1] };
    },
    renderer(token) {
      return katex.renderToString(token.math, { displayMode: false, throwOnError: false });
    }
  });
});

function availableIconAction(label, value, icon, type = 'url') {
  return value && !isToken(value) ? iconAction(label, value, icon, type) : '';
}

function dataLink(label, value, icon) {
  const href = value ? safeHref(value) : '#data-placeholder';
  const disabled = !value;
  const target = !disabled && /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="academic-text-link${disabled ? ' is-placeholder' : ''}" href="${escapeHtml(href)}"${target}${disabled ? ' aria-disabled="true" title="Add this URL in the corresponding YAML data file"' : ''}><i class="${escapeHtml(icon)}" aria-hidden="true"></i>${escapeHtml(label)}</a>`;
}

function sectionHeading(eyebrow, title, description = '', link = '') {
  return `<header class="academic-section__header"><div><span class="academic-eyebrow">${escapeHtml(eyebrow)}</span><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ''}</div>${link ? `<a class="academic-section__link" href="${siteUrl(link)}">View all <i class="fas fa-arrow-right" aria-hidden="true"></i></a>` : ''}</header>`;
}

function profileTags(author, fallback = []) {
  const tags = asArray(author.focus).length ? author.focus : fallback;
  return `<div class="academic-profile-tags" aria-label="Academic profile">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>`;
}

function researchCards(items) {
  return `<div class="academic-research-grid">${items.map((item, index) => `
    <a class="academic-research-card" href="${siteUrl(`research/#${item.id || `research-area-${index + 1}`}`)}">
      <span class="academic-card-index">0${index + 1}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      <span class="academic-card-arrow">Explore direction <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
    </a>`).join('')}</div>`;
}

function projectCards(items) {
  return `<div class="academic-project-grid">${items.map((item, index) => {
    const hasImage = item.image && !isToken(item.image);
    return `<article class="academic-project-card">
      ${hasImage ? `<img class="academic-project-card__image" src="${escapeHtml(siteUrl(item.image))}" alt="">` : `<div class="academic-project-card__visual" aria-hidden="true"><span>PROJECT</span><strong>${String(index + 1).padStart(2, '0')}</strong></div>`}
      <div class="academic-project-card__body">
        <div class="academic-project-card__meta"><span>${escapeHtml(item.status || 'Placeholder')}</span></div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="academic-tags">${asArray(item.tags).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
        <div class="academic-inline-links">${dataLink('Paper', item.paper, 'fas fa-file-lines')}${dataLink('Code', item.code, 'fab fa-github')}${dataLink('Project page', item.demo, 'fas fa-arrow-up-right-from-square')}</div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function statusClass(status) {
  return String(status || 'preprint').toLowerCase().replace(/\s+/g, '-');
}

function publicationItem(item) {
  const image = optionalImage(item.image);
  return `<article class="academic-publication${image ? ' has-image' : ''}" data-publication-type="${escapeHtml(String(item.type || 'preprint').toLowerCase())}">
    <div class="academic-publication__year">${escapeHtml(item.year || 'YYYY')}</div>
    <div class="academic-publication__content">
      <div class="academic-publication__topline"><span class="academic-status academic-status--${statusClass(item.status)}">${escapeHtml(item.status || 'Preprint')}</span><span>${escapeHtml(item.type || 'Preprint')}</span></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="academic-publication__authors">${escapeHtml(item.authors)}</p>
      <p class="academic-publication__venue">${escapeHtml(item.venue)}</p>
      <div class="academic-inline-links">${dataLink('PDF', item.pdf, 'fas fa-file-pdf')}${dataLink('arXiv', item.arxiv, 'fas fa-box-archive')}${dataLink('Code', item.code, 'fab fa-github')}${dataLink('Project', item.project, 'fas fa-arrow-up-right-from-square')}</div>
    </div>
    ${image ? `<figure class="academic-publication__visual" aria-hidden="true"><img src="${escapeHtml(image)}" alt="" loading="lazy" decoding="async"><span><i class="fas fa-wave-square" aria-hidden="true"></i></span></figure>` : ''}
  </article>`;
}

function getPosts() {
  const posts = hexo.locals.get('posts');
  if (!posts) return [];
  return posts.sort('-date').toArray();
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
}

function categoriesFor(post) {
  if (!post.categories) return [];
  if (typeof post.categories.toArray === 'function') return post.categories.toArray();
  return asArray(post.categories);
}

function recentPosts(items, limit = 3) {
  if (!items.length) return '<p class="academic-empty">No posts yet.</p>';
  return `<div class="academic-post-list">${items.slice(0, limit).map(post => {
    const category = categoriesFor(post)[0];
    const image = postImage(post);
    return `<article class="academic-post-row${image ? ' has-image' : ''}">
      <div class="academic-post-row__meta"><time datetime="${escapeHtml(new Date(post.date).toISOString())}">${escapeHtml(formatDate(post.date))}</time>${category ? `<span>${escapeHtml(category.name || category)}</span>` : ''}</div>
      <h3><a href="${siteUrl(post.path)}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.description || 'Open this post to read more.')}</p>
      ${noteVisual(image, 'row')}
      <a class="academic-read-link" href="${siteUrl(post.path)}">Read note <i class="fas fa-arrow-right" aria-hidden="true"></i></a>
    </article>`;
  }).join('')}</div>`;
}

function renderHome() {
  const data = dataStore();
  const author = profile();
  const research = asArray(data.research);
  const projects = asArray(data.projects).filter(item => item.selected !== false).slice(0, 4);
  const publications = asArray(data.publications).filter(item => item.selected !== false).slice(0, 5);
  const interests = research.slice(0, 3).map(item => item.title);
  const hasAvatar = author.avatar && !isToken(author.avatar);

  const posts = getPosts();
  return `<main class="academic-home">
    <section class="academic-hero${hasAvatar ? '' : ' academic-hero--without-portrait'}" aria-labelledby="academic-hero-title">
      <div class="academic-hero__copy">
        <span class="academic-kicker">Doctoral Researcher · Academic Homepage</span>
        <h1 id="academic-hero-title">${escapeHtml(author.name)}</h1>
        <p class="academic-hero__role">${escapeHtml(author.title || 'Ph.D. Student')}</p>
        <p class="academic-hero__affiliation">${escapeHtml(author.university)} <span aria-hidden="true">·</span> ${escapeHtml(author.laboratory)}</p>
        ${profileTags(author, interests)}
        <div class="academic-icon-actions" aria-label="Academic profiles and contact">
          ${availableIconAction('GitHub', author.github, 'fa-brands fa-github')}
          ${availableIconAction('Google Scholar', author.scholar, 'fa-solid fa-graduation-cap')}
          ${availableIconAction('Email', author.email, 'fa-solid fa-envelope', 'email')}
          ${availableIconAction('ORCID', author.orcid, 'fa-brands fa-orcid')}
          ${availableIconAction('CV', author.cv, 'fa-solid fa-file-lines')}
        </div>
      </div>
      ${hasAvatar ? `<div class="academic-hero__portrait"><img src="${escapeHtml(siteUrl(author.avatar))}" alt="Portrait of ${escapeHtml(author.name)}"></div>` : ''}
    </section>

    <section class="academic-section academic-about-summary">
      ${sectionHeading('Profile', 'About me')}
      <div class="academic-about-summary__body">${profileTags(author, interests)}<a href="${siteUrl('about/')}">More about me <i class="fas fa-arrow-right" aria-hidden="true"></i></a></div>
    </section>

    <section class="academic-section">
      ${sectionHeading('Focus', 'Research interests', 'Current research directions and related open resources.', 'research/')}
      ${researchCards(research)}
    </section>

    ${projects.length ? `<section class="academic-section">
      ${sectionHeading('Work', 'Selected projects', 'Representative projects, methods, and open resources.', 'projects/')}
      ${projectCards(projects)}
    </section>` : ''}

    ${publications.length ? `<section class="academic-section">
      ${sectionHeading('Writing', 'Selected publications', 'A compact selection; all entries below are clearly marked placeholders.', 'publications/')}
      <div class="academic-publication-list">${publications.map(publicationItem).join('')}</div>
    </section>` : ''}

    ${posts.length ? `<section class="academic-section academic-section--quiet">
      ${sectionHeading('Notebook', 'Recent blog posts', 'Notes on research, learning, technology, and daily life.', 'blog/')}
      ${recentPosts(posts, 3)}
    </section>` : ''}
  </main>`;
}

function linkedDetail(value) {
  if (value && typeof value === 'object') {
    const label = value.label || value.url || '';
    const url = value.url;
    if (url) return `<a class="academic-text-link" href="${escapeHtml(safeHref(url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
    return escapeHtml(label);
  }
  return escapeHtml(value);
}

function detailList(title, values) {
  const items = asArray(values);
  if (!items.length) return '';
  return `<div class="academic-research-detail"><h4>${escapeHtml(title)}</h4><ul>${items.map(value => `<li>${linkedDetail(value)}</li>`).join('')}</ul></div>`;
}

function renderResearch() {
  const research = asArray(dataStore().research);
  return `<div class="academic-page academic-research-page">
    <p class="academic-page-lead">Research directions and related public resources.</p>
    <div class="academic-research-stack">${research.map((item, index) => `<section id="${escapeHtml(item.id || `research-area-${index + 1}`)}" class="academic-research-panel">
      <div class="academic-research-panel__intro"><span class="academic-card-index">0${index + 1}</span><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.description)}</p></div>
      <div class="academic-research-panel__details">${detailList('Research questions', item.questions)}${detailList('Methods', item.methods)}${detailList('Related projects', item.projects)}${detailList('Related publications', item.publications)}${detailList('Related code', item.code)}</div>
    </section>`).join('')}</div>
  </div>`;
}

function renderPublications() {
  const publications = asArray(dataStore().publications);
  return `<div class="academic-page academic-publications-page">
    <p class="academic-page-lead">No publications are listed at present.</p>
    <div class="academic-filter" role="group" aria-label="Filter publications">
      <button type="button" class="is-active" data-publication-filter="all" aria-pressed="true">All</button>
      <button type="button" data-publication-filter="journal" aria-pressed="false">Journal</button>
      <button type="button" data-publication-filter="conference" aria-pressed="false">Conference</button>
      <button type="button" data-publication-filter="preprint" aria-pressed="false">Preprint</button>
    </div>
    <div class="academic-publication-list academic-publication-list--full">${publications.length ? publications.map(publicationItem).join('') : '<p class="academic-empty">No publications are listed at present.</p>'}</div>
  </div>`;
}

function renderProjects() {
  const projects = asArray(dataStore().projects);
  return `<div class="academic-page academic-projects-page">${projects.length ? projectCards(projects) : '<p class="academic-empty">No projects are listed at present.</p>'}</div>`;
}

function renderBlog() {
  const posts = getPosts();
  const categoryDefinitions = [
    ['Learning Notes', 'learning-notes', 'Courses, papers, and concepts worth revisiting.', 'fa-solid fa-book-open'],
    ['Research Thoughts', 'research-thoughts', 'Questions, observations, and ideas in progress.', 'fa-solid fa-lightbulb'],
    ['Technology', 'technology', 'Code, tools, and reproducible technical records.', 'fa-solid fa-code'],
    ['Life', 'life', 'Occasional notes beyond the laboratory.', 'fa-solid fa-mug-hot']
  ];
  const count = name => posts.filter(post => categoriesFor(post).some(category => (category.name || category) === name)).length;
  const featured = posts[0];
  const featuredCategory = featured ? categoriesFor(featured)[0] : null;
  const featuredImage = featured ? postImage(featured) : '';
  const latestDate = featured ? formatDate(featured.date) : '—';
  const featuredMarkup = featured ? `<article class="academic-blog-feature${featuredImage ? ' has-image' : ''}">
    ${noteVisual(featuredImage, 'feature')}
    <div class="academic-blog-entry-meta"><span>${escapeHtml(featuredCategory?.name || 'Note')}</span><time datetime="${escapeHtml(new Date(featured.date).toISOString())}">${escapeHtml(formatDate(featured.date))}</time></div>
    <span class="academic-blog-entry-index" aria-hidden="true">01</span>
    <h3><a href="${siteUrl(featured.path)}">${escapeHtml(featured.title)}</a></h3>
    <p>${escapeHtml(featured.description || 'Open this entry to read more.')}</p>
    <a class="academic-blog-read" href="${siteUrl(featured.path)}">Read the note <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
  </article>` : '<p class="academic-empty">No notes have been published yet.</p>';
  const recentMarkup = posts.slice(1, 4).map((post, index) => {
    const category = categoriesFor(post)[0];
    const image = postImage(post);
    return `<article class="academic-blog-brief${image ? ' has-image' : ''}">
      <span class="academic-blog-entry-index" aria-hidden="true">${String(index + 2).padStart(2, '0')}</span>
      <div class="academic-blog-entry-meta"><span>${escapeHtml(category?.name || 'Note')}</span><time datetime="${escapeHtml(new Date(post.date).toISOString())}">${escapeHtml(formatDate(post.date))}</time></div>
      <h3><a href="${siteUrl(post.path)}">${escapeHtml(post.title)}</a></h3>
      ${noteVisual(image, 'brief')}
      <a class="academic-blog-brief__arrow" href="${siteUrl(post.path)}" aria-label="Read ${escapeHtml(post.title)}"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
    </article>`;
  }).join('');

  return `<div class="academic-page academic-blog-page">
    <section class="academic-blog-hero" aria-labelledby="academic-blog-title">
      <div class="academic-blog-hero__copy">
        <span class="academic-eyebrow">Research notebook</span>
        <h1 id="academic-blog-title">Notes, methods<br>&amp; ideas.</h1>
        <p>Working records from study, research, code, and life.</p>
        <div class="academic-blog-hero__actions">
          <button type="button" data-open-search><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>Search notes</button>
          <a href="${siteUrl('archives/')}">Browse archive <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
        </div>
      </div>
      <dl class="academic-blog-ledger" aria-label="Notebook overview">
        <div><dt>Entries</dt><dd>${String(posts.length).padStart(2, '0')}</dd></div>
        <div><dt>Topics</dt><dd>${String(categoryDefinitions.length).padStart(2, '0')}</dd></div>
        <div><dt>Latest update</dt><dd>${escapeHtml(latestDate)}</dd></div>
      </dl>
    </section>

    <section class="academic-blog-latest" aria-labelledby="academic-blog-latest-title">
      <header class="academic-blog-section-heading">
        <div><span class="academic-eyebrow">Latest entries</span><h2 id="academic-blog-latest-title">Recently added</h2></div>
        <a href="${siteUrl('archives/')}">All notes <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
      </header>
      <div class="academic-blog-latest__grid">
        ${featuredMarkup}
        <div class="academic-blog-briefs">${recentMarkup}</div>
      </div>
    </section>

    <section class="academic-blog-browse" aria-labelledby="academic-blog-browse-title">
      <header class="academic-blog-section-heading">
        <div><span class="academic-eyebrow">Browse by topic</span><h2 id="academic-blog-browse-title">Four streams of notes</h2></div>
      </header>
      <div class="academic-blog-streams">${categoryDefinitions.map(([name, slug, description, icon], index) => {
        const categoryCount = count(name);
        return `<a href="${siteUrl(`categories/${slug}/`)}">
          <span class="academic-blog-stream__index">${String(index + 1).padStart(2, '0')}</span>
          <i class="${icon}" aria-hidden="true"></i>
          <div><h3>${name}</h3><p>${description}</p></div>
          <span class="academic-blog-stream__count">${categoryCount} note${categoryCount === 1 ? '' : 's'}</span>
          <i class="fa-solid fa-arrow-right academic-blog-stream__arrow" aria-hidden="true"></i>
        </a>`;
      }).join('')}</div>
    </section>

    <nav class="academic-blog-library" aria-label="More ways to browse">
      <span>Explore the library</span>
      <a href="${siteUrl('archives/')}"><i class="fa-solid fa-box-archive" aria-hidden="true"></i>Archives</a>
      <a href="${siteUrl('categories/')}"><i class="fa-solid fa-folder-open" aria-hidden="true"></i>Categories</a>
      <a href="${siteUrl('tags/')}"><i class="fa-solid fa-tags" aria-hidden="true"></i>Tags</a>
      <button type="button" data-open-search><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>Search</button>
    </nav>
  </div>`;
}

function timeline(items, kind) {
  return `<div class="academic-timeline">${asArray(items).map(item => `<div class="academic-timeline__item"><span>${escapeHtml(item.period)}</span><div><h3>${escapeHtml(item.degree || item.role)}</h3><p>${escapeHtml(item.institution || item.organization)}</p></div></div>`).join('')}</div>`;
}

function simplePlaceholderList(items) {
  return `<ul class="academic-simple-list">${asArray(items).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderAbout() {
  const data = dataStore().profile || {};
  const author = data.author || {};
  return `<div class="academic-page academic-about-page">
    <section class="academic-about-intro"><span class="academic-eyebrow">Biography</span><h2>${escapeHtml(author.name)} <small>${escapeHtml(author.name_cn)}</small></h2>${profileTags(author)}</section>
    ${asArray(data.education).length ? `<section><h2>Education</h2>${timeline(data.education)}</section>` : ''}
    ${asArray(data.experience).length ? `<section><h2>Research experience</h2>${timeline(data.experience)}</section>` : ''}
    ${asArray(data.service).length || asArray(data.awards).length ? `<div class="academic-about-columns">${asArray(data.service).length ? `<section><h2>Academic service</h2>${simplePlaceholderList(data.service)}</section>` : ''}${asArray(data.awards).length ? `<section><h2>Awards</h2>${simplePlaceholderList(data.awards)}</section>` : ''}</div>` : ''}
    <section><h2>Contact</h2><div class="academic-icon-actions">${availableIconAction('Email', author.email, 'fa-solid fa-envelope', 'email')}${availableIconAction('GitHub', author.github, 'fa-brands fa-github')}${availableIconAction('ORCID', author.orcid, 'fa-brands fa-orcid')}</div></section>
  </div>`;
}

hexo.extend.filter.register('before_generate', () => {
  const author = profile();
  if (author.name) {
    hexo.config.author = author.name;
    hexo.config.title = `${author.name} — Academic Homepage`;
  }
  if (author.bio) hexo.config.description = author.bio;

  const theme = hexo.theme?.config;
  if (!theme) return;

  theme.nav = theme.nav || {};
  // Butterfly's nav.logo is an image URL; keep it empty and use the site title.
  theme.nav.logo = '';

  const social = {};
  if (author.github && !isToken(author.github)) social['fab fa-github'] = `${author.github} || GitHub`;
  if (author.scholar && !isToken(author.scholar)) social['fas fa-graduation-cap'] = `${author.scholar} || Google Scholar`;
  if (author.email && !isToken(author.email)) social['fas fa-envelope'] = `${safeHref(author.email, 'email')} || Email`;
  if (author.orcid && !isToken(author.orcid)) social['fab fa-orcid'] = `${author.orcid} || ORCID`;
  theme.social = social;

  theme.inject = theme.inject || {};
  theme.inject.head = asArray(theme.inject.head).filter(item => !String(item).includes('academic-custom-css'));
  theme.inject.bottom = asArray(theme.inject.bottom).filter(item => !String(item).includes('academic-custom-js'));
  theme.inject.head.push(`<link id="academic-custom-css" rel="stylesheet" href="${siteUrl('css/custom.css?v=20260721m')}">`);
  theme.inject.bottom.push(`<script id="academic-custom-js" src="${siteUrl('js/academic.js?v=20260721m')}"></script>`);

  theme.footer = theme.footer || {};
  theme.footer.custom_text = `<span class="academic-footer-links">${actionLink('GitHub', author.github, 'fab fa-github', 'url', true)}${actionLink('Email', author.email, 'fas fa-envelope', 'email', true)}${actionLink('RSS', siteUrl('atom.xml'), 'fas fa-rss', 'url', true)}</span><span>Built with Hexo &amp; Butterfly</span>`;

  if (author.avatar && !isToken(author.avatar)) {
    theme.avatar = theme.avatar || {};
    // Butterfly applies Hexo's root to theme image paths itself.
    theme.avatar.img = author.avatar;
  }
});

hexo.extend.tag.register('academic_home', renderHome);
hexo.extend.tag.register('academic_research', renderResearch);
hexo.extend.tag.register('academic_publications', renderPublications);
hexo.extend.tag.register('academic_projects', renderProjects);
hexo.extend.tag.register('academic_blog', renderBlog);
hexo.extend.tag.register('academic_about', renderAbout);
