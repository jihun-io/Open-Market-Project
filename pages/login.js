export default function Login() {
  return `
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
    <script>
      
    </script>
    `;
}

export function loginSubmit() {
  const buttons = document.querySelectorAll(".button-row button");
  const form = document.querySelector("form");
  const id = form.querySelector("#id");
  const password = form.querySelector("#password");
  const msg = form.querySelector(".msg");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
      id.value = "";
      password.value = "";
      msg.textContent = "";
      msg.classList.remove("active");
    });
  });

  form.addEventListener("submit", (event) => {
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
      form.submit();
    }
  });
}
