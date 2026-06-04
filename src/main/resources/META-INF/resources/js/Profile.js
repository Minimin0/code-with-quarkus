// [12주차] 프로필 페이지 - 서버에서 사용자 정보를 비동기로 받아와 화면에 출력
window.addEventListener('load', function () {
    fetch('/profile/info')               // REST API, HTTP GET, 비동기 I/O
        .then(res => res.json())         // JSON 파싱 (Promise 체이닝)
        .then(data => {
            document.getElementById('infoUsername').textContent = data.username;
            document.getElementById('infoEmail').textContent = data.email;
            document.getElementById('infoPhone').textContent = data.phone;
            if (data.profileImage) {     // null 체크
                document.getElementById('profileImg').src =
                    '/uploads/profile/' + data.profileImage;
            }
        });
});
