package org.acme.login;

import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.InputStream;
import java.net.URI;

@Path("/") // 기본 경로가 최상위 /
public class AuthResource {

    @Inject
    RoutingContext context; // Quarkus Vert.x 세션 접근

    // GET /login → 로그인 HTML 페이지 반환
    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML) // 서버 → 클라
    public Response loginPage() {
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/login.html");
        return Response.ok(html).build();
    }

    // POST /login_check → DB 조회로 인증 처리 후 세션 저장
    @POST
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED) // 클라 → 서버
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password) {

        User user = User.findByUsername(username); // 아이디 조회 (SELECT ... WHERE username = ?)
        if (user == null || !user.password.equals(password)) { // 존재/비밀번호 확인
            return Response.seeOther(URI.create("/login?error=1")).build();
        }
        // 세션에 로그인 정보 저장
        context.session().put("loginUser", username);
        return Response.seeOther(URI.create("/after_login")).build(); // 303: POST → GET 전환
    }

    // GET /after_login → 세션 체크 후 로그인 후 페이지 반환
    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {
        String loginUser = context.session().get("loginUser");
        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + loginUser);
        if (loginUser == null) {
            // 세션 없음 → 로그인 페이지로 강제 이동 (Forced Browsing 차단)
            return Response.seeOther(URI.create("/login")).build();
        }
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/main_after_login.html");
        return Response.ok(html).build();
    }

    // GET /logout → 세션 초기화 후 메인 이동
    @GET
    @Path("/logout")
    public Response logout() {
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));
        context.session().destroy(); // 서버의 세션 데이터 전체 삭제
        System.out.println("=== 로그아웃 후 loginUser : " + context.session().get("loginUser"));
        return Response.seeOther(URI.create("/")).build();
    }
}
