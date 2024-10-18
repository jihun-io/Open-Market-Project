let joinType = "buyer";

let defaultApiUrl;

export default function Login({ API_URL }) {
  defaultApiUrl = API_URL;

  localStorage.clear();
  sessionStorage.clear();

  return {
    title: "로그인 - HODU",
    content: /*html*/ `
  <header>
      <h1>
        <a href="/"><img src="/images/Logo-hodu.png" alt="HODU" /></a>
      </h1>
    </header>
    <main>
      <section>
        <h2 class="sr-only">로그인</h2>
        <ul class="button-row">
          <li><button class="buyer active">구매회원 로그인</button></li>
          <li><button class="seller">판매회원 로그인</button></li>
        </ul>
        <form action="submit" method="post">
          <fieldset>
            <label class="sr-only" for="id">아이디</label>
            <input type="text" name="id" id="id" placeholder="아이디" />
            <label class="sr-only" for="password">비밀번호</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="비밀번호"
            />
            <p class="msg"></p>
            <button type="submit">로그인</button>
          </fieldset>
        </form>
        <ul class="joins">
          <li><a href="/join">회원가입</a></li>
          <li><a href="/forgot">비밀번호 찾기</a></li>
        </ul>
      </section>
    </main>
    `,
  };
}

// function generateKeyFromFingerprint() {
//   const fingerprint =
//     navigator.userAgent + screen.width + screen.height + navigator.language;
//   return CryptoJS.SHA256(fingerprint).toString();
// }

export async function loginSubmit() {
  const fpPromise = FingerprintJS.load();
  const result = await fpPromise.then((fp) => fp.get());
  const { screenResolution, ...components } = result.components;

  const visitorId = FingerprintJS.hashComponents(components);

  const buttons = document.querySelectorAll(".button-row button");
  const form = document.querySelector("form");
  const id = form.querySelector("#id");
  const password = form.querySelector("#password");
  const msg = form.querySelector(".msg");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      id.value = "";
      password.value = "";
      buttons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
      if (button.classList.contains("buyer")) {
        joinType = "buyer";
      } else {
        joinType = "seller";
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (id.value === "") {
      id.focus();
      msg.classList.add("active");
      msg.textContent = "아이디를 입력해주세요.";
      return;
    } else if (password.value === "") {
      password.focus();
      msg.classList.add("active");
      msg.textContent = "비밀번호를 입력해주세요.";
      return;
    } else {
      msg.textContent = "";
      msg.classList.remove("active");

      let data = {
        username: id.value,
        password: password.value,
      };

      const req = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      try {
        const res = await fetch(`${defaultApiUrl}/accounts/login/`, req);
        if (res.ok) {
          const result = await res.json();

          if (result.user.user_type.toLowerCase() !== joinType) {
            msg.classList.add("active");
            msg.textContent = "잘못된 회원 유형입니다.";
            throw new Error("잘못된 회원 유형입니다.");
          } else {
            // 로그인 성공 시 localStorage에 사용자 이름 아이디, user_type을 저장
            localStorage.setItem("username", result.user.username);
            localStorage.setItem("name", result.user.name);
            localStorage.setItem("user_type", result.user.user_type);

            // 로그인 성공 시 refresh token을 localStorage에 CryptoJS로 암호화하여 저장
            const encryptedRefreshToken = CryptoJS.AES.encrypt(
              result.refresh,
              visitorId
            ).toString();
            localStorage.setItem("encryptedRefresh", encryptedRefreshToken);
            // 로그인 성공 시 access token을 sessionStorage에 CryptoJS로 암호화하여 저장
            const encryptedAccessToken = CryptoJS.AES.encrypt(
              result.access,
              visitorId
            ).toString();
            sessionStorage.setItem("encryptedAccess", encryptedAccessToken);

            document.cookie = `test=test; path=/;`;
            history.back();
          }
        } else {
          const result = await res.json();
          msg.classList.add("active");
          msg.textContent = result.error;
          throw new Error(result.error);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
}
