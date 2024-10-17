export default function Logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("name");
  localStorage.removeItem("user_type");
  localStorage.removeItem("encryptedRefresh");

  location.href = "/";
  return {
    title: "로그아웃 - HODU",
    content: /*html*/ `
      <main class="logout">
        <h2>로그아웃 되었습니다.</h2>
        <ul>
          <li><a href="/">메인으로</a></li>
          <li><a href="/login">로그인</a></li>
        </ul>
      </main>
    `,
  };
}
