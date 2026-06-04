// document.getElementById('searchForm').addEventListener('submit', function(e) {
//     e.preventDefault(); // 폼 기본 동작 차단(새로고침)
//     const query = document.getElementById('searchInput').value.trim();
//     if (!query) return;
//     window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
// });

// ── 챔피언 데이터──────────────────────────────────────────────
const CHAMPIONS = [
    { name: '아트록스', engName: 'Aatrox', role: '전사', lane: '탑', img: 'image/a1.jpeg', difficulty: '상', modalId: 'modalAatrox' },
    { name: '사일러스', engName: 'Sylas', role: '마법사', lane: '정글/미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Sylas.png', difficulty: '중' },
    { name: '애니비아', engName: 'Anivia', role: '마법사', lane: '미드', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Anivia.png', difficulty: '상' },
    { name: '브라이어', engName: 'Briar', role: '전사', lane: '정글', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Briar.png', difficulty: '중' },
    { name: '잭스', engName: 'Jax', role: '전사', lane: '탑', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jax.png', difficulty: '하' },
    { name: '징크스', engName: 'Jinx', role: '원거리딜러', lane: '원딜', img: 'https://ddragon.leagueoflegends.com/cdn/15.24.1/img/champion/Jinx.png', difficulty: '중' },
    { name: '멜', engName: 'Mel', role: '원거리딜러', lane: '서포터', img: 'image/mel.jpeg', difficulty: '상', modalId: 'modalMell' },
    { name: '자헨', engName: 'Zaahen', role: '전사', lane: '탑', img: 'image/jahen.jpeg', difficulty: '상', modalId: 'modalZaahen' },
    { name: '유나라', engName: 'Yunara', role: '원거리딜러', lane: '바텀', img: 'image/yunara.jpeg', difficulty: '중', modalId: 'modalYunara' },
];

// --- 뉴스 데이터 ------------------------------
const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임 업데이트' },
    { title: '패치 노트 16.4', desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.', category: '패치 노트' },
];

// ---- 검색 실행 ------------------------------
function performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {              // 검색어가 없거나 공백이면 메인 화면으로 복귀
        showMainScreen();
        return;
    }

    document.getElementById('searchKeywordDisplay').textContent = `"${query}"`;

    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) ||
        c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) ||
        c.lane.includes(q)
    );

    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );

    document.getElementById('champCount').textContent = `(${champResults.length})`;
    document.getElementById('newsCount').textContent = `(${newsResults.length})`;

    const champList = document.getElementById('championResultList');
    if (champResults.length === 0) {
        champList.innerHTML = `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 챔피언이 없습니다.</p></div>`;
    } else {
        champList.innerHTML = champResults.map(c => `
            <div class="search-result-card d-flex align-items-center justify-content-between p-0 overflow-hidden">
                <div class="d-flex align-items-center">
                    <img src="${c.img}" alt="${c.name}">
                    <div class="p-3">
                        <div style="font-weight:700; font-size:1rem; color:#111;">
                            ${c.name}
                            <span style="color:#888; font-size:0.85rem;">(${c.engName})</span>
                        </div>
                        <div style="color:#555; font-size:0.9rem; margin-top:4px;">
                            역할: ${c.role} &nbsp;|&nbsp; 라인: ${c.lane} &nbsp;|&nbsp; 난이도: ${c.difficulty}
                        </div>
                    </div>
                </div>
                ${c.modalId ? `<button class="btn btn-sm btn-outline-dark me-3" data-bs-toggle="modal" data-bs-target="#${c.modalId}">상세 보기</button>` : ''}
            </div>
        `).join('');
    }

    const newsList = document.getElementById('newsResultList');
    if (newsResults.length === 0) {
        newsList.innerHTML = `<div class="no-result"><h4>검색 결과 없음</h4><p>"${query}"에 해당하는 뉴스가 없습니다.</p></div>`;
    } else {
        newsList.innerHTML = newsResults.map(n => `
            <div class="search-result-card p-3">
                <span style="font-size:0.75rem; background:#c8253a; color:#fff; padding:2px 8px; border-radius:3px;">${n.category}</span>
                <div style="font-weight:700; font-size:1rem; color:#111; margin-top:8px;">${n.title}</div>
                <div style="color:#555; font-size:0.9rem; margin-top:4px;">${n.desc}</div>
            </div>
        `).join('');
    }

    switchCategory('champion', document.querySelector('.search-category-item'));

    document.querySelector('.hero').classList.add('d-none');
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.add('d-none'));
    document.getElementById('searchResults').classList.remove('d-none');
    document.getElementById('searchResults').style.display = 'block';
}

// ── 카테고리 전환 ────────────────────────────────────────────
function switchCategory(type, el) {
    document.querySelectorAll('.search-category-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('resultChampion').style.display = type === 'champion' ? 'block' : 'none';
    document.getElementById('resultNews').style.display = type === 'news' ? 'block' : 'none';
}

// ── 메인 화면으로 복귀 ───────────────────────────────────────
// 검색어가 없거나 공백일 때 호출. 검색 결과 섹션을 숨기고
// 히어로 + 기존 섹션(챔피언/뉴스 등)을 다시 보여준다.
function showMainScreen() {
    // 검색 결과 섹션 숨김
    const results = document.getElementById('searchResults');
    results.classList.add('d-none');
    results.style.display = 'none';

    // 히어로 섹션 다시 표시
    document.querySelector('.hero').classList.remove('d-none');

    // 검색 결과를 제외한 나머지 섹션 다시 표시
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.remove('d-none'));

    // 검색창 비우기
    document.getElementById('searchInput').value = '';
}

// ── 폼 이벤트 ────────────────────────────────────────────────
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    performSearch(query);
});