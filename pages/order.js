import Header from "../components/header.js";
import Footer from "../components/footer.js";

import DecryptingAccess from "../scripts/decryptingAccess.js";

let api;

async function getOrders() {
  const decryptedAccess = await DecryptingAccess(
    sessionStorage.getItem("encryptedAccess")
  );

  const url = `${api}/order/`;
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
      return data.results;
    }
  } catch (error) {
    console.error(error);
    location.href = "/logout";
  }
}

function getDateString(date) {
  const dateObj = new Date(date);

  return `${dateObj.getFullYear()}. ${
    dateObj.getMonth() + 1
  }. ${dateObj.getDate()}. ${
    (dateObj.getHours() < 9 ? "0" : "") + dateObj.getHours()
  }:${dateObj.getMinutes()}`;
}

function orderLists(orders) {
  const orderStatus = {
    payment_pending: "결제 진행 중",
    payment_complete: "결제 완료",
    preparing: "상품 준비 중",
    shipping: "배송 중",
    delivered: "배송 완료",
    cancled: "취소",
  };

  return orders
    .map((order) => {
      const orderStatusString = orderStatus[order.order_status];

      return /*html*/ `
        <tr>
          <td class="product-info">
            <img src="${order.order_items[0].product.image}" alt="" />
            <div>
              <p class="order-number">${order.order_number}</p>
              <p class="order-name">${order.order_items[0].product.name}${
        order.order_items.length > 1
          ? " 등 " + order.order_items.length + "개"
          : ""
      }</p>
      <p class="order-date">${getDateString(order.created_at)}</p>
            </div>
          </td>
          <td class="order-status">${orderStatusString}</td>
          <td class="order-price"><p>${order.total_price.toLocaleString(
            "ko-KR"
          )}원</p><a href="/mypage/order/${order.id}">상세 보기</a></td>
        </tr>
        `;
    })
    .join("");
}

export default async function Order({ API_URL }) {
  api = API_URL;

  console.log(await getOrders());

  if (!sessionStorage.getItem("encryptedAccess")) {
    location.href = "/login";
  }

  return {
    title: "주문 목록 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
      <section>
        <h2>주문 목록</h2>
        <table>
          <thead>
            <tr>
              <th>상품정보</th>
              <th>주문상태</th>
              <th>상품금액</th>
            </tr>
          </thead>
          <tbody>
          ${orderLists(await getOrders())}
          </tbody>
        </table>
      </section>
    </main>
    ${Footer()}
  `,
  };
}
