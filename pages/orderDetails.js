import Header from "../components/header.js";
import Footer from "../components/footer.js";

import DecryptingAccess from "../scripts/decryptingAccess.js";

let api;
let orderId;

let totalPrice;
let totalShipping;
let totalDiscount;
let totalAmount;

async function getOrder() {
  const decryptedAccess = await DecryptingAccess(
    sessionStorage.getItem("encryptedAccess")
  );

  const url = `${api}/order/${orderId}/`;
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
    alert("주문 정보를 불러오는 중 문제가 발생했습니다.");
    location.href = "/";
  }
}

async function getItemData(API_URL, productId) {
  const res = await fetch(`${API_URL}/products/${productId}`);
  const data = await res.json();
  return data;
}

async function orderTable(orderData) {
  const order = orderData.order_items;
  if (!order) {
    location.href = "/mypage";
  }

  let itemDatas = [];

  for (let i = 0; i < order.length; i++) {
    const itemData = await getItemData(api, order[i].product.id);
    itemDatas.push(itemData);
  }

  const tbody = order
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
          <p class="amount">수량 :&nbsp; <span>${
            product.ordered_quantity
          }</span>개</p>
        </div>
      </td>
      <td>-</td>
      <td>${
        product.ordered_shipping_fee === 0
          ? "-"
          : product.ordered_shipping_fee.toLocaleString("ko-KR")
      }원</td>
      <td>${product.ordered_unit_price.toLocaleString("ko-KR") + "원"}</td>
    </tr>
    `;
    })
    .join("");

  totalPrice = order.reduce((acc, cur) => {
    return acc + cur.ordered_unit_price;
  }, 0);

  totalDiscount = 0;

  totalShipping = order.reduce((acc, cur) => {
    return acc + cur.ordered_shipping_fee;
  }, 0);

  totalAmount = totalPrice + totalShipping - totalDiscount;

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
      ><span>${totalAmount.toLocaleString("ko-KR")}원</span>
    </p>
  </summary>
  `;
}

async function getShipping(orderData) {
  function phoneNumberSlice(phoneNumber, area) {
    switch (area) {
      case "area":
        if (phoneNumber.length === 9) {
          return phoneNumber.slice(0, 2);
        } else {
          return phoneNumber.slice(0, 3);
        }
      case "mid":
        if (phoneNumber.length === 9) {
          return phoneNumber.slice(2, 5);
        } else if (phoneNumber.length === 10) {
          return phoneNumber.slice(3, 6);
        } else {
          return phoneNumber.slice(3, 7);
        }
      case "end":
        if (phoneNumber.length === 9) {
          return phoneNumber.slice(5, 9);
        } else if (phoneNumber.length === 10) {
          return phoneNumber.slice(6, 10);
        } else {
          return phoneNumber.slice(7, 11);
        }
    }
  }

  let paymentMethod = {
    card: "",
    deposit: "",
    phone: "",
    naverpay: "",
    kakaopay: "",
  };

  paymentMethod[orderData.payment_method] = "checked";

  return /*html*/ `
  <article class="shipping-info">
    <form  method="post">
      <h3>배송정보</h3>
      <fieldset>
        <h4>배송지 정보</h4>
        <div class="form-row">
          <label for="receiver">수령인</label>
          <input readonly type="text" name="receiver" id="receiver" value="${
            orderData.receiver
          }" />
        </div>
        <div class="form-row">
          <label for="receiver-phone-area">휴대폰</label>
          <div class="form-phone">
            <input readonly
              type="tel"
              name="receiver-phone-area"
              id="receiver-phone-area"
              minlength="2"
              maxlength="3"
              value="${phoneNumberSlice(
                orderData.receiver_phone_number,
                "area"
              )}"
            />
            <span>-</span>
            <input readonly
              type="tel"
              name="receiver-phone-mid"
              id="receiver-phone-mid"
              minlength="3"
              maxlength="4"
              value="${phoneNumberSlice(
                orderData.receiver_phone_number,
                "mid"
              )}"

            />
            <span>-</span>
            <input readonly
              type="tel"
              name="receiver-phone-end"
              id="receiver-phone-end"
              minlength="4"
              maxlength="4"
              value="${phoneNumberSlice(
                orderData.receiver_phone_number,
                "end"
              )}"

            />
          </div>
        </div>
        <div class="form-row">
          <label for="address">배송주소</label>
          <div class="form-address">
            <input readonly id="address1" type="text" name="address1" value="${
              orderData.address
            }" />
          </div>
        </div>
        <div class="form-row">
          <label for="message">배송 메시지</label>
          <input readonly type="text" name="message" id="message" value="${
            !!orderData.delivery_message ? orderData.delivery_message : ""
          }"/>
        </div>
      </fieldset>
      <div class="purchase-layout">
        <fieldset class="purchase-method">
          <h4>결제수단</h4>
          <ul class="payment-method">
            <li>
              <input type="radio" disabled ${
                paymentMethod["card"]
              } name="payment" id="card" value="card" />
              <label tabindex=0 for="card">신용/체크카드</label>
            </li>
            <li>
              <input type="radio" disabled ${
                paymentMethod["deposit"]
              } name="payment" id="deposit" value="deposit" />
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
              <input type="radio" disabled ${
                paymentMethod["naverpay"]
              } name="payment" id="naverpay" value="naverpay" />
              <label tabindex=0 for="naverpay">네이버페이</label>
            </li>
            <li>
              <input type="radio" disabled ${
                paymentMethod["kakaopay"]
              } name="payment" id="kakaopay" value="kakaopay" />
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
                <p><span>${totalPrice.toLocaleString("ko-KR")}</span>원</p>
              </li>
              <li>
                <p>할인금액</p>
                <p><span>${totalDiscount.toLocaleString("ko-KR")}</span>원</p>
              </li>
              <li>
                <p>배송비</p>
                <p><span>${totalShipping.toLocaleString("ko-KR")}</span>원</p>
              </li>
              <li>
                <p>결제금액</p>
                <p><span>${totalAmount.toLocaleString("ko-KR")}</span>원</p>
              </li>
            </ul>
          </div>
        </fieldset>
        ${
          orderData.order_status === "cancelled"
            ? `<button disabled class="purchase-cancel">주문 취소됨</button>`
            : `<button class="purchase-cancel">주문 취소</button>`
        }
        
      </div>
    </form>
  </article>
  `;
}

export default async function OrderDetails({ API_URL, params }) {
  api = API_URL;
  orderId = params.id;
  const orderData = await getOrder();

  return {
    title: "주문 상세 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
      <section>
        <h2>주문 상세</h2>
        <article class="purchased-items">
          ${await orderTable(orderData)}
          ${await getShipping(orderData)}
        </article>
      </section>
    </main>
    ${Footer()}
    `,
  };
}

export async function orderCancel() {
  const cancelBtn = document.querySelector(".purchase-cancel");

  cancelBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const decryptedAccess = await DecryptingAccess(
      sessionStorage.getItem("encryptedAccess")
    );

    const url = `${api}/order/${orderId}/`;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${decryptedAccess}`,
        },
      });
      if (!res.ok) {
        console.error(res);
        location.href = "/logout";
      } else {
        const data = await res.json();
        if (data.detail === "주문이 성공적으로 취소되었습니다.") {
          alert("주문이 성공적으로 취소되었습니다.");
          location.href = "/mypage/order";
        } else {
          alert("주문 취소 중 문제가 발생했습니다.");
          location.href = "/mypage/order";
        }
      }
    } catch (error) {
      console.error(error);
      alert("주문 취소 중 문제가 발생했습니다.");
      location.href = "/mypage/order";
    }
  });
}
