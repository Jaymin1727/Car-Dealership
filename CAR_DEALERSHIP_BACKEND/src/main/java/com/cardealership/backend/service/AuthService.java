package com.cardealership.backend.service;

import com.cardealership.backend.dto.AuthResponse;
import com.cardealership.backend.dto.LoginRequest;
import com.cardealership.backend.dto.RegisterRequest;
import com.cardealership.backend.exception.BadRequestException;
import com.cardealership.backend.model.Role;
import com.cardealership.backend.model.User;
import com.cardealership.backend.repository.UserRepository;
import com.cardealership.backend.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        // The first user registered will be ADMIN for convenience/testing, or standard user.
        // Let's check: if no users exist in the DB, make the first one ADMIN, or we can make certain emails admin,
        // or just let any user register as USER. Let's see: we can check if userRepository.count() == 0, make them ADMIN.
        // That is super elegant because it allows the first user to automatically get admin rights to test all the admin screens!
        Role role = userRepository.count() == 0 ? Role.ADMIN : Role.USER;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password.");
        }

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
