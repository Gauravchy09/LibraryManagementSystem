package com.umanage.libraryManagementApp.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.umanage.libraryManagementApp.Entity.Book;
import com.umanage.libraryManagementApp.Entity.Transaction;
import com.umanage.libraryManagementApp.Entity.User;

@Service
public interface UserService {
    List<User> getAllUsers();
    User getUserById(int id) throws Exception;
    User getUserByUsername(String userName) throws Exception;
    User addUser(User user);
    User updateUser(User user, int id) throws Exception;
    void deleteUser(int id) throws Exception;
    User findUserByJwt(String jwt) throws Exception;
    void changePassword(int userId, String oldPassword, String newPassword) throws Exception;
    User viewProfile(int userId) throws Exception;


    // transaction related methods::
    Transaction borrowBook(int userId, int bookId) throws Exception;
    Transaction returnBook(int userId, int bookId) throws Exception;
    List<Book> getBorrowedBooks(int userId);
    List<Transaction> getUnreturnedBooks(int userId);
    List<Transaction> getBorrowedBooksHistory(int userId);


    // books related methods::
    List<Book> getBooksByTitle(String title);

    List<Book> getBooksByAuthor(String author);

    List<Book> getBooksByGenre(String genre);

    List<Book> getBooksByPublishedYear(int year);

    List<Book> getAllAvailableBooks();


}
