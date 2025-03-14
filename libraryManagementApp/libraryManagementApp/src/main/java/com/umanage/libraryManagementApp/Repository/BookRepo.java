package com.umanage.libraryManagementApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.umanage.libraryManagementApp.Entity.Book;
import java.util.List;

public interface BookRepo extends JpaRepository<Book, Integer> {

    List<Book> findByTitleContaining(String title);

    List<Book> findByAuthorContaining(String author);

    List<Book> findByGenre(String genre);

    List<Book> findByPublishedYear(int year);

    List<Book> findByAvailableCopiesGreaterThan(int copies); // For checking book availability

    boolean existsByIsbn(String isbn); // Ensures ISBN uniqueness

}
