function loginBtn() {
  return /*html*/ `
  <li>
  <a href="/cart">
    <img src="/images/icon-shopping-cart.svg" alt="" />
    장바구니
  </a>
  </li>
  <li>
    <a class="login-btn" href="/login">
      <img src="/images/icon-user.svg" alt="" />
      로그인
    </a>
  </li>
  `;
}

function myPageBtn() {
  return /*html*/ `
  <li>
    <a href="/cart">
      <img src="/images/icon-shopping-cart.svg" alt="" />
      장바구니
    </a>
  </li>
  <li>
    <button class="my-page-btn">
      <img src="/images/icon-user.svg" alt="" />
      마이페이지
    </button>
    <ul class="dropdown">
      <img src="/images/Union.svg" alt="" />
      <li><a href="/mypage">마이페이지</a></li>
      <li><a href="/logout">로그아웃</a></li>
    </ul>
  </li>
  `;
}

function sellerBtn() {
  return /*html*/ `
  <li class="seller-left">
    <button class="my-page-btn">
      <img src="/images/icon-user.svg" alt="" />
      마이페이지
    </button>
    <ul class="dropdown">
      <img src="/images/Union.svg" alt="" />
      <li><a href="/mypage">마이페이지</a></li>
      <li><a href="/logout">로그아웃</a></li>
    </ul>
  </li>
  <li class="seller-right">
    <a class="seller-btn" href="/seller">
      <img src="/images/icon-shopping-bag.svg" alt="" />
      <span>판매자 센터</span>
    </a>
  </li>
  `;
}

export default function Header() {
  return /*html*/ `
    <header>
      <div class="header-left">
        <h1>
          <a href="/">
            <img src="/images/Logo-hodu.png" alt="HODU" />
          </a>
        </h1>
        <form action="/search">
          <input
            type="text"
            name="query"
            id="query"
            placeholder="상품을 검색해보세요!"
          />
          <button class="search-btn">
            <img src="/images/icon-search.svg " alt="검색" />
          </button>
        </form>
        <form class="mobile" action="/search">
          <input
            type="text"
            name="query"
            id="query"
            disabled
          />
          <button class="search-btn">
            <img src="/images/icon-search.svg " alt="검색" />
          </button>
        </form>
      </div>
      <nav class="header-right">
        <ul>
          ${
            !localStorage.getItem("encryptedRefresh")
              ? loginBtn()
              : localStorage.getItem("user_type") === "SELLER"
              ? sellerBtn()
              : myPageBtn()
          }
        </ul>
      </nav>
    </header>
  `;
}

export function headerBtns() {
  // route-login 혹은 route-join 페이지가 아닐 경우
  if (
    !window.location.pathname.includes("login") &&
    !window.location.pathname.includes("join")
  ) {
    const mobileSearchForm = document.querySelector("form.mobile");
    const mobileSearchInput = document.querySelector("form.mobile input");
    const mobileSearchBtn = document.querySelector(".mobile button.search-btn");

    let isFold = false;
    mobileSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!!isFold) {
        mobileSearchForm.submit();
      } else {
        mobileSearchForm.classList.add("active");
        mobileSearchInput.removeAttribute("disabled");
        mobileSearchInput.focus();
        isFold = true;
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("form.mobile")) {
        if (mobileSearchInput.value === "") {
          mobileSearchForm.classList.remove("active");
          mobileSearchInput.setAttribute("disabled", "");
          isFold = false;
        }
      }
    });

    // 메인 페이지나 상세 페이지에서 마이페이지 버튼이 존재하는 경우
    if (!!localStorage.getItem("encryptedRefresh")) {
      const myPageBtn = document.querySelector("button.my-page-btn");
      const myPageImg = document.querySelector("button.my-page-btn img");

      myPageBtn.addEventListener("click", () => {
        const dropdown = document.querySelector("ul.dropdown");
        dropdown.classList.toggle("active");
        myPageBtn.classList.toggle("active");
        if (myPageBtn.classList.contains("active")) {
          myPageImg.src = "/images/icon-user-2.svg";
        } else {
          myPageImg.src = "/images/icon-user.svg";
        }
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest("button.my-page-btn")) {
          const dropdown = document.querySelector("ul.dropdown");
          dropdown.classList.remove("active");
          myPageBtn.classList.remove("active");
          myPageImg.src = "/images/icon-user.svg";
        }
      });
    }
  }
}
