package org.acme.login;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users") // 예약어 충돌 방지: "user" → "users"
public class User extends PanacheEntity {
    public String username;
    public String password;        // [11주차] SHA-256 해시값 저장

    @Column(unique = true)         // [11주차] 이메일 중복 방지
    public String email;
    public String phone;           // [11주차] 연락처

    public String profileImage;    // [12주차] 프로필 사진 파일명 (UUID 기반)

    // 아이디로 조회
    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }

    // 이메일로 조회
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}
