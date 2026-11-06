const artworks = [...document.querySelectorAll('[data-gallery]')];
const viewer = document.querySelector('.lightbox');
const viewerImage = viewer.querySelector('.lightbox-image');
const viewerTitle = viewer.querySelector('.viewer-title');
const viewerDate = viewer.querySelector('.viewer-date');
const viewerCount = viewer.querySelector('.viewer-count');
const originalLink = viewer.querySelector('.viewer-original');
const viewerControls = [...viewer.querySelectorAll('button, a[href]')];
let currentIndex = 0;
let opener;

function showArtwork(index) {
  currentIndex = (index + artworks.length) % artworks.length;
  const link = artworks[currentIndex];
  const figure = link.closest('figure');
  viewerImage.src = link.href;
  viewerImage.alt = link.querySelector('img').alt;
  viewerTitle.textContent = figure.querySelector('.artwork-title').textContent;
  viewerDate.textContent = figure.querySelector('time').textContent;
  viewerCount.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${artworks.length}`;
  originalLink.href = link.href;
}

artworks.forEach((link, index) => {
  link.setAttribute('aria-haspopup', 'dialog');
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    showArtwork(index);
    viewer.showModal();
    document.body.classList.add('viewer-open');
  });
});

viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.querySelector('.viewer-previous').addEventListener('click', () => showArtwork(currentIndex - 1));
viewer.querySelector('.viewer-next').addEventListener('click', () => showArtwork(currentIndex + 1));

viewer.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showArtwork(currentIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
  if (event.key === 'Tab') {
    const first = viewerControls[0];
    const last = viewerControls[viewerControls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

viewer.addEventListener('click', event => {
  const bounds = viewer.getBoundingClientRect();
  if (event.target === viewer && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
    viewer.close();
  }
});

viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  opener.focus({ preventScroll: true });
});
