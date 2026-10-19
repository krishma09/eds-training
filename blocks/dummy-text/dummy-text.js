export default function decorate(block) {
  const [textRow] = [...block.children];

  // Name the row so CSS can target it (keeps Universal Editor attributes intact)
  textRow?.classList.add('dummy-text-content');

  // Mark the block when the author hasn't written anything yet
  if (!block.textContent.trim()) {
    block.classList.add('dummy-text-empty');
  }
}
