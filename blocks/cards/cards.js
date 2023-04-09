import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const placeholders = fetchPlaceholders();
  const ul = document.createElement('ul');
  const cardPlaceholderKey = "clickhere";
  const cardPlaceholderLink = "cardlink";
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.innerHTML = row.innerHTML;
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  placeholders.then((placeholders) => {
    ul.querySelectorAll('.cards-card-body').forEach(element => {
      const cardLink = placeholders[cardPlaceholderLink];
      const cardText = placeholders[cardPlaceholderKey];
      element.innerHTML  = element.innerText.replace(cardPlaceholderKey, `<a href=${cardLink} class='cards-card-link' target='_blank'>${cardText}</a>`);
    });
  });
  block.textContent = "";
  block.append(ul);
}
