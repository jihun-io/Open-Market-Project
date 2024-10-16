import Home from "../pages/home.js";
import NotFound from "../pages/not-found.js";
import Login, { loginSubmit } from "../pages/login.js";
import Join, { formSubmit } from "../pages/join.js";
import Details, { detailsScript } from "../pages/details.js";

const routes = {
  "/": Home,
  "/login": Login,
  "/join": Join,
  "/details": Details,
};

const routeScripts = {
  "/details": detailsScript,
  "/join": formSubmit,
  "/login": loginSubmit,
};

const routeTitles = {
  "/": "홈",
  "/login": "로그인",
  "/join": "회원가입",
  "/details": "상품 상세",
};

function router() {
  const path = window.location.pathname;
  const content = document.querySelector("body");
  const page = routes[path] || NotFound;
  content.innerHTML = page();

  // 모든 route 관련 클래스를 body에서 제거
  document.body.classList.remove(
    ...Object.keys(routes).map((route) => `route-${route.slice(1)}`)
  );

  // 현재 route에 해당하는 클래스를 body에 추가
  let routeClass;
  if (path === "/") {
    routeClass = "route-home";
  } else if (page === NotFound) {
    routeClass = "route-not-found";
  } else {
    routeClass = `route-${path.slice(1)}`;
  }

  document.body.classList.add(routeClass);

  !!routeTitles[path]
    ? (document.title = `${routeTitles[path]} - HODU`)
    : (document.title = "페이지를 찾을 수 없습니다 - HODU");

  if (routeScripts[path]) {
    routeScripts[path]();
  }
}

window.addEventListener("load", router);
window.addEventListener("popstate", router);

document.body.addEventListener("click", (e) => {
  if (e.target.tagName === "a") {
    e.preventDefault();
    const href = e.target.href;
    window.history.pushState({}, "", href);
    router();
  }
});
