const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobileMenu');
const yearNode = document.querySelector('#year');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
