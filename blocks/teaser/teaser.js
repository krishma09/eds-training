/* eslint-disable no-console */
/* eslint-disable indent */

function getTextContent(block, index) {
  const content = block.children[index]?.querySelector('div');
  return content ? content.textContent.trim() : '';
}

function getRichTextContent(block, index) {
  const content = block.children[index]?.querySelector('div');
  if (!content) return '';
  const p = content.querySelector('p');
  return p ? p.innerHTML.trim() : content.innerHTML.trim();
}

function getPicture(block, index) {
  const row = block.children[index];
  return row?.querySelector('picture') || null;
}

function getLink(block, index) {
  const row = block.children[index];
  return row?.querySelector('a')?.href || '';
}

function extractConfig(block) {
  if (!block) return {};

  return {
    id: getTextContent(block, 0),
    backgroundImage: getPicture(block, 1),
    title: getRichTextContent(block, 2),
    subtitle: getRichTextContent(block, 3),
    description: getRichTextContent(block, 4),
    disclaimer: getRichTextContent(block, 5),
    primaryCtaContent: getRichTextContent(block, 6),
    primaryCtaLink: getLink(block, 7),
  };
}

function buildTeaser(block, config) {
  const {
    id,
    backgroundImage,
    backgroundImageAlt,
    title,
    subtitle,
    description,
    disclaimer,
    primaryCtaContent,
    primaryCtaLink,
  } = config;

  if (id) block.id = id;

  // Background image
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'teaser-background';
  if (backgroundImage) {
    const img = backgroundImage.querySelector('img');
    if (img && backgroundImageAlt) img.alt = backgroundImageAlt;
    imageWrapper.appendChild(backgroundImage);
  }

  // Content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'teaser-content';

  // Title
  if (title) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'teaser-title';
    titleEl.innerHTML = title;
    contentWrapper.appendChild(titleEl);
  }

  // Subtitle
  if (subtitle) {
    const subtitleEl = document.createElement('div');
    subtitleEl.className = 'teaser-subtitle';
    subtitleEl.innerHTML = subtitle;
    contentWrapper.appendChild(subtitleEl);
  }

  // Description
  if (description) {
    const descEl = document.createElement('div');
    descEl.className = 'teaser-description';
    descEl.innerHTML = description;
    contentWrapper.appendChild(descEl);
  }

  // Primary CTA
  if (primaryCtaLink && primaryCtaContent) {
    const cta = document.createElement('a');
    cta.className = 'teaser-cta teaser-cta--primary';
    cta.href = primaryCtaLink;
    cta.innerHTML = primaryCtaContent;
    contentWrapper.appendChild(cta);
  }

  // Disclaimer
  if (disclaimer) {
    const disclaimerEl = document.createElement('div');
    disclaimerEl.className = 'teaser-disclaimer';
    disclaimerEl.innerHTML = disclaimer;
    contentWrapper.appendChild(disclaimerEl);
  }

  // Assemble
  block.innerHTML = '';
  block.appendChild(imageWrapper);
  block.appendChild(contentWrapper);
}

export default function decorate(block, defaultConfig) {
  const config = defaultConfig || extractConfig(block);
  buildTeaser(block, config);
}
