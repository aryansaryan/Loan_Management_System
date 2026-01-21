package com.loanmanagementsystem.loanmanagementsystem.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.loanmanagementsystem.loanmanagementsystem.entity.User;
import com.loanmanagementsystem.loanmanagementsystem.entity.UserRole;
import com.loanmanagementsystem.loanmanagementsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/** Loads users from the database and maps roles to Spring Security authorities. */
@Service
@RequiredArgsConstructor
public class DbUserDetailsService implements UserDetailsService {

    /** User lookup source. */
    private final UserRepository userRepository;

    /** Used by Spring Security to load credentials for authentication. */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserRole role = (user.getRole() == null) ? UserRole.CUSTOMER : user.getRole();

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + role.name())))
                .disabled(!user.isActive())
                .build();
    }
}
