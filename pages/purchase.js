import Header from "../components/header.js";
import Footer from "../components/footer.js";

import DecryptingAccess from "../scripts/decryptingAccess.js";

let api;

let orderType;
let orderItems = [];
let quantity = 1;

let totalPrice = 0;
let totalDiscount = 0;
let totalShipping = 0;
let totalAmount = 0;

async function getItemData(API_URL, cartItemId) {
  const res = await fetch(`${API_URL}/products/${cartItemId}`);
  const data = await res.json();
  return data;
}

async function cartTable() {
  const order = JSON.parse(sessionStorage.getItem("order"));

  if (!order) {
    location.href = "/cart";
  }

  orderType = order.orderType;

  let itemDatas = [];

  for (let i = 0; i < order.products.length; i++) {
    orderItems.push(order.products[i].cartItemId);
    if (order.products.length === 1) {
      quantity = order.products[i].quantity;
    }
    const itemData = await getItemData(api, order.products[i].cartItemId);
    itemDatas.push(itemData);
  }

  const tbody = order.products
    .map((product, index) => {
      return /*html*/ `
    <tr>
      <td>
        <img
          src="${itemDatas[index].image}"
          alt="${itemDatas[index].name}"
        />
        <div>
          <p class="seller">${itemDatas[index].seller.store_name}</p>
          <p class="product-name">${itemDatas[index].name}</p>
          <p class="amount">수량 :&nbsp; <span>${product.quantity}</span>개</p>
        </div>
      </td>
      <td>${
        product.discount === 0
          ? "-"
          : product.discount.toLocaleString("ko-KR") + "원"
      }</td>
      <td>${
        product.shippingFee === 0
          ? "-"
          : product.shippingFee.toLocaleString("ko-KR")
      }원</td>
      <td>${product.price.toLocaleString("ko-KR") + "원"}</td>
    </tr>
    `;
    })
    .join("");

  const summary = order.products.reduce((acc, cur) => {
    return acc + cur.price;
  }, 0);

  totalPrice = summary;
  totalShipping = order.products.reduce((acc, cur) => {
    return acc + cur.shippingFee;
  }, 0);
  totalDiscount = order.products.reduce((acc, cur) => {
    return acc + cur.discount;
  }, 0);
  totalAmount = summary + totalShipping - totalDiscount;

  return /*html*/ `
  <table>
    <thead>
      <tr>
        <th>상품정보</th>
        <th>할인</th>
        <th>배송비</th>
        <th>주문금액</th>
      </tr>
    </thead>
    <tbody>
      ${tbody}
    </tbody>
  </table>
  <summary>
    <p>
      총 주문금액<span class="sr-only">:&nbsp;</span
      ><span>${summary.toLocaleString("ko-KR")}원</span>
    </p>
  </summary>
  `;
}

