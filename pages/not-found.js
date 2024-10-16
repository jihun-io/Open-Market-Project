export default function NotFound() {
  return /*html*/ `
    <main>
      <article>
        <img src="/images/icon-404.svg" alt="" />
        <div class="msg">
          <h1>페이지를 찾을 수 없습니다.</h1>
          <p>
            페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.
            <br />웹 주소가 올바른지 확인해 주세요.
          </p>
          <ul>
            <li>
              <a href="/">메인으로</a>
            </li>
            <li>
              <button onclick="history.back()">이전 페이지</button>
            </li>
          </ul>
        </div>
      </article>
    </main>
  `;
}
