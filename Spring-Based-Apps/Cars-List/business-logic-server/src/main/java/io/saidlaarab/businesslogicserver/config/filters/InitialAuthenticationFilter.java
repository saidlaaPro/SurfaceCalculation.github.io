package io.saidlaarab.businesslogicserver.config.filters;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.lang.Maps;
import io.jsonwebtoken.security.Keys;
import io.saidlaarab.businesslogicserver.config.authentications.OtpAuthentication;
import io.saidlaarab.businesslogicserver.config.authentications.UsernamePasswordAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class InitialAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    AuthenticationManager authenticationManager;

    @Value("${jwt.signing.key}")
    private String signingKey;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getServletPath().equals("/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String username = request.getHeader("username");
        String password = request.getHeader("password");
        String code = request.getHeader("code");

        if( code == null){

            UsernamePasswordAuthentication authentication = new UsernamePasswordAuthentication(
                                                                username,
                                                                password
                                                            );
            authenticationManager.authenticate(authentication);
        }else{

            OtpAuthentication authentication = new OtpAuthentication(
                                                    username,
                                                    code
                                                );

            authenticationManager.authenticate(authentication);

            // if the execution go on, that means that the OTP is valid:
            // So let's attach the JWT to the http response:
            SecretKey secretKey = Keys.hmacShaKeyFor(signingKey.getBytes(StandardCharsets.UTF_8));

            String jwt = Jwts.builder()
                                .setClaims(Maps.of("username", username).build())
                                .signWith(secretKey)
                                .compact();
            response.addHeader("Authorization", jwt);
            response.addHeader("Access-Control-Expose-Headers", "Authorization");

        }


    }
}
