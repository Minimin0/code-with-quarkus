// [11주차] SHA-256 패스워드 암호화 + 가입 확인 모달 (브라우저 내장 Web Crypto API)

// SHA-256 해시 함수
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 확인 모달 출력 + 해시 생성
async function showConfirmModal() {
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    // 모달에 입력 정보 표시
    document.getElementById('confirmUsername').textContent = username;
    document.getElementById('confirmEmail').textContent = email;
    document.getElementById('confirmPhone').textContent = phone;

    // SHA-256 해시 생성 → hidden 필드(id="hashedPassword", name="password")에 저장
    const hashed = await hashPassword(password);
    document.getElementById('hashedPassword').value = hashed;
    console.log('해시된 패스워드 :', hashed); // F12 콘솔 확인용

    // Bootstrap 확인 모달 출력
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

// 가입하기 버튼 클릭 → form submit (서버에는 평문이 아닌 해시값 전송)
function submitRegister() {
    bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();
    document.getElementById('registerForm').submit();
}
