// [11주차 과제] 로그인 화면 입력값 검사 (register의 input_check.js 참고, 파라미터 개수 다름)
function validateAndLogin() {
    let valid = true;
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    // ① 아이디 : 4~20자 영문/숫자
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        showError('usernameInput', 'usernameMsg', '아이디는 4~20자 영문/숫자만 가능합니다.');
        valid = false;
    } else {
        clearError('usernameInput');
    }

    // ② 패스워드 : 8자 이상, 영문 + 숫자 + 특수문자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError('passwordInput', 'passwordMsg', '8자 이상, 영문+숫자+특수문자를 포함해야 합니다.');
        valid = false;
    } else {
        clearError('passwordInput');
    }

    // ③ 모두 통과 시 로그인 실행
    if (valid) submitLogin();
}

// 회원가입과 달리 메시지 영역 id를 직접 받는다 (파라미터 3개)
function showError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    const msg = document.getElementById(msgId);
    if (msg) msg.textContent = message;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// [12주차] 패스워드를 SHA-256 해시로 변환 후 hidden 필드에 담아 전송
async function submitLogin() {
    const password = document.getElementById('passwordInput').value;
    const hashed = await hashPassword(password); // input_sha256.js
    document.getElementById('password').value = hashed; // 평문 대신 해시값 전송
    document.getElementById('loginForm').submit();
}
