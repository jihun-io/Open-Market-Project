import Home from "../pages/home.js";
import NotFound from "../pages/not-found.js";
import Login, { loginSubmit } from "../pages/login.js";
import Logout from "../pages/logout.js";
import Join, { formSubmit } from "../pages/join.js";
import Details, { detailsScript } from "../pages/details.js";

const API_URL = "https://estapi.openmarket.weniv.co.kr";

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/join", component: Join },
  { path: "/items/:id", component: Details },
  { path: "/logout", component: Logout },
];

const routeScripts = {
  "/items/:id": detailsScript,
  "/join": formSubmit,
  "/login": loginSubmit,
  // "/logout": logoutSubmit,
};

function matchRoute(path) {
  return routes.find((route) => {
    if (route.path === path) return true;

    const routeParts = route.path.split("/");
    const pathParts = path.split("/");

    if (routeParts.length !== pathParts.length) return false;

    return routeParts.every((part, i) => {
      if (part[0] === ":") return true;
      return part === pathParts[i];
    });
  });
}

function extractParams(route, path) {
  const params = {};
  const routeParts = route.path.split("/");
  const pathParts = path.split("/");

  routeParts.forEach((part, i) => {
    if (part.startsWith(":")) {
      params[part.slice(1)] = pathParts[i];
    }
  });

  return params;
}

async function router() {
  const path = window.location.pathname;
  const content = document.querySelector("body");
  const matchedRoute = matchRoute(path);

  let pageContent;
  let routeClass;
  let pageTitle;
  let params;

  if (matchedRoute) {
    params = extractParams(matchedRoute, path);
    const result = await matchedRoute.component({ API_URL, params });
    pageContent = result.content;
    pageTitle = result.title;
    routeClass = path.slice(1) === "" ? "route-home" : `route-${path.slice(1)}`;
  } else {
    pageContent = NotFound().content;
    routeClass = "route-not-found";
    pageTitle = "페이지를 찾을 수 없습니다 - HODU";
  }

  content.innerHTML = pageContent;
  document.title = pageTitle;

  // 모든 route 관련 클래스를 body에서 제거
  document.body.classList = "";

  // 현재 route에 해당하는 클래스를 body에 추가
  document.body.classList.add(routeClass);

  const scriptPath = Object.keys(routeScripts).find((scriptPath) => {
    if (scriptPath === path) return true;
    const scriptParts = scriptPath.split("/");
    const pathParts = path.split("/");
    if (scriptParts.length !== pathParts.length) return false;
    return scriptParts.every(
      (part, i) => part === pathParts[i] || part.startsWith(":")
    );
  });

  if (scriptPath && routeScripts[scriptPath]) {
    routeScripts[scriptPath]({ API_URL, params });
  }
}

window.addEventListener("load", () => router());
window.addEventListener("popstate", () => router());

document.body.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    const href = e.target.getAttribute("href");
    const target = e.target.getAttribute("target");

    // 외부 링크 처리
    if (!href.startsWith("/")) {
      // 외부 링크는 기본 동작 유지
      return;
    }

    e.preventDefault(); // 내부 링크의 기본 동작 방지

    // target="_blank" 처리
    if (target === "_blank") {
      window.open(href, "_blank");
      return; // 여기서 함수 종료
    }

    // 일반 내부 링크 처리
    window.history.pushState({}, "", href);
    router();
  }
});
