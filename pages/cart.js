import Header from "../components/header.js";
import Footer from "../components/footer.js";

let isLoaded = false;
let cartItems = {};
let api;

async function decryptingAccess() {
  const fpPromise = FingerprintJS.load();
  const result = await fpPromise.then((fp) => fp.get());
  const { screenResolution, ...components } = result.components;

  const visitorId = FingerprintJS.hashComponents(components);

  let decryptedAccess;
  try {
    decryptedAccess = CryptoJS.AES.decrypt(
      sessionStorage.getItem("encryptedAccess"),
      visitorId
    ).toString(CryptoJS.enc.Utf8);
  } catch (error) {
    if (error.toString() === "Error: Malformed UTF-8 data") {
      location.href = "/logout";
    }
  }

  if (!decryptedAccess) {
    location.href = "/logout";
    return;
  }

  return decryptedAccess;
}

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

async function getCartItems(API_URL) {
  if (!sessionStorage.getItem("encryptedAccess")) {
    location.href = "/logout";
    return;
  }

  const decryptedAccess = await decryptingAccess();

  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${decryptedAccess}`,
      },
    });
    const data = await res.json();
    console.log(data);
    if (data.detail === "Given token not valid for any token type") {
      location.href = "/logout";
      return;
    }

    cartItems = data;
  } catch (error) {
    console.log(error);
  }
  if (cartItems.count === 0) {
    return /*html*/ `
      <section>
        <h2>장바구니</h2>
        <p>장바구니에 담긴 상품이 없습니다.</p>
      </section>
      `;
  } else {
    isLoaded = true;

    return /*html*/ `
      <section>
        <h2>장바구니</h2>
        <table>
          <thead>
            <tr>
              <th>
                <input id="selectAll" type="checkbox" />
                <label for="selectAll"
                  ><span class="sr-only">전체 선택</span></label
                >
              </th>
              <th>상품정보</th>
              <th>수량</th>
              <th>상품금액</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems.results
              .map((item) => {
                return /*html*/ `
                <tr id="product${item.id}">
                  <td>
                    <input id="${item.id}" type="checkbox" />
                    <label for="${
                      item.id
                    }"><span class="sr-only">선택</span></label>
                  </td>
                  <td>
                    <img class="product-image" src="${
                      item.product.image
                    }" alt="상품이미지" />
                    <div>
                      <p class="seller">${item.product.seller.store_name}</p>
                      <p class="product-name">${item.product.name}</p>
                      <p class="price">${item.product.price.toLocaleString(
                        "ko-KR"
                      )}원</p>
                      <p class="shipping-method">${
                        item.product.shipping_method === "PARCEL"
                          ? "택배배송"
                          : "직접배송(화물배달)"
                      } / ${
                  item.product.shipping_fee === 0
                    ? "무료배송"
                    : "배송비 " +
                      item.product.shipping_fee.toLocaleString("ko-KR") +
                      "원"
                }</p>
                    </div>
                  </td>
                  <td>
                    <div class="amount-controller">
                      <button>${minusIcon()}</button>
                      <input type="number" value="${item.quantity}" readonly />
                      <button>${plusIcon()}</button>
                    </div>
                  </td>
                  <td>
                    <p class="total-price">${(
                      item.product.price * item.quantity
                    ).toLocaleString("ko-KR")}원</p>
                    <button class="purchase-item">주문하기</button>
                    <button class="delete"><img src="/images/icon-delete.svg" alt="상품 삭제" /></button>
                  </td>
                </tr>
              `;
              })
              .join("")}
          </tbody>
        </table>
        <summary>
          <div class="total">
            <p>총 상품금액</p>
            <p><span class="amount">0</span>원</p>
          </div>
          <img
            class="img-circle minus"
            src="/images/icon-minus-line.svg"
            alt="제외 금액"
          />
          <div class="discount">
            <p>상품 할인</p>
            <p><span class="amount">0</span>원</p>
          </div>
          <img
            class="img-circle plus"
            src="/images/icon-plus-line.svg"
            alt="추가 금액"
          />
          <div class="shipping">
            <p>배송비</p>
            <p><span class="amount">0</span>원</p>
          </div>
          <div class="total-price">
            <p>결제 예정 금액</p>
            <p><span class="amount">0</span>원</p>
          </div>
        </summary>
        <button class="purchase">주문하기</button>
      </section>`;
  }
}

export default async function Cart({ API_URL }) {
  api = API_URL;
  const cartItems = await getCartItems(api);
  return {
    title: "장바구니 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
    ${cartItems}
    
    </main>
    ${Footer()}
  `,
  };
}

