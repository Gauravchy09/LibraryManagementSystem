package com.umanage.libraryManagementApp.Config;

import java.util.Date;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JwtProvider {

    private static final SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    private static final JwtParser jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    private static final long EXPIRATION_TIME = 3600000;  // 1 hour in milliseconds

    public static String generateToken(String username, String role) {
        String token = Jwts.builder()
                .setIssuer("Gaurav")
                .setSubject(username.trim())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 1 Hour
                .claim("username", username.trim())
                .claim("role", role.trim()) // Store "ROLE_ADMIN"/"ROLE_USER" directly
                .signWith(key)
                .compact();
        logger.info("Generated token: " + token);
        return token;
    }

    public static String getUsernameFromJwtToken(String jwt) {
        try {
            if(jwt.startsWith("Bearer ")) {
                jwt = jwt.substring(7);
            }
            Claims claims = jwtParser.parseClaimsJws(jwt).getBody();
            return claims.get("username",String.class);
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid or expired JWT token", e);
        }
    }
    

    public static String getRoleFromJwtToken(String jwt) {
        Claims claims = jwtParser.parseClaimsJws(jwt).getBody();
        return claims.get("role", String.class); // Directly extracted
    }

    public static boolean validateToken(String token) {
        if (token == null || token.isEmpty()) {
            logger.warn("Token is null or empty");
            return false;
        }
        try {
            jwtParser.parseClaimsJws(token);  // This will validate the token
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("Token expired: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Malformed Token: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Invalid Token: " + e.getMessage());
        }
        return false;
    }
}
