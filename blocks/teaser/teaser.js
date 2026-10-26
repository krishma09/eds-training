import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The model gives us 4 rows, in model order:
  // 1. image (+ imageAlt), 2. eyebrow, 3. text, 4. link (+ linkText)
  const [imageRow, eyebrowRow, textRow, ctaRow] = [...block.children];

  // 1. Name each row with a class. We add classes instead of rebuilding,
  //    so the Universal Editor attributes (data-aue-*) stay in place.
  imageRow?.classList.add('teaser-image');
  eyebrowRow?.classList.add('teaser-eyebrow');
  textRow?.classList.add('teaser-text');
  ctaRow?.classList.add('teaser-cta');

  // 2. Swap the image for an optimized one (WebP, right size),
  //    and copy the editor attributes onto the new <img>.
  const img = imageRow?.querySelector('img');
  if (img) {
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, picture.querySelector('img'));
    img.closest('picture').replaceWith(picture);
  }

  // 3. Style the link as a button (uses the boilerplate's button styles).
  ctaRow?.querySelector('a')?.classList.add('button', 'primary');

  // 4. Group the text rows, so CSS can place image | content side by side.
  //    Moving elements keeps their editor attributes.
  const content = document.createElement('div');
  content.className = 'teaser-content';
  content.append(...[eyebrowRow, textRow, ctaRow].filter(Boolean));
  block.append(content);

  // 5. Mark empty rows so CSS can hide them. Never delete them:
  //    an author may fill them in later.
  [eyebrowRow, textRow, ctaRow].filter(Boolean).forEach((row) => {
    if (!row.textContent.trim()) row.classList.add('teaser-empty');
  });
}
