package org.acme.login;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class SessionConfig {

    @Inject // 컨테이너 자동 주입
    Vertx vertx; // 세션 저장소 관리

    // 서버 라우터에 세션 핸들러 등록 (세션 기능 동작에 필요)
    public void init(@Observes Router router) {
        router.route().handler(
            SessionHandler
                .create(LocalSessionStore.create(vertx))
                .setSessionTimeout(60 * 60 * 1000L) // 1시간
                .setCookieHttpOnlyFlag(true)        // HTTP 보안 플래그
        );
    }
}
