import SellerHeader from "../components/sellerHeader.js";
import DecryptingAccess from "../scripts/decryptingAccess.js";

let api;

let title = "상품 등록";

let productData = {
  id: -1,
  name: "",
  price: 0,
  stock: 0,
  shipping_method: { isParcel: "", isDelivery: "" },
  shipping_fee: 0,
  desc: "",
  image: "",
};

let imgSrc = "";

export default function ProductAdd({ API_URL }) {
  api = API_URL;

  if (localStorage.getItem("user_type") !== "SELLER") {
    location.href = "/";
  }

  if (sessionStorage.getItem("modifyProduct")) {
    const product = JSON.parse(sessionStorage.getItem("modifyProduct"));

    productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      shipping_method: {
        isParcel: product.shipping_method === "PARCEL" ? "checked" : "",
        isDelivery: product.shipping_method === "DELIVERY" ? "checked" : "",
      },
      shipping_fee: product.shipping_fee,
      desc: product.info,
      image: product.image,
    };

    title = "상품 수정";
  }

  return {
    title: `${title} - HODU`,
    content: /*html*/ `
    ${SellerHeader()}
    <main>
      <h2>${title}</h2>
      <aside>
        <h3>상품 등록 주의사항</h3>
        <ul>
          <li>너무 귀여운 사진은 심장이 아파올 수 있습니다.</li>
          <li>
            유소년에게서 천자만홍이 피고 이상이 온갖 들어 약동하다. 이상의
            가지에 사랑의 있는가? 주며, 끓는 힘차게 얼음이 얼음 가치를
            황금시대의 있음으로써 사라지지 것이다. 이 뜨거운지라, 이상의 속에서
            이것은 피가 보배를 황금시대의 싹이 사막이다.
          </li>
          <li>
            자신과 우는 옷을 지혜는 아니다. 더운지라 설레는 기쁘며, 위하여서,
            평화스러운 광야에서 그리하였는가? 소담스러운 위하여 인도하겠다는
            어디 무엇을 이상을 같지 따뜻한 청춘 칼이다.
          </li>
          <li>
            가치를 그들을 예수는 찬미를 가슴이 과실이 이것이다. 희망의
            것이다.보라, 풍부하게 이것은 황금시대를 얼마나 인간에 돋고,
            이것이다.
          </li>
        </ul>
      </aside>
      <section class="product-add">
        <h3 class="sr-only">상품 정보</h3>
        <form id="${productData.id}">
          <fieldset class="img">
            <label>상품 이미지</label>
            <input type="file" name="image" id="image" accept=".jpg, .jpeg, .png" />
            <label for="image" tabindex=0 ${
              productData.image
                ? "class='uploaded' style='background-image: url(" +
                  productData.image +
                  ")'"
                : ""
            }></label>
            <p class="msg-image">이미지를 첨부해주세요.</p>
          </fieldset>
          <fieldset class="info">
            <label for="name">상품명</label>
            <div class="input-wrapper title">
              <input required type="text" name="name" id="name" maxlength="20" value="${
                productData.name
              }" />
              <p class="characters-limits">${productData.name.length}/20</p>
              </div>
              <p class="msg-name">상품명을 입력해주세요.</p>
            <label for="price">판매가</label>
            <div class="input-wrapper">
              <input required type="text" name="price" id="price" inputmode="numeric" value="${productData.price.toLocaleString(
                "ko-KR"
              )}"/>
              <div class="unit-wrapper">
                <p class="unit">원</p>
              </div>
              </div>
              <p class="msg-price">판매가를 입력해주세요.</p>
            <label for="shipping">배송방법</label>
            <ul class="shipping-radio">
              <li>
                <input type="radio" name="shipping" id="parsel" ${
                  productData.shipping_method.isParcel
                } />
                <label for="parsel" tabindex=0>택배, 소포, 등기</label>
              </li>
              <li>
                <input type="radio" name="shipping" id="delivery" ${
                  productData.shipping_method.isDelivery
                } />
                <label for="delivery" tabindex=0>직접배송(화물배달)</label>
              </li>
            </ul>
            <p class="msg-shipping-method">배송방법을 선택해주세요.</p>
            <label for="shipping-fee">기본 배송비</label>
            <div class="input-wrapper">
              <input required type="text" name="shipping-fee" id="shipping-fee" inputmode="numeric" value="${productData.shipping_fee.toLocaleString(
                "ko-KR"
              )}"/>
              <div class="unit-wrapper">
                <p class="unit">원</p>
              </div>
              </div>
              <p class="msg-shipping-fee">배송비를 입력해주세요.</p>
            <label for="stock">재고</label>
            <div class="input-wrapper">
              <input required type="text" name="stock" id="stock" inputmode="numeric" value="${productData.stock.toLocaleString(
                "ko-KR"
              )}"/>
              <div class="unit-wrapper">
                <p class="unit">개</p>
              </div>
              </div>
              <p class="msg-stock">재고를 입력해주세요.</p>
          </fieldset>
          <fieldset class="description">
            <label for="desc">상품 상세 정보</label>
            <textarea name="desc" id="desc">${productData.desc}</textarea>
            <p class="msg-desc">상품 상세 정보를 입력해주세요.</p>
          </fieldset>
          <ul class="btns">
            <li><a href="/seller" class="cancel">취소</a></li>
            <li><button type="submit" class="save">저장하기</button></li>
          </ul>
        </form>
      </section>
    </main>
    `,
  };
}

