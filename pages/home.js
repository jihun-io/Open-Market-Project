import Header from "../components/header.js";
import Footer from "../components/footer.js";

async function getProducts(API_URL) {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();

  let result;

  result = data.results
    .map((product) => {
      return `
      <a href="/items/${product.id}">
        <article class="item">
          <img src="${product.image}" alt="${product.name}" />
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
    content: `
    ${Header()}
    <main>
      <section class="carousel">
        <h2 class="sr-only">이벤트 배너</h2>
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
