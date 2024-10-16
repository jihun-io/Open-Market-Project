import Header from "../components/header.js";
import Footer from "../components/footer.js";

export default function Home() {
  return `
    ${Header()}
    <main>
      <section class="carousel">
        <h2 class="sr-only">이벤트 배너</h2>
        <div class="controller">
          <button class="prev">
            <img src="/images/icon-swiper-1.svg" alt="이전" />
          </button>
          <button class="next">
            <img src="/images/icon-swiper-2.svg" alt="다음" />
          </button>
        </div>
        <div class="event-banner">
          <button class="active">
            <span class="sr-only">1번 이미지</span>
          </button>
          <button>
            <span class="sr-only">2번 이미지</span>
          </button>
          <button>
            <span class="sr-only">3번 이미지</span>
          </button>
          <button>
            <span class="sr-only">4번 이미지</span>
          </button>
          <button>
            <span class="sr-only">5번 이미지</span>
          </button>
        </div>
      </section>
      <section class="product-lists">
        <h2 class="sr-only">상품 목록</h2>
        <article class="item">
          <img
            src="/images/그림파우치_맥북 사본.jpeg"
            alt="노트북 파우치 상품의 목업 이미지."
          />
          <p class="seller">우당탕탕 라이캣의 실험실</p>
          <h3 class="title">Hack Your Life 개발자 노트북 파우치</h3>
          <p class="price">
            <span class="number">29,000</span>원
          </p>
        </article>
        <article class="item">
          <img
            src="/images/열쇠고리_고양이_그림자컷.jpeg"
            alt="고양이 키링 상품의 목업 이미지."
          />
          <p class="seller">제주코딩베이스캠프</p>
          <h3 class="title">네 개발잡니다 개발자키링 금속키링</h3>
          <p class="price">
            <span class="number">29,000</span>원
          </p>
        </article>
        <article class="item">
          <img
            src="/images/무릎담요-제품-소개1.png"
            alt="무릎 담요 상품의 목업 이미지."
          />
          <p class="seller">백엔드글로벌</p>
          <h3 class="title">딥러닝 개발자 무릎 담요</h3>
          <p class="price">
            <span class="number">29,000</span>원
          </p>
        </article>
        <article class="item">
          <img
            src="/images/세트_사선부분컷.jpeg"
            alt="스티커 팩 상품의 목업 이미지."
          />
          <p class="seller">코딩앤유</p>
          <h3 class="title">우당탕탕 라이캣의 실험실 스티커 팩</h3>
          <p class="price">
            <span class="number">29,000</span>원
          </p>
        </article>
        <article class="item">
          <img
            src="/images/열쇠고리_개구리_가로1.jpeg"
            alt="개구리 키링 상품의 목업 이미지."
          />
          <p class="seller">파이썬스쿨</p>
          <h3 class="title">
            버그를 Java라 버그잡는 개리씨 키링 개발자키링...
          </h3>
          <p class="price">
            <span class="number">29,000</span>원
          </p>
        </article>
      </section>
    </main>
    ${Footer()}
  `;
}
