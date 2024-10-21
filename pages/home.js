import Header from "../components/header.js";
import Footer from "../components/footer.js";

async function getProducts(API_URL) {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();

  let result;

  result = data.results
    .map((product) => {
      return /*html*/ `
      <a href="/items/${product.id}">
        <article class="item">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <p class="seller">${product.seller.store_name}</p>
          <h3 class="title">${product.name}</h3>
          <p class="price">
            <span class="number">${product.price.toLocaleString(
              "ko-KR"
            )}</span>원
          </p>
        </article>
      </a>
    `;
    })
    .join("");

  return result;
}

export default async function Home({ API_URL }) {
  const products = await getProducts(API_URL);
  return {
    title: "홈 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
      <section class="carousel">
        <h2 class="sr-only">이벤트 배너</h2>
        <ul class="images">
          <li><img src="https://placehold.co/600x400" alt="" /></li>
          <li><img src="https://placehold.co/600x400" alt="" /></li>
          <li><img src="https://placehold.co/600x400" alt="" /></li>
          <li><img src="https://placehold.co/600x400" alt="" /></li>
          <li><img src="https://placehold.co/600x400" alt="" /></li>
        </ul>
        <div class="controller">
          <button class="prev">
            <img src="/images/icon-swiper-1.svg" alt="이전" />
          </button>
          <button class="next">
            <img src="/images/icon-swiper-2.svg" alt="다음" />
          </button>
        </div>
        <div class="event-banner">
          <button class="active">
            <span class="sr-only">1번 이미지</span>
          </button>
          <button>
            <span class="sr-only">2번 이미지</span>
          </button>
          <button>
            <span class="sr-only">3번 이미지</span>
          </button>
          <button>
            <span class="sr-only">4번 이미지</span>
          </button>
          <button>
            <span class="sr-only">5번 이미지</span>
          </button>
        </div>
      </section>
      <section class="product-lists">
        <h2 class="sr-only">상품 목록</h2>
        ${products}
      </section>
    </main>
    ${Footer()}
  `,
  };
}

export function carousel() {
  const carousel = document.querySelector(".carousel");
  const prev = carousel.querySelector(".prev");
  const next = carousel.querySelector(".next");
  const eventBanner = carousel.querySelector(".event-banner");
  const buttons = eventBanner.querySelectorAll("button");

  let current = 0;

  // carousel with animation
  function showImage(index) {
    buttons[current].classList.remove("active");
    current = index;
    buttons[current].classList.add("active");

    const images = carousel.querySelector(".images");
    const image = images.querySelector("li");
    const width = image.clientWidth;
    images.style.transform = `translateX(-${width * index}px)`;
  }

  prev.addEventListener("click", () => {
    let index = current - 1;
    if (index < 0) {
      index = buttons.length - 1;
    }
    showImage(index);
  });

  next.addEventListener("click", () => {
    let index = current + 1;
    if (index >= buttons.length) {
      index = 0;
    }
    showImage(index);
  });

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showImage(index);
    });
  });
}
