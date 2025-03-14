package com.umanage.libraryManagementApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.umanage.libraryManagementApp.Entity.Category;

public interface CategoryRepo extends JpaRepository<Category, Integer> {

    Category findByName(String name);

    boolean existsByName(String name);

}
