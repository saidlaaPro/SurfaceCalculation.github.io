package io.saidlaarab.businesslogicserver.config;

import io.saidlaarab.businesslogicserver.config.filters.InitialAuthenticationFilter;
import io.saidlaarab.businesslogicserver.config.filters.JwtAuthenticationFilter;
import io.saidlaarab.businesslogicserver.config.providers.OtpAuthenticationProvider;
import io.saidlaarab.businesslogicserver.config.providers.UsernamePasswordAuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class ProjectConfig extends WebSecurityConfigurerAdapter {
    @Bean
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }

    @Autowired
    InitialAuthenticationFilter initialAuthenticationFilter;
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    UsernamePasswordAuthenticationProvider usernamePasswordAuthProvider;
    @Autowired
    OtpAuthenticationProvider otpAuthProvider;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(usernamePasswordAuthProvider)
            .authenticationProvider(otpAuthProvider);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        http.cors(
                cust -> {
                    CorsConfigurationSource source = request ->{
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                        config.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "PATCH"));
                        config.setAllowedHeaders(Arrays.asList("*"));

                        return config;
                    };

                    cust.configurationSource(source);
                }
        );

        http.addFilterAt(initialAuthenticationFilter, BasicAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter.class);

        http.authorizeRequests()
                .anyRequest().authenticated();
    }

    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception{
        return super.authenticationManager();
    }
}
