let joinType = "buyer";

let defaultApiUrl;

export default function Join({ API_URL }) {
  defaultApiUrl = `${API_URL}/accounts`;

  return {
    title: "회원가입 - HODU",
    content: /*html*/ `
    <header>
      <h1>
        <a href="/"><img src="/images/Logo-hodu.png" alt="HODU" /></a>
      </h1>
    </header>
    <main>
      <section>
        <h2 class="sr-only">회원가입</h2>
        <ul class="button-row">
          <li><button class="buyer active">구매회원가입</button></li>
          <li><button class="seller">판매회원가입</button></li>
        </ul>
        <form action="submit" method="post">
          <fieldset>
            <label for="id">아이디</label>
            <div class="field-exists">
              <input type="text" name="id" id="id" />
              <button>중복확인</button>
            </div>
            <p class="msg msg-id"></p>
            <label for="password">비밀번호</label>
            <div class="field-security">
              <input type="password" name="password" id="password" />
              <div class="first-pw-check"
              ></div>
            </div>
            <p class="msg msg-pw"></p>
            <label for="passwordCheck">비밀번호 재확인</label>
            <div class="field-security">
              <input type="password" name="passwordCheck" id="passwordCheck" />
              <div class="second-pw-check"
              ></div>
            </div>
            <p class="msg msg-pw-check"></p>
            <label for="name">이름</label>
            <input type="text" name="name" id="name" />
            <p class="msg msg-name"></p>
            <label for="phone">휴대폰번호</label>
            <div class="field-phone">
              <div class="phone-area-container">
                <div class="select-wrapper" tabindex="0">
                  <input
                    type="number"
                    name="phone-area"
                    id="phone-area"
                    minlength="3"
                    maxlength="3"
                    value="010"
                    readonly
                    tabindex="-1"
                  />
                </div>
                <ul class="optionList">
                  <li class="optionItem" tabindex="0">010</li>
                  <li class="optionItem" tabindex="0">011</li>
                  <li class="optionItem" tabindex="0">016</li>
                  <li class="optionItem" tabindex="0">017</li>
                  <li class="optionItem" tabindex="0">018</li>
                  <li class="optionItem" tabindex="0">019</li>
                </ul>
              </div>
              <input
                type="number"
                name="phone-mid"
                id="phone-mid"
                minlength="4"
                maxlength="4"
              />
              <input
                type="number"
                name="phone-end"
                id="phone-end"
                minlength="4"
                maxlength="4"
              />
            </div>
            <p class="msg msg-phone"></p>
            <div class="business-only">
              <label for="business">사업자 등록번호</label>
              <div class="field-business">
                <input type="number" name="business" id="business" />
                <button>인증</button>
              </div>
              <p class="msg msg-business"></p>
              <label for="store-name">스토어 이름</label>
              <input type="text" name="store-name" id="store-name" />
            </div>
          </fieldset>
          <div class="agree">
            <input type="checkbox" name="agree" id="agree" />
            <label for="agree" tabindex="0">
              <span
                >호두샵의 <a href="/terms" target="_blank">이용약관</a> 및
                <a href="/privacy" target="_blank">개인정보처리방침</a>에 대한 내용을 확인하였고
                동의합니다.</span
              ></label
            >
            <button type="submit" disabled>가입하기</button>
          </div>
        </form>
      </section>
    </main>
  `,
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function formSubmit() {
  let apiUrl = () => {
    if (joinType === "buyer") {
      return defaultApiUrl + "/buyer/";
    } else {
      return defaultApiUrl + "/seller/";
    }
  };

  const buttons = document.querySelectorAll(".button-row button");
  const buyersOnly = document.querySelector("div.business-only");

  const msgs = document.querySelectorAll(".msg");

  const select = document.querySelector(".select-wrapper");
  const optionList = document.querySelector(".optionList");
  const options = document.querySelectorAll(".optionList li");

  const phoneNumbers = document.querySelectorAll(".field-phone input");

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      buttons.forEach((button) => button.classList.remove("active"));
      button.classList.add("active");
      if (button.classList.contains("buyer")) {
        joinType = "seller";
        buyersOnly.classList.remove("active");
      } else {
        joinType = "buyer";
        buyersOnly.classList.add("active");
      }
    });
  });

  select.addEventListener("click", (e) => {
    e.preventDefault();
    optionList.classList.toggle("active");
    select.classList.toggle("active");
    optionList.scrollTo(0, 0);
  });

  // 접근성을 고려한 키보드 이벤트 추가
  select.addEventListener("keypress", (e) => {
    e.preventDefault();
    if (e.key === "Enter" || e.key === " ") {
      optionList.classList.toggle("active");
      select.classList.toggle("active");
      optionList.scrollTo(0, 0);
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      select.querySelector("input").value = option.textContent;
      optionList.classList.remove("active");
      phoneNumbers[1].focus();
    });

    // 접근성을 고려한 키보드 이벤트 추가
    option.addEventListener("keypress", (e) => {
      e.preventDefault();
      if (e.key === "Enter" || e.key === " ") {
        select.querySelector("input").value = option.textContent;
        optionList.classList.remove("active");
      }
      phoneNumbers[1].focus();
    });
  });

  // 아이디 유효성 검사

  const id = document.querySelector("input#id");
  const idMsg = document.querySelector(".msg-id");
  const idCheck = document.querySelector(".field-exists button");

  const idValidation = () => {
    const regex = /^[A-Za-z0-9]{1,20}$/;
    if (id.value === "") {
      idMsg.classList.remove("correct");
      id.classList.add("error");
      idMsg.classList.add("active");
      idMsg.textContent = "필수 정보입니다.";
      return "need";
    } else if (regex.test(id.value)) {
      id.classList.remove("error");
      return "correct";
    } else {
      idMsg.classList.remove("correct");
      id.classList.add("error");
      idMsg.classList.add("active");
      idMsg.textContent =
        "20자 이내의 영문 소문자, 대문자, 숫자만 사용 가능합니다.";
      return "error";
    }
  };

  id.addEventListener("blur", () => {
    const idValidationResult = idValidation();
    if (idValidationResult === "correct") {
      idMsg.classList.remove("active");
    }
  });

  idCheck.addEventListener("click", async (e) => {
    e.preventDefault();
    idMsg.classList.add("active");
    idMsg.classList.add("correct");
    idMsg.textContent = "확인 중...";

    const idValidationResult = idValidation();
    if (idValidationResult === "error") {
      return;
    }
    await delay(150);

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: id.value }),
    };

    try {
      const res = await fetch(`${defaultApiUrl}/validate-username/`, req);
      if (res.ok) {
        const data = await res.json();

        if (data.message === "사용 가능한 아이디입니다.") {
          id.classList.remove("error");
          idMsg.classList.add("active");
          idMsg.classList.add("correct");
          idMsg.textContent = "멋진 아이디네요 :)";
        }
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (err) {
      idMsg.classList.remove("correct");
      id.classList.add("error");
      idMsg.classList.add("active");
      idMsg.textContent = "이미 사용 중인 아이디입니다.";
    }
  });

  // 비밀번호 유효성 검사
  const passwords = document.querySelectorAll("input[type='password']");
  const firstCheck = document.querySelector(".first-pw-check");
  const secondCheck = document.querySelector(".second-pw-check");

  const fieldSecurities = document.querySelectorAll(".field-security");

  function passwordNotSafe(index) {
    if (index === 0) {
      firstCheck.classList.remove("valid");
    } else {
      secondCheck.classList.remove("valid");
    }
    fieldSecurities[index].classList.add("error");
    msgs[index + 1].classList.add("active");
    msgs[index + 1].textContent =
      "8자 이상, 영문 대 소문자, 숫자, 특수문자를 사용하세요.";
  }

  function passwordSafe(index) {
    if (index === 0) {
      firstCheck.classList.add("valid");
    } else {
      secondCheck.classList.add("valid");
    }
    fieldSecurities[index].classList.remove("error");
    msgs[index + 1].classList.remove("active");
    msgs[index + 1].textContent = "";
  }

  function passwordNotSame(index) {
    if (index === 0) {
      firstCheck.classList.remove("valid");
    } else {
      secondCheck.classList.remove("valid");
    }
    fieldSecurities[index].classList.add("error");
    msgs[index + 1].classList.add("active");
    msgs[index + 1].textContent = "비밀번호가 일치하지 않습니다.";
  }

  function passwordSame(index) {
    if (index === 0) {
      firstCheck.classList.add("valid");
    } else {
      secondCheck.classList.add("valid");
    }
    fieldSecurities[index].classList.remove("error");
    msgs[index + 1].classList.remove("active");
    msgs[index + 1].textContent = "";
  }

  passwords[0].addEventListener("blur", () => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (regex.test(passwords[0].value)) {
      passwordSafe(0);
    } else if (passwords[0].value === "") {
      firstCheck.src = "/images/icon-check-off.svg";
      firstCheck.alt = "안전하지 않음";
      msgs[1].classList.add("active");
      msgs[1].textContent = "필수 정보입니다.";
      fieldSecurities[0].classList.add("error");
    } else {
      passwordNotSafe(0);
    }

    if (
      passwords[0].value === passwords[1].value &&
      passwords[1].value !== ""
    ) {
      passwordSame(1);
    }
  });

  passwords[1].addEventListener("blur", () => {
    if (
      passwords[0].value === passwords[1].value &&
      passwords[1].value !== ""
    ) {
      passwordSame(1);
    } else if (passwords[1].value === "") {
      secondCheck.src = "/images/icon-check-off.svg";
      secondCheck.alt = "안전하지 않음";
      msgs[2].classList.add("active");
      msgs[2].textContent = "필수 정보입니다.";
      fieldSecurities[1].classList.add("error");
    } else {
      passwordNotSame(1);
    }
  });

  // 이름 유효성 검사
  const username = document.querySelector("#name");
  const usernameMsg = document.querySelector(".msg-name");

  username.addEventListener("blur", () => {
    if (username.value === "") {
      username.classList.add("error");
      usernameMsg.classList.add("active");
      usernameMsg.textContent = "필수 정보입니다.";
    } else {
      username.classList.remove("error");
      usernameMsg.classList.remove("active");
      usernameMsg.textContent = "";
    }
  });

  // 휴대전화번호 유효성 검사
  const phoneInputs = document.querySelectorAll(
    ".field-phone > input[type='number']"
  );
  const phoneMsg = document.querySelector(".msg-phone");

  phoneInputs.forEach((phone, index) => {
    phone.addEventListener("blur", () => {
      if (phoneInputs[index].value === "") {
        phoneInputs[index].classList.add("error");
        phoneMsg.classList.add("active");
        phoneMsg.textContent = "필수 정보입니다.";
      } else {
        phone.classList.remove("error");
        phoneMsg.classList.remove("active");
        phoneMsg.textContent = "";
      }
    });
  });

  // 휴대전화번호 입력 시 자동으로 포커스 이동 및 길이 제한
  phoneNumbers.forEach((phone, index) => {
    phone.addEventListener("input", (e) => {
      if (e.target.value.length >= e.target.maxLength) {
        if (index === 1) phoneNumbers[index + 1].focus();
        e.target.value = e.target.value.slice(0, e.target.maxLength);
      }
    });
  });

  // 사업자 등록번호 유효성 검사
  const business = document.querySelector("input#business");
  const businessMsg = document.querySelector(".msg-business");
  const businessCheck = document.querySelector(".field-business button");

  business.addEventListener("input", (e) => {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
  });

  businessCheck.addEventListener("click", async (e) => {
    e.preventDefault();
    businessMsg.textContent = "확인 중...";
    businessMsg.classList.add("active");
    businessMsg.classList.add("correct");
    await delay(150);

    const req = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ company_registration_number: business.value }),
    };
    try {
      const res = await fetch(
        `${defaultApiUrl}/seller/validate-registration-number/`,
        req
      );
      if (res.ok) {
        const data = await res.json();
        if (data.message === "사용 가능한 사업자등록번호입니다.") {
          business.classList.remove("error");
          businessMsg.classList.add("active");
          businessMsg.classList.add("correct");
          businessMsg.textContent = "인증되었습니다.";
        }
      } else {
        const result = await res.json();
        throw new Error(result.error);
      }
    } catch (err) {
      if (
        err.toString() ===
        "Error: company_registration_number 필드를 추가해주세요."
      ) {
        businessMsg.classList.remove("correct");
        business.classList.add("error");
        businessMsg.classList.add("active");
        businessMsg.textContent = "사업자등록번호를 입력해주세요.";
      } else if (
        err.toString() === "Error: 사업자등록번호는 10자리 숫자여야 합니다."
      ) {
        businessMsg.classList.remove("correct");
        business.classList.add("error");
        businessMsg.classList.add("active");
        businessMsg.textContent = "사업자등록번호는 10자리 숫자여야 합니다.";
      } else if (
        err.toString() === "Error: 이미 등록된 사업자등록번호입니다."
      ) {
        businessMsg.classList.remove("correct");
        business.classList.add("error");
        businessMsg.classList.add("active");
        businessMsg.textContent = "이미 사용 중인 사업자 등록번호입니다.";
      }
    }
  });

  const agreeLabel = document.querySelector(".agree label");
  const agreeInput = document.querySelector(".agree input");

  agreeLabel.addEventListener("keypress", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      agreeInput.checked = !agreeInput.checked;
    }
  });

  // 가입 버튼 활성화 로직
  const submitBtn = document.querySelector("button[type='submit']");
  const form = document.querySelector("form");

  function checkForm() {
    const buyerInputs = document.querySelectorAll(
      "fieldset input:not(.business-only input)"
    );
    const sellerInputs = document.querySelectorAll("fieldset input");

    const inputs = joinType === "buyer" ? buyerInputs : sellerInputs;

    // text나 password, number 타입의 input 중에 값이 없는 경우와 체크박스가 체크되지 않은 경우
    const check = Array.from(inputs).every((input) => {
      if (input.type === "checkbox") {
        return input.checked;
      } else {
        return input.value !== "";
      }
    });
    if (check && agreeInput.checked) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  form.addEventListener("input", () => {
    checkForm();
  });

  form.addEventListener("keypress", () => {
    checkForm();
  });

  // 폼 제출 로직

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit");
  });
}
