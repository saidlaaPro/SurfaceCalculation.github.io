package io.saidlaarab.businesslogicserver.config.providers;

import io.saidlaarab.businesslogicserver.config.AuthenticationServerProxy;
import io.saidlaarab.businesslogicserver.config.authentications.OtpAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

@Component
public class OtpAuthenticationProvider implements AuthenticationProvider {
    @Autowired
    AuthenticationServerProxy authenticationServerProxy;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String code = authentication.getCredentials().toString();

        boolean otp_valid = authenticationServerProxy.sendOTP(username, code);

        if(otp_valid){
            return new OtpAuthentication(username, code);
        }else{
            throw new BadCredentialsException("Invalid OTP");
        }
    }

    @Override
    public boolean supports(Class<?> authClass) {
        return OtpAuthentication.class.isAssignableFrom(authClass);
    }
}
