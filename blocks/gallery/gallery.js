const pageUrl = `/gallery.json`;
const limit = 5;

async function getImagesList(offset) {
  const response = await fetch(`${pageUrl}?limit=${limit}&offset=${offset}`);
  const results = await response.json();

  const totalCount = results.total;
  const data = results.data;

  const currentPage = (offset !== 1) ? Math.ceil(offset / limit) + 1 : offset;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    currentPage,
    totalPages,
  };
}

function createPagination(block, currentPage, totalPages) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.innerText = i;
    button.addEventListener('click', async function() {
      const result = await getImagesList(i);
      renderResult(block, result, i);
    });

    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationContainer.appendChild(button);
  }
  return paginationContainer;
}

function renderResult(block, result, currentPage){
  block.innerHTML="";
  const { data, totalPages } = result;
  let currentActivePage = currentPage || result.currentPage;
  if (data.length) {
    const ulElement = document.createElement("ul");
    data.forEach(({ image_url, title, subcopy, redirect_url }) => {
      const listElement = document.createElement("li");
      listElement.className = "gallery-tile";
      // Set the innerHTML of the div to include the JSON data
      listElement.innerHTML = `
        <div class="gallery-tile-image">
          <picture>
            <source type="image/webp" srcset="${image_url}?preferwebp=true&width=750&optimize=medium">
            <img loading="lazy" alt="${title}" src="${image_url}?preferwebp=true&width=260&quality=70" />
          </picture>
        </div>
        <div class="gallery-tile-body">
          <h2 class="title">${title}</h2>
          <p>${subcopy}</p>
          <a href="${redirect_url}" title="${title}" target="_blank" class="gallery-tile-link">More Info</a>
        </div>
      `;

      // Append the new div element to an existing element in the DOM
      ulElement.appendChild(listElement);
    });
    block.appendChild(ulElement);
    // creating pagination container;
    if(totalPages <= 1) {
      return false;
    }
    const paginationContainer = createPagination(block, currentActivePage, totalPages);
    block.appendChild(paginationContainer);
  }
}

export default async function decorate(block) {
  const offset = 1;
  block.innerHTML="";

  const result = await getImagesList(offset);
  renderResult(block, result);
}