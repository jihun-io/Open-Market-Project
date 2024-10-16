export default function Footer() {
  return `
    <footer>
      <nav>
        <ul class="legal">
          <li>
            <a href="/info">호두샵 소개</a>
          </li>
          <li>
            <a href="/terms">이용약관</a>
          </li>
          <li>
            <a href="/privacy">
              <strong>개인정보처리방침</strong>
            </a>
          </li>
          <li>
            <a href="/contract">전자금융거래약관</a>
          </li>
          <li>
            <a href="/teenages">청소년보호정책</a>
          </li>
          <li>
            <a href="/cooperation">제휴문의</a>
          </li>
        </ul>
        <ul class="social">
          <li>
            <a href="https://instagram.com">
              <img src="/images/icon-insta.svg" alt="인스타그램" />
            </a>
          </li>
          <li>
            <a href="https://facebook.com">
              <img src="/images/icon-fb.svg" alt="페이스북" />
            </a>
          </li>
          <li>
            <a href="https://youtube.com">
              <img src="/images/icon-yt.svg" alt="유튜브" />
            </a>
          </li>
        </ul>
      </nav>
      <ul class="shop-info">
        <li>
          <h2>
            <strong>(주)HODU SHOP</strong>
          </h2>
        </li>
        <li>제주특별자치도 제주시 동광고 137 제주코딩베이스캠프</li>
        <li>사업자 번호: 000-0000-0000 | 통신판매업</li>
        <li>대표 : 김호두</li>
      </ul>
    </footer>
  `;
}
