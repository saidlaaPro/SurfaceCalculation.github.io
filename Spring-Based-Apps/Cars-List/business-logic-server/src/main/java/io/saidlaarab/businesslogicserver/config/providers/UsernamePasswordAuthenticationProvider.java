package io.saidlaarab.businesslogicserver.config.providers;

import io.saidlaarab.businesslogicserver.config.AuthenticationServerProxy;
import io.saidlaarab.businesslogicserver.config.authentications.UsernamePasswordAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class UsernamePasswordAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    AuthenticationServerProxy authenticationServerProxy;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        authenticationServerProxy.sendAuth(username, password);

        return new UsernamePasswordAuthentication(username, password);
    }

    @Override
    public boolean supports(Class<?> authClass) {
        return UsernamePasswordAuthentication.class.isAssignableFrom(authClass);
    }
}
