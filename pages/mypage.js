import Header from "../components/header.js";
import Footer from "../components/footer.js";

function orderLink() {
  if (localStorage.getItem("user_type") === "BUYER") {
    return /*html*/ `
      <li><a href="/mypage/order">주문 목록</a></li>
    `;
  } else {
    return /*html*/ ``;
  }
}

export default function Mypage() {
  if (!sessionStorage.getItem("encryptedAccess")) {
    location.href = "/login";
  }

  return {
    title: "마이페이지 - HODU",
    content: /*html*/ `
    ${Header()}
    <main>
      <article>
        <h2>마이페이지</h2>
        <ul>
          ${orderLink()}
          <li><a href="/mypage/account">회원 정보 수정</a></li>
        </ul>
      </article>
    </main>
    ${Footer()}
  `,
  };
}
