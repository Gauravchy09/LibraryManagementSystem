package com.umanage.libraryManagementApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.umanage.libraryManagementApp.Entity.User;
import java.util.List;

public interface UserRepo extends JpaRepository<User, Integer> {

    User findByUsername(String username);

    List<User> findByEmail(String email);

    List<User> findByRole(String role);  // For Admin and User role differentiation

    boolean existsByUsername(String username);  

    boolean existsByEmail(String email);

}
