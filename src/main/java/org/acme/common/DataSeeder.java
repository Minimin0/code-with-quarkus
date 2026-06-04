package org.acme.common;

import org.acme.champion.Champion;
import org.acme.login.User;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DataSeeder {
    
    @Transactional
    void onStart(@Observes StartupEvent ev) {
        
            // User 초기 데이터 (챔피온 데이터와 별도 블록)
            if (User.count() == 0) {
            User guest = new User();
            guest.username = "guest";
            // [12주차] 평문 대신 SHA-256 해시값 저장 (원본 패스워드: 123qwe@@@)
            guest.password = "7680bf06962a60f8f9b099f3c951fee6a30e53d0ff39586eb32f256418a32b20";
            guest.email = "guest@example.com"; // [11주차] 컬럼 추가
            guest.phone = "010-0000-0000";     // [11주차] 컬럼 추가
            guest.persist();
        }
        // CDI 표준, 이벤트
        if (Champion.count() > 0) return; // 이미데이터있으면중단
        persist("아트록스", "전사", "탑");
        persist("사일러스", "마법사", "정글/미드");
        persist("애니비아", "마법사", "미드");
        persist("브라이어", "전사", "정글");
        persist("잭스", "전사", "탑");
        persist("징크스", "원거리딜러","원딜");
        persist("야스오", "전사", "미드/탑");
        persist("리신", "전사", "정글");
        persist("티모", "마법사", "탑");
        persist("케인", "암살자", "정글");
        persist("루시안", "원거리딜러","원딜/미드");
    }
    private void persist(String name, String role, String line) {
        Champion c = new Champion();
        c.name = name;
        c.role = role;
        c.line = line;
        c.persist();
    }
}