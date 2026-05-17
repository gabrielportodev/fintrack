package me.gabrielporto.fintrack.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    private Bucket resolveBucket(String ip, String uri) {
        String key = ip + ":" + getEndpointKey(uri);
        return buckets.computeIfAbsent(key, k -> createBucket(uri));
    }

    private String getEndpointKey(String uri) {
        if (uri.contains("/auth/forgot-password")) return "forgot-password";
        if (uri.contains("/auth/verify-code"))     return "verify-code";
        if (uri.contains("/auth/login"))            return "login";
        if (uri.contains("/auth/register"))         return "register";
        return "global";
    }

    private Bucket createBucket(String uri) {
        Bandwidth limit = switch (getEndpointKey(uri)) {
            case "forgot-password" -> Bandwidth.builder()
                    .capacity(3)
                    .refillIntervally(3, Duration.ofHours(1))
                    .build();
            case "verify-code" -> Bandwidth.builder()
                    .capacity(5)
                    .refillIntervally(5, Duration.ofMinutes(15))
                    .build();
            case "login" -> Bandwidth.builder()
                    .capacity(5)
                    .refillIntervally(5, Duration.ofMinutes(15))
                    .build();
            case "register" -> Bandwidth.builder()
                    .capacity(3)
                    .refillIntervally(3, Duration.ofHours(1))
                    .build();
            default -> Bandwidth.builder()
                    .capacity(200)
                    .refillIntervally(200, Duration.ofMinutes(1))
                    .build();
        };
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String ip = extractIp(request);
        Bucket bucket = resolveBucket(ip, request.getRequestURI());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Muitas tentativas. Tente novamente mais tarde.\"}");
        }
    }

    private String extractIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
