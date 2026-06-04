// [12~13주차] 프로필 페이지 - 정보 표시 + 회원정보 수정 + 비밀번호 변경

window.addEventListener('load', function () {
    // ── 1) 사용자 정보 조회(DB) → 화면/폼 반영 ──
    fetch('/profile/info')
        .then(res => res.json())
        .then(data => {
            // (프로필 페이지 전용 요소 — 다른 페이지에서는 없을 수 있어 null 체크)
            const iu = document.getElementById('infoUsername');
            const ie = document.getElementById('infoEmail');
            const ip = document.getElementById('infoPhone');
            const img = document.getElementById('profileImg');
            if (iu) iu.textContent = data.username;
            if (ie) ie.textContent = data.email;
            if (ip) ip.textContent = data.phone;
            if (img && data.profileImage) img.src = '/uploads/profile/' + data.profileImage;
            // 수정 폼에 기존 값 자동 채우기
            const ue = document.getElementById('updateEmail');
            const up = document.getElementById('updatePhone');
            if (ue) ue.value = data.email;
            if (up) up.value = data.phone;
            // 네비바 프로필 링크 tooltip에 사용자명 표시
            const profileLink = document.getElementById('profileNavLink');
            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '👤 ' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
        });

    // ── 2) URL 파라미터(success/error)로 결과 메시지 표시 ──
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const success = params.get('success');
    const msgEl = document.getElementById('updateMsg');

    if (success === 'updated' && msgEl) {
        msgEl.className = 'alert alert-success';
        msgEl.textContent = '✅ 개인정보가 수정되었습니다.';
    } else if (error === 'duplicate_email' && msgEl) {
        msgEl.className = 'alert alert-danger';
        msgEl.textContent = '❌ 이미 사용 중인 이메일입니다.';
    }

    if (error === 'wrong_password') {
        showToast('❌ 현재 비밀번호가 일치하지 않습니다.', 'danger');
        const pwMsgEl = document.getElementById('pwMsg');
        if (pwMsgEl) {
            pwMsgEl.className = 'alert alert-danger';
            pwMsgEl.textContent = '❌ 현재 비밀번호가 일치하지 않습니다.';
        }
    }

    if (success === 'password_changed') {
        // Toast 출력 후 3.5초 뒤 자동 로그아웃 → 로그인 페이지
        showToast('✅ 비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.', 'success');
        setTimeout(function () { window.location.href = '/logout?next=login'; }, 3500);
    }

    // 사진 업로드 오류 메시지
    if (error) {
        const messages = {
            'invalid_type': 'jpg, png, gif, webp 파일만 가능합니다.',
            'too_large': '파일 크기는 5MB 이하여야 합니다.',
            'upload_fail': '업로드 실패. 다시 시도해주세요.'
        };
        const msg = messages[error];
        const div = document.getElementById('uploadErrorMsg');
        if (msg && div) { div.textContent = msg; div.classList.remove('d-none'); }
    }
});

// ── 회원정보 수정: 정규식 검사 후 전송 ──
function validateAndUpdate() {
    let valid = true;
    const email = document.getElementById('updateEmail').value.trim();
    const phone = document.getElementById('updatePhone').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('updateEmail', 'updateEmailMsg', '올바른 이메일 형식이 아닙니다.'); valid = false;
    } else { clearFieldError('updateEmail'); }
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('updatePhone', 'updatePhoneMsg', '010-0000-0000 형식으로 입력해주세요.'); valid = false;
    } else { clearFieldError('updatePhone'); }
    if (valid) document.getElementById('updateForm').submit();
}

// ── 비밀번호 변경: 정규식 검사 + 현재/새 비밀번호 SHA-256 해시 ──
async function validateAndChangePassword() {
    let valid = true;
    const currentPw = document.getElementById('currentPwInput').value;
    const newPw = document.getElementById('newPwInput').value;
    const newPwConfirm = document.getElementById('newPwConfirm').value;

    if (!currentPw) {
        showFieldError('currentPwInput', 'currentPwMsg', '현재 비밀번호를 입력해주세요.'); valid = false;
    } else { clearFieldError('currentPwInput'); }

    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!pwRegex.test(newPw)) {
        showFieldError('newPwInput', 'newPwMsg', '8자 이상, 영문+숫자+특수문자를 포함해야 합니다.'); valid = false;
    } else { clearFieldError('newPwInput'); }

    if (newPw !== newPwConfirm) {
        showFieldError('newPwConfirm', 'newPwConfirmMsg', '새 비밀번호가 일치하지 않습니다.'); valid = false;
    } else { clearFieldError('newPwConfirm'); }

    if (!valid) return;

    // 현재/새 비밀번호 모두 해시 후 hidden 필드에 저장 (input_sha256.js)
    document.getElementById('currentPassword').value = await hashPassword(currentPw);
    document.getElementById('newPassword').value = await hashPassword(newPw);
    document.getElementById('pwForm').submit();
}

// profile.js 전용 에러 표시 (메시지 id를 직접 받음)
function showFieldError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    const msg = document.getElementById(msgId);
    if (msg) msg.textContent = message;
}
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}
