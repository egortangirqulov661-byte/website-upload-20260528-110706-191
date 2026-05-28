(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;
    let timer = null;

    const show = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const start = function () {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });

    show(0);
    start();
  }

  const filterInput = document.querySelector('[data-filter-input]');

  if (filterInput) {
    const cards = Array.from(document.querySelectorAll('[data-filter-card]'));

    filterInput.addEventListener('input', function () {
      const keyword = filterInput.value.trim().toLowerCase();

      cards.forEach(function (card) {
        const text = (card.getAttribute('data-filter-text') || '').toLowerCase();
        card.style.display = !keyword || text.includes(keyword) ? '' : 'none';
      });
    });
  }

  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');

  if (searchForm && searchInput && searchResults && Array.isArray(window.SEARCH_DATA)) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    const createCard = function (movie) {
      const link = document.createElement('a');
      link.className = 'movie-card';
      link.href = movie.url;

      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = movie.image;
      img.alt = movie.title;
      img.loading = 'lazy';
      const quality = document.createElement('span');
      quality.className = 'quality';
      quality.textContent = 'HD';
      figure.appendChild(img);
      figure.appendChild(quality);

      const body = document.createElement('div');
      body.className = 'movie-card-body';
      const title = document.createElement('h3');
      title.textContent = movie.title;
      const desc = document.createElement('p');
      desc.textContent = movie.description;
      const tags = document.createElement('div');
      tags.className = 'tag-row';
      [movie.year, movie.region, movie.category].forEach(function (item) {
        if (item) {
          const span = document.createElement('span');
          span.textContent = item;
          tags.appendChild(span);
        }
      });

      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(tags);
      link.appendChild(figure);
      link.appendChild(body);
      return link;
    };

    const render = function (query) {
      const keyword = query.trim().toLowerCase();
      const source = window.SEARCH_DATA;
      const list = keyword
        ? source.filter(function (movie) {
            return movie.searchText.toLowerCase().includes(keyword);
          })
        : source.slice(0, 36);

      searchResults.innerHTML = '';

      if (!list.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = '没有找到匹配的影片';
        searchResults.appendChild(empty);
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'movie-grid compact';
      list.slice(0, 80).forEach(function (movie) {
        grid.appendChild(createCard(movie));
      });
      searchResults.appendChild(grid);
    };

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim();
      const url = keyword ? './search.html?q=' + encodeURIComponent(keyword) : './search.html';
      window.history.replaceState(null, '', url);
      render(keyword);
    });

    searchInput.addEventListener('input', function () {
      render(searchInput.value);
    });

    render(initialQuery);
  }
})();