export async function cartScripts() {
  if (isLoaded) {
    function getSummary() {
      // 서버와 추가로 통신하지 않고 클라이언트에서 가격을 계산하기 위해 table의 tr을 찾아서 계산

      let totalAmount = 0;
      let totalDiscount = 0;
      let totalShippingFee = 0;
      let totalPayment = 0;
      const cartTableItems = document.querySelectorAll("tbody tr");
      const checkedItems = document.querySelectorAll(
        "input[type='checkbox']:not(#selectAll):checked"
      );

      let checkedLists = [];

      checkedItems.forEach((item) => {
        checkedLists.push(item.id);
      });

      cartTableItems.forEach((item) => {
        const totalPrice = item.querySelector("p.total-price");

        totalPrice.textContent =
          (
            parseInt(
              item
                .querySelector("p.price")
                .textContent.replace(",", "")
                .replace("원", "")
            ) *
            parseInt(
              item.querySelector("div.amount-controller input[type='number']")
                .value
            )
          ).toLocaleString("ko-KR") + "원";

        totalAmount += parseInt(
          item
            .querySelector("p.total-price")
            .textContent.replace(",", "")
            .replace("원", "")
        );
        totalShippingFee += parseInt(
          item
            .querySelector(".shipping-method")
            .textContent.split("배송비 ")[1]
            .replace("원", "")
            .replace(",", "")
        );
      });

      totalPayment = totalAmount + totalShippingFee - totalDiscount;

      document.querySelector(".total .amount").textContent =
        totalAmount.toLocaleString("ko-KR");
      document.querySelector(".discount .amount").textContent =
        totalDiscount.toLocaleString("ko-KR");
      document.querySelector(".shipping .amount").textContent =
        totalShippingFee.toLocaleString("ko-KR");
      document.querySelector(".total-price .amount").textContent =
        totalPayment.toLocaleString("ko-KR");
    }

    const selectAllBtn = document.getElementById("selectAll");
    const checkboxes = document.querySelectorAll(
      "input[type='checkbox']:not(#selectAll)"
    );

    const purchaseEveryItemBtn = document.querySelector(".purchase");

    selectAllBtn.addEventListener("change", () => {
      checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAllBtn.checked;
      });
      if (!selectAllBtn.checked) {
        purchaseEveryItemBtn.disabled = true;
      }
      getSummary();
    });

    // 체크 박스 초기화
    selectAllBtn.checked = true;

    checkboxes.forEach((checkbox) => {
      // 체크 박스 초기화
      checkbox.checked = true;

      checkbox.addEventListener("change", () => {
        if (!checkbox.checked) {
          selectAllBtn.checked = false;
        }
        if (
          Array.from(checkboxes).every((checkbox) => checkbox.checked === true)
        ) {
          selectAllBtn.checked = true;
        }

        if (
          Array.from(checkboxes).every((checkbox) => checkbox.checked === false)
        ) {
          purchaseEveryItemBtn.disabled = true;
        }
        getSummary();
      });
    });

    const amountControllers = document.querySelectorAll(".amount-controller");

    async function updateCart(productId, value) {
      const decryptedAccess = await decryptingAccess();

      let intValue = parseInt(value);

      try {
        const res = await fetch(`${api}/cart/${productId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${decryptedAccess}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: intValue,
          }),
        });
        const data = await res.json();
        if (data.detail === "Given token not valid for any token type") {
          location.href = "/logout";
          return;
        }

        if (res.status === 200) {
          return data.quantity;
        }
        if (
          data.quantity.toString() ===
          "재고가 부족하여 수량을 수정할 수 없습니다."
        ) {
          alert("재고가 부족하여 수량을 수정할 수 없습니다.");
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function deleteItems(productId) {
      const decryptedAccess = await decryptingAccess();
      try {
        const res = await fetch(`${api}/cart/${productId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${decryptedAccess}`,
          },
        });
        if (res.ok) {
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    }

    amountControllers.forEach((amountController) => {
      const productId = amountController.parentElement.parentElement.id.replace(
        "product",
        ""
      );
      const input = amountController.querySelector("input");
      const plusBtn = amountController.querySelector("button:last-child");
      const minusBtn = amountController.querySelector("button:first-child");

      const deleteBtn =
        amountController.parentElement.parentElement.querySelector(
          "button.delete"
        );

      plusBtn.addEventListener("click", async () => {
        const result = await updateCart(productId, parseInt(input.value) + 1);
        if (result) {
          input.value = result;
        }
        getSummary();
      });

      minusBtn.addEventListener("click", async () => {
        if (parseInt(input.value) > 1) {
          const result = await updateCart(productId, parseInt(input.value) - 1);
          if (result) {
            input.value = result;
          }
          getSummary();
        }
      });

      deleteBtn.addEventListener("click", async () => {
        deleteItems(productId);
      });
    });

    getSummary();
  }
}
