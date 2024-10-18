import Header from "../components/header.js";
import Footer from "../components/footer.js";

let api;
let itemId;

function plusIcon() {
  return /*html*/ `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 9.5H20" stroke="#C4C4C4" stroke-width="2"/>
  <path d="M10 20L10 0" stroke="#C4C4C4" stroke-width="2"/>
  </svg>
  
`;
}

function minusIcon() {
  return /*html*/ `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 10H20" stroke="#C4C4C4" stroke-width="2"/>
  </svg>
  
`;
}

async function getData(API_URL, productId) {
  const res = await fetch(`${API_URL}/products/${productId}`)
    .then((res) => {
      const data = res.json();
      return data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  return res;
}

async function fetchData(API_URL, productId) {
  const product = await getData(API_URL, productId)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  if (product.detail === "No Product matches the given query.") {
    return false;
  } else {
    return product;
  }
}

export default async function Details({ API_URL, params }) {
  const productId = params.id;
  api = API_URL;
  itemId = productId;

  const result = await fetchData(API_URL, productId);
  if (result === false) {
    return {
      title: "상품이 존재하지 않습니다. - HODU",
      content: /*html*/ `
        ${Header()}
        <main class="no-product">
          <h2>상품이 존재하지 않습니다.</h2>
          <ul>
            <li><a href="/">메인으로</a></li>
            <li><button onclick="history.back()">이전 페이지</button></li>
          </ul>
        </main>
        ${Footer()}
      `,
    };
  } else {
    return {
      title: `${result.name} - HODU`,
      content: /*html*/ `
      ${Header()}
      <main>
      <h2 class="sr-only">상품 정보</h2>
      <article class="product-info">
      <img
        src="${result.image}"
        alt="${result.name}"
      />
      <div class="purchase">
        <div class="item-info">
          <p class="seller">${result.seller.store_name}</p>
          <p class="title">${result.name}</p>
          <p class="price"><span>${result.price.toLocaleString(
            "ko-KR"
          )}</span>원</p>
        </div>
        <div class="buy-info">
          <p class="shipping">
          ${
            result.shipping_method === "PARCEL"
              ? "택배배송 / "
              : result.shipping_method === "DELIVERY"
              ? "직접배송(화물배달) /"
              : "방문수령 /"
          }
            ${
              result.shipping_fee === 0
                ? "무료배송"
                : `배송비 ${result.shipping_fee.toLocaleString("ko-KR") + "원"}`
            }
          </p>
          <div class="amount">
            <button>
              ${minusIcon()}
              <span class="sr-only">뺴기</span>
            </button>
            <input type="number" value="1" step="1" max="${
              result.stock
            }" readonly />
            <button>
              ${plusIcon()}
              <span class="sr-only">더하기</span>
            </button>
          </div>
          <p class="total">
            <span class="total-text
              ">총 상품 금액</span
            ><span class="total-amount"
              ><span class="amount"
                >총 수량 <span class="count">1</span>개</span
              ><span class="value"
                ><span class="total-price">${result.price.toLocaleString(
                  "ko-KR"
                )}</span>원</span
              ></span
            >
          </p>
          <ul class="btn-row">
            <li><button class="purchase">바로 구매</button></li>
            <li><button class="cart">장바구니</button></li>
          </ul>
        </div>
      </div>
    </article>
    <article class="product-details">
      <h2 class="sr-only"></h2>
      <ul>
        <li><button class="active">버튼</button></li>
        <li><button>리뷰</button></li>
        <li><button>Q&A</button></li>
        <li><button>반품/교환정보</button></li>
      </ul>
    </article>
  </main>
  ${Footer()}
  <dialog class="login">
    <div class="window-controller">
      <button class="modal-no">
        <img src="/images/icon-delete.svg" alt="닫기" />
      </button>
    </div>
    <p>로그인이 필요한 서비스입니다.<br />로그인 하시겠습니까?</p>
    <ul>
      <li><button class="modal-no">아니요</button></li>
      <li><button class="modal-yes">예</button></li>
    </ul>
  </dialog>
  <dialog class="cart">
    <div class="window-controller">
      <button class="modal-no">
        <img src="/images/icon-delete.svg" alt="닫기" />
      </button>
    </div>
    <p>장바구니에 상품이 담겼습니다!<br />장바구니로 이동할까요?</p>
    <ul>
      <li><button class="modal-no">아니요</button></li>
      <li><button class="modal-yes">예</button></li>
    </ul>
  </dialog>
  `,
    };
  }
}

export function detailsScript() {
  const plusBtn = document.querySelector(".amount button:last-child");
  const minusBtn = document.querySelector(".amount button:first-child");
  const input = document.querySelector(".amount input");
  const totalAmount = document.querySelector(".total-amount .count");
  const originalPrice = document.querySelector(".price span");
  const totalPrice = document.querySelector(".total-amount .total-price");

  if (parseInt(input.value) === parseInt(input.max)) {
    plusBtn.setAttribute("disabled", true);
  }

  plusBtn.addEventListener("click", () => {
    input.value = parseInt(input.value) + 1;
    if (parseInt(input.value) === parseInt(input.max)) {
      plusBtn.setAttribute("disabled", true);
    }
    totalAmount.textContent = input.value;
    totalPrice.textContent = (
      parseInt(originalPrice.textContent.replaceAll(",", "")) * input.value
    ).toLocaleString("ko-KR");
  });

  minusBtn.addEventListener("click", () => {
    if (parseInt(input.value) > 1) {
      plusBtn.removeAttribute("disabled");
      input.value = parseInt(input.value) - 1;
      totalAmount.textContent = input.value;
      totalPrice.textContent = (
        parseInt(originalPrice.textContent.replaceAll(",", "")) * input.value
      ).toLocaleString("ko-KR");
    }
  });

  input.addEventListener("keyup", (event) => {
    input.value = parseInt(input.value);
    totalAmount.textContent = input.value;
    totalPrice.textContent = (
      parseInt(originalPrice.textContent.replaceAll(",", "")) * input.value
    ).toLocaleString("ko-KR");
  });

  input.addEventListener("blur", () => {
    if (input.value === "" || input.value === "0") {
      input.value = 1;
      totalAmount.textContent = 1;
      totalPrice.textContent = parseInt(
        originalPrice.textContent.replaceAll(",", "")
      ).toLocaleString("ko-KR");
    }
  });

  const access = async () => {
    if (!sessionStorage.getItem("encryptedAccess")) {
      return false;
    }
    const fpPromise = FingerprintJS.load();
    const result = await fpPromise.then((fp) => fp.get());
    const { screenResolution, ...components } = result.components;

    const visitorId = FingerprintJS.hashComponents(components);

    const decryptedAccess = CryptoJS.AES.decrypt(
      sessionStorage.getItem("encryptedAccess"),
      visitorId
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedAccess) {
      return false;
    } else {
      return decryptedAccess;
    }
  };

  const purchaseBtn = document.querySelector("button.purchase");
  const cartBtn = document.querySelector("button.cart");

  const LoginDialog = document.querySelector("dialog.login");
  const LoginNoBtns = document.querySelectorAll("dialog.login .modal-no");
  const LoginYesBtn = document.querySelector("dialog.login .modal-yes");

  function openLoginModal() {
    LoginDialog.showModal();
    document.body.style.overflow = "hidden";
  }

  LoginNoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      LoginDialog.close();
      document.body.style.overflow = "auto";
    });
  });

  LoginYesBtn.addEventListener("click", () => {
    location.href = "/login";
  });

  const CartDialog = document.querySelector("dialog.cart");
  const CartNoBtns = document.querySelectorAll("dialog.cart .modal-no");
  const CartYesBtn = document.querySelector("dialog.cart .modal-yes");

  function openCartModal() {
    CartDialog.showModal();
    document.body.style.overflow = "hidden";
  }

  CartNoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      CartDialog.close();
      document.body.style.overflow = "auto";
    });
  });

  CartYesBtn.addEventListener("click", () => {
    location.href = "/cart";
  });

  purchaseBtn.addEventListener("click", () => {
    openLoginModal();
  });

  cartBtn.addEventListener("click", async () => {
    const result = await access();
    if (result === false) {
      openLoginModal();
    } else {
      try {
        const data = {
          product_id: itemId,
          quantity: parseInt(input.value),
        };
        const req = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result}`,
          },
          body: JSON.stringify(data),
        };
        const res = await fetch(`${api}/cart/`, req);
        if (res.ok) {
          openCartModal();
        } else {
          alert("장바구니 담기에 실패했습니다.");
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
