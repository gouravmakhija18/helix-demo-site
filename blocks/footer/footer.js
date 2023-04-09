import { decorateMain } from '../../scripts/scripts.js';
import { readBlockConfig, decorateIcons, loadBlocks } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;
    decorateMain(footer);
    await loadBlocks(footer);
    decorateIcons(footer);
    block.append(footer);
    footer.closest('footer').classList.add('appear');

    // open all footer links in new windows
    block.querySelectorAll('a').forEach((a) => {
      a.target = '_blank';
    });
  }
  return null;
}
