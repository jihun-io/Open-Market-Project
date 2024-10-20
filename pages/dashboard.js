import SellerHeader from "../components/sellerHeader.js";
import DecryptingAccess from "../scripts/decryptingAccess.js";

let api;
async function getData() {
  const decryptedAccess = await DecryptingAccess(
    sessionStorage.getItem("encryptedAccess")
  );

  const url = `${api}/${localStorage.getItem("name")}/products/`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decryptedAccess}`,
      },
    });
    if (!res.ok) {
      console.error(res);
      location.href = "/logout";
    } else {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.error(error);
    location.href = "/logout";
  }
}

async function tableBody() {
  const sellerProducts = await getData();

  if (sellerProducts.count === 0) {
    return /*html*/ `
      <tr>
        <td colspan="4">판매중인 상품이 없습니다.</td>
      </tr>
    `;
  }

  const tbody = sellerProducts.results
    .map((product) => {
      return /*html*/ `
      <tr>
        <td>
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <p class="product-title">${product.name}</p>
            <p class="product-amount">재고 :&nbsp;<span>${
              product.stock
            }</span>개</p>
          </div>
        </td>
        <td><span>${product.price.toLocaleString("ko-KR")}</span>원</td>
        <td><button class="modify">수정</button></td>
        <td><button class="delete">삭제</button></td>
      </tr>
    `;
    })
    .join("");

  return tbody;
}

export default async function SellerDashboard({ API_URL }) {
  api = API_URL;
  if (localStorage.getItem("user_type") !== "SELLER") {
    location.href = "/";
  }

  const products = await tableBody();

  return {
    title: "판매자 센터 - HODU",
    content: /*html*/ `
      ${SellerHeader()}
      <main>
      <section class="dashboard-title">
        <h2>
          대시보드<span class="sr-only">:&nbsp;</span
          ><span class="seller-name">${localStorage.getItem("name")}</span>
        </h2>
        <button><img src="/images/icon-plus.svg" alt="" />상품 업로드</button>
      </section>
      <section class="content">
        <aside>
          <ul>
            <li><button class="active">판매중인 상품(3)</button></li>
            <li>
              <button>주문/배송<span class="alert">2</span></button>
            </li>
            <li>
              <button>문의/리뷰<span class="alert">1</span></button>
            </li>
            <li><button>통계</button></li>
            <li><button>스토어 설정</button></li>
          </ul>
        </aside>
        <article>
          <h3 class="sr-only">판매중인 상품</h3>
          <table>
            <thead>
              <tr>
                <th>상품정보</th>
                <th>판매가격</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              ${products}
            </tbody>
          </table>
        </article>
      </section>
    </main>
    `,
  };
}
