package com.laybhariecom.demo.service;

import com.laybhariecom.demo.dto.request.RegisterRequest;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.Role;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
    
    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole(Role.CUSTOMER);
        user.setActive(true);
        
        return userRepository.save(user);
    }
    
    public User getUserById(Long id) {
        return (User) userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return (User) userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}