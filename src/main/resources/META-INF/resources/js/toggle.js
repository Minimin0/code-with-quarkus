// 다크/라이트 모드 토글 + [13주차] localStorage로 모드 유지(새로고침·페이지 이동에도 유지)

// 저장된 모드를 화면에 적용
function applyTheme(mode) {
  const body = document.body;
  const btn = document.getElementById("themeToggleBtn");
  const navbar = document.querySelector(".navbar");
  if (mode === "light") {
    body.classList.add("light-mode");
    if (btn) btn.textContent = "☀️ LIGHT";
    if (navbar) { navbar.classList.remove("navbar-dark", "bg-dark"); navbar.classList.add("navbar-light", "bg-light"); }
  } else {
    body.classList.remove("light-mode");
    if (btn) btn.textContent = "🌙 DARK";
    if (navbar) { navbar.classList.remove("navbar-light", "bg-light"); navbar.classList.add("navbar-dark", "bg-dark"); }
  }
}

// 클릭 시 모드 전환 + 저장
function toggleTheme() {
  const next = document.body.classList.contains("light-mode") ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("theme", next); // [13주차] 선택한 모드 저장
}

// [9주차 과제] 인라인(onclick) → 이벤트 리스너 방식
// [13주차] 페이지 로드 시 저장된 모드를 자동 적용 → 전체 페이지에서 모드 유지
document.addEventListener("DOMContentLoaded", function () {
  applyTheme(localStorage.getItem("theme") || "dark"); // 저장값 없으면 기본 다크
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.addEventListener("click", toggleTheme);
  }
});
