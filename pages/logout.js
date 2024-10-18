import Header from "../components/header.js";
import Footer from "../components/footer.js";

export default function Logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("name");
  localStorage.removeItem("user_type");
  localStorage.removeItem("encryptedRefresh");

  sessionStorage.removeItem("encryptedAccess");

  location.href = "/";
  return {
    title: "로그아웃 - HODU",
    content: /*html*/ `
      ${Header()}
      <main>
      </main>
      ${Footer()}
    `,
  };
}
