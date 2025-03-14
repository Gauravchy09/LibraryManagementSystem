package com.umanage.libraryManagementApp.Config;

// import java.util.Arrays;
// import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class AppConfig {

    private final JwtValidator jwtValidator;

    public AppConfig(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> 
                authorize
                    .requestMatchers("/auth/**").permitAll()         // Public endpoints (Login/Signup)
                    .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")  // Fixed Role Prefix
                    .requestMatchers("/api/user/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")   
                    .requestMatchers("/api/**").authenticated()      // General authenticated routes
                    .anyRequest().denyAll())                         
            .addFilterBefore(jwtValidator, BasicAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable());
            // .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    // private CorsConfigurationSource corsConfigurationSource() {
    //     return request -> {
    //         CorsConfiguration configuration = new CorsConfiguration();
    //         configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
    //         configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    //         configuration.setAllowCredentials(true);
    //         configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
    //         configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
    //         return configuration;
    //     };
    // }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
