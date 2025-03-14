package com.umanage.libraryManagementApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.umanage.libraryManagementApp.Entity.Transaction;
import java.util.List;

public interface TransactionRepo extends JpaRepository<Transaction, Integer> {

    List<Transaction> findByUser_Id(int userId);  // Correct reference for User ID

    List<Transaction> findByBook_BookId(int bookId);  // Correct reference for Book ID

    List<Transaction> findByReturnDateIsNull(); // Correct as it is

    boolean existsByUser_IdAndBook_BookId(int userId, int bookId);  // Correct reference for existence check
}