export async function productEvents() {
  const imgInput = document.querySelector("input#image");
  const imgLabel = document.querySelector("label[for=image]");

  imgInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imgLabel.classList.add("uploaded");
      imgLabel.style.backgroundImage = `url(${e.target.result})`;
      imgSrc = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const productName = document.querySelector("input#name");
  const productNameLength = document.querySelector("p.characters-limits");

  productName.addEventListener("input", (e) => {
    productNameLength.textContent = `${productName.value.length}/20`;
  });

  const shippingLabels = document.querySelectorAll(
    "label[for=parsel], label[for=delivery]"
  );

  shippingLabels.forEach((label) => {
    label.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        label.previousElementSibling.click();
      }
    });
  });

  const inputPrice = document.querySelector("input#price");
  const inputShippingFee = document.querySelector("input#shipping-fee");
  const inputStock = document.querySelector("input#stock");
  const inputNums = [inputPrice, inputShippingFee, inputStock];
  inputNums.forEach((input) => {
    input.addEventListener("input", (e) => {
      let value = input.value.replace(/[^0-9]/g, "");
      input.value = new Intl.NumberFormat("ko-KR").format(value);
    });
  });
  // Validation 스크립트
  let isValid = {
    falseList: [],
  };
  function validation() {
    isValid.falseList = [];
    document.querySelectorAll(".invalid").forEach((el) => {
      el.classList.remove("invalid");
    });
    if (!imgSrc) {
      isValid.falseList.push(imgInput.parentElement);
      document.querySelector("p.msg-image").classList.add("invalid");
    }
    if (productName.value.length === 0) {
      isValid.falseList.push(productName.parentElement);
      document.querySelector("p.msg-name").classList.add("invalid");
    }
    if (inputPrice.value === "0") {
      isValid.falseList.push(inputPrice.parentElement);
      document.querySelector("p.msg-price").classList.add("invalid");
    }
    if (inputShippingFee.value === "0") {
      isValid.falseList.push(inputShippingFee.parentElement);
      document.querySelector("p.msg-shipping-fee").classList.add("invalid");
    }
    if (inputStock.value === "0") {
      isValid.falseList.push(inputStock.parentElement);
      document.querySelector("p.msg-stock").classList.add("invalid");
    }
    if (document.querySelector("input[name=shipping]:checked") === null) {
      isValid.falseList.push(
        document.querySelector("input[name=shipping]").parentElement
          .parentElement
      );
      document.querySelector("p.msg-shipping-method").classList.add("invalid");
    }
    if (document.querySelector("textarea#desc").value.length === 0) {
      isValid.falseList.push(document.querySelector("textarea#desc"));
      document.querySelector("p.msg-desc").classList.add("invalid");
    }
    const inputs = document.querySelectorAll("input, textarea, label");
    inputs.forEach((input) => {
      input.addEventListener("change", (e) => {
        if (e.target.parentElement.classList.contains("input-wrapper")) {
          e.target.parentElement.classList.remove("invalid");
          e.target.parentElement.nextElementSibling.classList.remove("invalid");
        } else if (e.target.parentElement.classList.contains("img")) {
          e.target.parentElement.classList.remove("invalid");
          e.target.parentElement
            .querySelector("p.invalid")
            .classList.remove("invalid");
        } else if (e.target.parentElement.tagName === "LI") {
          e.target.parentElement.parentElement.classList.remove("invalid");
          e.target.parentElement.parentElement.nextElementSibling.classList.remove(
            "invalid"
          );
        } else {
          e.target.classList.remove("invalid");
          e.target.nextElementSibling.classList.remove("invalid");
        }
      });
    });
    if (isValid.falseList.length > 0) {
      isValid.falseList.forEach((el) => {
        el.classList.add("invalid");
      });
      window.scrollTo({
        top: isValid.falseList[0].offsetTop,
        behavior: "smooth",
      });
      return false;
    } else {
      return true;
    }
  }

  // Form 제출 스크립트
  const decryptedAccess = await DecryptingAccess(
    sessionStorage.getItem("encryptedAccess")
  );

  document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    formData.append(
      "price",
      parseInt(formData.get("price").replace(/[^0-9]/g, ""))
    );
    formData.append(
      "shipping_fee",
      parseInt(formData.get("shipping-fee").replace(/[^0-9]/g, ""))
    );
    formData.append(
      "stock",
      parseInt(formData.get("stock").replace(/[^0-9]/g, ""))
    );

    formData.append("info", formData.get("desc"));

    let shipping_method;
    if (document.querySelector("input#parsel").checked) {
      shipping_method = "PARCEL";
    } else if (document.querySelector("input#delivery").checked) {
      shipping_method = "DELIVERY";
    }
    formData.append("shipping_method", shipping_method);

    let url = `${api}/products/`;

    let method;
    if (productData.id === -1) {
      method = "POST";
    } else {
      method = "PUT";
      url += `${productData.id}/`;
      if (formData.get("image").size === 0) {
        formData.delete("image");
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${decryptedAccess}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      alert("성공적으로 상품이 등록되었습니다!");
      location.href = `/items/${data.id}`;
    } catch (error) {
      console.error("Error:", error);
      alert("상품 등록 중 문제가 발생했습니다.");
    }
  });
}
