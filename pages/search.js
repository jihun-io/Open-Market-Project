import Header from "../components/header.js";
import Footer from "../components/footer.js";

async function getProducts(API_URL) {
  const search = new URLSearchParams(location.search).get("query");

  const url = `${API_URL}/products/?search=${search}`;
  console.log(url);
  const res = await fetch(url, {
    method: "GET",
  });
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

  return `<p>${data.count}개의 상품이 존재합니다.</p>${result}`;
}

export default async function Home({ API_URL }) {
  const products = await getProducts(API_URL);
  return {
    title: "검색 결과 - HODU",
    content: `
    ${Header()}
    <main>
      <section class="product-lists">
        <h2 class="sr-only">상품 목록</h2>
        ${products}
      </section>
    </main>
    ${Footer()}
  `,
  };
}
