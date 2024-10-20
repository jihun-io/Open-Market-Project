function userIcon() {
  return /*html*/ `
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26.6663 28V25.3333C26.6663 23.9188 26.1044 22.5623 25.1042 21.5621C24.104 20.5619 22.7475 20 21.333 20H10.6663C9.25185 20 7.8953 20.5619 6.8951 21.5621C5.89491 22.5623 5.33301 23.9188 5.33301 25.3333V28" stroke="current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.0003 14.6667C18.9458 14.6667 21.3337 12.2789 21.3337 9.33333C21.3337 6.38781 18.9458 4 16.0003 4C13.0548 4 10.667 6.38781 10.667 9.33333C10.667 12.2789 13.0548 14.6667 16.0003 14.6667Z" stroke="current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
}

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
      ${userIcon()}
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
      ${userIcon()}
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
      ${userIcon()}
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

  const excludedRoutes = ["login", "join", "seller"];

  if (!excludedRoutes.includes(location.pathname.split("/")[1])) {
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
        // if (myPageBtn.classList.contains("active")) {
        //   myPageImg.src = "/images/icon-user-2.svg";
        // } else {
        //   myPageImg.src = "/images/icon-user.svg";
        // }
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest("button.my-page-btn")) {
          const dropdown = document.querySelector("ul.dropdown");
          dropdown.classList.remove("active");
          myPageBtn.classList.remove("active");
          // myPageImg.src = "/images/icon-user.svg";
        }
      });
    }
  }
}
