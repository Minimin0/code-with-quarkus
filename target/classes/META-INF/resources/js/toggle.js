// [추가] 다크/라이트 모드 토글 JavaScript
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("themeToggleBtn");
  const navbar = document.querySelector(".navbar");
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    btn.textContent = "☀️ LIGHT";
    navbar.classList.remove("navbar-dark", "bg-dark");
    navbar.classList.add("navbar-light", "bg-light");
  } else {
    btn.textContent = "🌙 DARK";
    navbar.classList.remove("navbar-light", "bg-light");
    navbar.classList.add("navbar-dark", "bg-dark");
  }
}

// [9주차 과제2] 인라인(onclick) 방식 → 이벤트 리스너 방식으로 변경
// 모든 페이지에서 toggle.js만 연동하면 버튼에 자동으로 클릭 이벤트가 등록된다.
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }
});
