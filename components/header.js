export default function Header() {
  return `
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
      </div>
      <nav class="header-right">
        <ul>
          <li>
            <a href="/cart">
              <img src="/images/icon-shopping-cart.svg" alt="" />
              장바구니
            </a>
          </li>
          <li>
            <a href="/login">
              <img src="/images/icon-user.svg" alt="" />
              로그인
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `;
}
