package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Transaction;
import java.util.List;

public interface TransactionService {

    Transaction addTransaction(Transaction transaction);

    List<Transaction> getTransactionsByUserId(int userId);

    List<Transaction> getTransactionsByBookId(int bookId);

    List<Transaction> getUnreturnedBooks();

    boolean checkIfTransactionExists(int userId, int bookId);

    List<Transaction> getAllTransactions();
}
