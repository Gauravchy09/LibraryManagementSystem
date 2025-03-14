package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Transaction;
import com.umanage.libraryManagementApp.Repository.TransactionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Override
    public Transaction addTransaction(Transaction transaction) {
        return transactionRepo.save(transaction);
    }

    @Override
    public List<Transaction> getTransactionsByUserId(int userId) {
        return transactionRepo.findByUser_Id(userId);
    }

    @Override
    public List<Transaction> getTransactionsByBookId(int bookId) {
        return transactionRepo.findByBook_BookId(bookId);
    }

    @Override
    public List<Transaction> getUnreturnedBooks() {
        return transactionRepo.findByReturnDateIsNull();
    }

    @Override
    public boolean checkIfTransactionExists(int userId, int bookId) {
        return transactionRepo.existsByUser_IdAndBook_BookId(userId, bookId);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll();
    }

}