export default async function Purchase({ API_URL }) {
  api = API_URL;
  return {
    title: "구매하기 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
      <section>
        <h2>주문/결제하기</h2>
        <article class="purchase-items">
          <h3 class="sr-only">결제 상품 정보</h3>
          ${await cartTable()}
        </article>
        <article class="shipping-info">
          <form  method="post">
            <h3>배송정보</h3>
            <fieldset>
              <h4>주문자 정보</h4>
              <div class="form-row">
                <label for="name">이름</label>
                <input required type="text" name="name" id="name" />
              </div>
              <div class="form-row">
                <label for="order-phone-area">휴대폰</label>
                <div class="form-phone">
                  <input required
                    type="tel"
                    name="order-phone-area"
                    id="order-phone-area"
                    minlength="2"
                    maxlength="3"
                  />
                  <span>-</span>
                  <input required
                    type="tel"
                    name="order-phone-mid"
                    id="order-phone-mid"
                    minlength="3"
                    maxlength="4"
                  />
                  <span>-</span>
                  <input required
                    type="tel"
                    name="order-phone-end"
                    id="order-phone-end"
                    minlength="4"
                    maxlength="4"
                  />
                </div>
              </div>
              <div class="form-row">
                <label for="email">이메일</label>
                <input required type="email" name="email" id="email" />
              </div>
            </fieldset>
            <fieldset>
              <h4>배송지 정보</h4>
              <div class="form-row">
                <label for="receiver">수령인</label>
                <input required type="text" name="receiver" id="receiver" />
              </div>
              <div class="form-row">
                <label for="receiver-phone-area">휴대폰</label>
                <div class="form-phone">
                  <input required
                    type="tel"
                    name="receiver-phone-area"
                    id="receiver-phone-area"
                    minlength="2"
                    maxlength="3"
                  />
                  <span>-</span>
                  <input required
                    type="tel"
                    name="receiver-phone-mid"
                    id="receiver-phone-mid"
                    minlength="3"
                    maxlength="4"
                  />
                  <span>-</span>
                  <input required
                    type="tel"
                    name="receiver-phone-end"
                    id="receiver-phone-end"
                    minlength="4"
                    maxlength="4"
                  />
                </div>
              </div>
              <div class="form-row">
                <label for="address">배송주소</label>
                <div class="form-address">
                  <div class="form-address-row">
                    <input required type="text" name="post-id" id="post-id" readonly />
                    <button id="post-btn">우편번호 조회</button>
                  </div>
                  <input required id="address1" type="text" name="address1" readonly />
                  <input required id="address2" type="text" name="address2" />
                </div>
              </div>
              <div class="form-row">
                <label for="message">배송 메시지</label>
                <input type="text" name="message" id="message" />
              </div>
            </fieldset>
            <div class="purchase-layout">
              <fieldset class="purchase-method">
                <h4>결제수단</h4>
                <ul class="payment-method">
                  <li>
                    <input type="radio" name="payment" id="card" value="card" />
                    <label tabindex=0 for="card">신용/체크카드</label>
                  </li>
                  <li>
                    <input type="radio" name="payment" id="deposit" value="deposit" />
                    <label tabindex=0 for="deposit">무통장 입금</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="payment"
                      id="phone"
                      value="phone"
                    />
                    <label tabindex=0 for="phone">휴대폰 결제</label>
                  </li>
                  <li>
                    <input type="radio" name="payment" id="naverpay" value="naverpay" />
                    <label tabindex=0 for="naverpay">네이버페이</label>
                  </li>
                  <li>
                    <input type="radio" name="payment" id="kakaopay" value="kakaopay" />
                    <label tabindex=0 for="kakaopay">카카오페이</label>
                  </li>
                </ul>
              </fieldset>
              <fieldset class="purchase-info">
                <h4>최종결제 정보</h4>
                <div class="final-payment">
                  <ul>
                    <li>
                      <p>상품금액</p>
                      <p><span>${totalPrice.toLocaleString(
                        "ko-KR"
                      )}</span>원</p>
                    </li>
                    <li>
                      <p>할인금액</p>
                      <p><span>${totalDiscount.toLocaleString(
                        "ko-KR"
                      )}</span>원</p>
                    </li>
                    <li>
                      <p>배송비</p>
                      <p><span>${totalShipping.toLocaleString(
                        "ko-KR"
                      )}</span>원</p>
                    </li>
                    <li>
                      <p>결제금액</p>
                      <p><span>${totalAmount.toLocaleString(
                        "ko-KR"
                      )}</span>원</p>
                    </li>
                  </ul>
                  <div class="purchase-btn-wrapper">
                    <input type="checkbox" name="agree" id="agree" />
                    <label tabindex=0 for="agree"
                      >주문 내용을 확인하였으며, 정보 제공 등에
                      동의합니다.</label
                    >
                    <button type="submit" disabled>결제하기</button>
                  </div>
                </div>
              </fieldset>
            </div>
          </form>
        </article>
      </section>
    </main>
    <dialog>
    </dialog>
    ${Footer()}
  `,
  };
}

export async function purchaseScripts() {
  // 우편번호 검색 모달 스크립트
  const postBtn = document.getElementById("post-btn");
  const postInput = document.getElementById("post-id");
  const address1 = document.getElementById("address1");
  const address2 = document.getElementById("address2");

  const postModal = document.querySelector("dialog");

  // 커스텀 체크박스와 라디오 버튼의 접근성 향상
  const labels = document.querySelectorAll("label");
  labels.forEach((label) => {
    label.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        label.click();
      }
    });
  });

  postBtn.addEventListener("click", (e) => {
    e.preventDefault();

    new daum.Postcode({
      oncomplete: function (data) {
        postInput.value = data.zonecode;
        address1.value = data.address;
        address2.focus();
        postModal.close();
      },
      width: "100%",
      height: "100%",
    }).embed(postModal);

    postModal.showModal();

    // 모달 창 밖을 클릭했을 때 모달 창 닫기
    postModal.addEventListener("click", (e) => {
      if (e.target === postModal) {
        postModal.close();
      }
    });
  });

  // Validation 스크립트
  const inputs = document.querySelectorAll("input");
  const inputRequireds = document.querySelectorAll("input[required]");
  const submitBtn = document.querySelector("button[type='submit']");

  const agree = document.getElementById("agree");

  let isValidated = false;
  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      let validateList = [];
      const chosenPayment = document.querySelector(
        "input[name='payment']:checked"
      );
      inputRequireds.forEach((inputRequired) => {
        if (inputRequired.value === "") {
          validateList.push(false);
        } else {
          validateList.push(true);
        }
      });

      if (validateList.includes(false)) {
        isValidated = false;
      } else {
        isValidated = true;
      }

      if (isValidated && agree.checked && chosenPayment) {
        submitBtn.removeAttribute("disabled");
      } else {
        submitBtn.setAttribute("disabled", true);
      }
    });
  });

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let data;
    if (orderType === "cart_order") {
      data = {
        order_type: "cart_order",
        cart_items: orderItems,
        total_price: totalAmount,
        receiver: document.getElementById("receiver").value,
        receiver_phone_number: `${
          document.getElementById("receiver-phone-area").value
        }${document.getElementById("receiver-phone-mid").value}${
          document.getElementById("receiver-phone-end").value
        }`,
        address: `${document.getElementById("address1").value} ${
          document.getElementById("address2").value
        }`,
        address_message: document.getElementById("message").value,
        payment_method: document.querySelector("input[name='payment']:checked")
          .value,
      };
    } else if (orderType === "direct_order") {
      data = {
        order_type: "direct_order",
        product: orderItems[0],
        quantity: quantity,
        total_price: totalAmount,
        receiver: document.getElementById("receiver").value,
        receiver_phone_number: `${
          document.getElementById("receiver-phone-area").value
        }${document.getElementById("receiver-phone-mid").value}${
          document.getElementById("receiver-phone-end").value
        }`,
        address: `${document.getElementById("address1").value} ${
          document.getElementById("address2").value
        }`,
        address_message: document.getElementById("message").value,
        payment_method: document.querySelector("input[name='payment']:checked")
          .value,
      };
    }

    const decryptedAccess = await DecryptingAccess(
      sessionStorage.getItem("encryptedAccess")
    );

    const req = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${decryptedAccess}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const res = await fetch(`${api}/order/`, req);
      if (res.ok) {
        const result = await res.json();
        if (result.order_status === "payment_complete") {
          alert("주문이 완료되었습니다!\n주문 목록 페이지로 이동합니다.");
          location.href = "/mypage/order";
        }
      } else {
        console.error("주문 실패");
        alert("주문 과정에서 문제가 발생했습니다.");
      }
    } catch (error) {
      console.log(error);
    }

    console.log(data);
  });
}
