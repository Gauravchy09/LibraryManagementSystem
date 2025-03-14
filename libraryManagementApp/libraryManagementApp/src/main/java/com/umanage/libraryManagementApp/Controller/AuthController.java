package com.umanage.libraryManagementApp.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umanage.libraryManagementApp.Config.JwtProvider;
import com.umanage.libraryManagementApp.Controller.DTO.AuthResponse;
import com.umanage.libraryManagementApp.Controller.DTO.LoginRequest;
import com.umanage.libraryManagementApp.Entity.Role;
import com.umanage.libraryManagementApp.Entity.User;
import com.umanage.libraryManagementApp.Repository.UserRepo;
import com.umanage.libraryManagementApp.Service.CustomUserDetailService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    // ======================= USER SIGNUP ======================= //
    @PostMapping("/signup")
    public AuthResponse createUser(@Valid @RequestBody User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already exists, try another one");
        }

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setAddress(user.getAddress());
        newUser.setRole(Role.ROLE_USER);  // Assign default role as USER

        userRepository.save(newUser);

        String token = JwtProvider.generateToken(newUser.getUsername(), newUser.getRole().toString());
        return new AuthResponse(token, "User Registered Successfully");
    }

    // ======================= ADMIN SIGNUP ======================= //
    @PostMapping("/signup/admin")
    public AuthResponse createAdmin(@Valid @RequestBody User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already exists, try another one");
        }

        User newAdmin = new User();
        newAdmin.setUsername(user.getUsername());
        newAdmin.setEmail(user.getEmail());
        newAdmin.setPassword(passwordEncoder.encode(user.getPassword()));
        newAdmin.setRole(Role.ROLE_ADMIN);  // Explicitly assign ADMIN role
        newAdmin.setAddress(user.getAddress());

        userRepository.save(newAdmin);

        String token = JwtProvider.generateToken(newAdmin.getUsername(), newAdmin.getRole().toString());
        return new AuthResponse(token, "Admin Registered Successfully");
    }

    // ======================= USER & ADMIN SIGNIN ======================= //
    @PostMapping("/signin")
    public AuthResponse signin(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        Authentication authentication = authenticate(loginRequest.getUsername(), loginRequest.getPassword());

        // Fetch user details to ensure role assignment in token
        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null) {
            throw new BadCredentialsException("User not found");
        }

        String token = JwtProvider.generateToken(user.getUsername(), user.getRole().toString());
        return new AuthResponse(token, "Login Successful");
    }

    // ======================= AUTHENTICATION LOGIC ======================= //
    private Authentication authenticate(String username, String password) throws Exception {
        UserDetails userDetails = customUserDetailService.loadUserByUsername(username);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid username");
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Password not matched!");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, userDetails.getAuthorities());
    }
}
