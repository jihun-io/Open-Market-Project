import Header from "../components/header.js";
import Footer from "../components/footer.js";

export default function Details() {
  return /*html*/ `
    ${Header()}
    <main>
      <article class="product-info">
        <h2 class="sr-only">상품 정보</h2>
        <img
          src="/images/무릎담요-제품-소개1.png"
          alt="무릎 담요 상품 목업 이미지"
        />
        <div class="purchase">
          <div class="item-info">
            <p class="seller">백엔드글로벌</p>
            <p class="title">딥러닝 개발자 무릎 담요</p>
            <p class="price"><span>17,500</span>원</p>
          </div>
          <div class="buy-info">
            <p class="shipping">택배배송 / 무료배송</p>
            <div class="amount">
              <button>
                <img src="/images/icon-minus-line.svg" alt="빼기" />
              </button>
              <input type="number" value="1" step="1" />
              <button>
                <img src="/images/icon-plus-line.svg" alt="더하기" />
              </button>
            </div>
            <p class="total">
              <span class="total-text">총 상품 금액</span>
              <span class="total-amount">
                <span class="amount"
                  >총 수량 <span class="count">1</span>개</span
                ><span class="value"
                  ><span class="total-price">17,500</span>원</span
                >
              </span>
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
        <dialog>
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
  `;
}

export function detailsScript() {
  const plusBtn = document.querySelector(".amount button:last-child");
  const minusBtn = document.querySelector(".amount button:first-child");
  const input = document.querySelector(".amount input");
  const totalAmount = document.querySelector(".total-amount .count");
  const originalPrice = document.querySelector(".price span");
  const totalPrice = document.querySelector(".total-amount .total-price");

  plusBtn.addEventListener("click", () => {
    input.value = parseInt(input.value) + 1;
    totalAmount.textContent = input.value;
    totalPrice.textContent = (
      parseInt(originalPrice.textContent.replace(",", "")) * input.value
    ).toLocaleString("ko-KR");
  });

  minusBtn.addEventListener("click", () => {
    if (parseInt(input.value) > 1) {
      input.value = parseInt(input.value) - 1;
      totalAmount.textContent = input.value;
      totalPrice.textContent = (
        parseInt(originalPrice.textContent.replace(",", "")) * input.value
      ).toLocaleString("ko-KR");
    }
  });

  input.addEventListener("keyup", (event) => {
    input.value = parseInt(input.value);
    totalAmount.textContent = input.value;
    totalPrice.textContent = (
      parseInt(originalPrice.textContent.replace(",", "")) * input.value
    ).toLocaleString("ko-KR");
  });

  input.addEventListener("blur", () => {
    if (input.value === "" || input.value === "0") {
      input.value = 1;
      totalAmount.textContent = 1;
      totalPrice.textContent = parseInt(
        originalPrice.textContent.replace(",", "")
      ).toLocaleString("ko-KR");
    }
  });

  const dialog = document.querySelector("dialog");
  const purchaseBtn = document.querySelector("button.purchase");
  const cartBtn = document.querySelector("button.cart");
  const noBtns = document.querySelectorAll(".modal-no");
  const yesBtn = document.querySelector(".modal-yes");

  function openModal() {
    dialog.showModal();
    document.body.style.overflow = "hidden";
  }

  purchaseBtn.addEventListener("click", () => {
    openModal();
  });

  cartBtn.addEventListener("click", () => {
    openModal();
  });

  noBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      dialog.close();
      document.body.style.overflow = "auto";
    });
  });

  yesBtn.addEventListener("click", () => {
    location.href = "/login";
  });
}
