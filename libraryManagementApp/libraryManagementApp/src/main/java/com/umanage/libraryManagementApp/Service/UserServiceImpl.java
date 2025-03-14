package com.umanage.libraryManagementApp.Service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.umanage.libraryManagementApp.Config.JwtProvider;
import com.umanage.libraryManagementApp.Entity.Book;
import com.umanage.libraryManagementApp.Entity.Role;
import com.umanage.libraryManagementApp.Entity.Transaction;
import com.umanage.libraryManagementApp.Entity.User;
import com.umanage.libraryManagementApp.Repository.BookRepo;
import com.umanage.libraryManagementApp.Repository.TransactionRepo;
import com.umanage.libraryManagementApp.Repository.UserRepo;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private BookRepo bookRepo;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User getUserById(int id) throws Exception {
        return userRepo.findById(id).orElseThrow(() -> new Exception("User not found with id: " + id));
    }

    @Override
    public User getUserByUsername(String username) throws Exception {
        User user = userRepo.findByUsername(username);
        if (user != null) {
            return user;
        } else {
            throw new Exception("User not found with username: " + username);
        }
    }

    @Override
    public User addUser(User user) {
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword())); // Password Encryption
        newUser.setAddress(user.getAddress());
        newUser.setEmail(user.getEmail());
        newUser.setRole(Role.ROLE_USER); // Default Role for new users
        return userRepo.save(newUser);
    }

    @Override
    public User updateUser(User user, int id) throws Exception {
        User oldUser = userRepo.findById(id).orElseThrow(() -> new Exception("User not found with id: " + id));
        if (user.getUsername() != null) {
            oldUser.setUsername(user.getUsername());
        }
        if (user.getAddress() != null) {
            oldUser.setAddress(user.getAddress());
        }
        if (user.getEmail() != null) {
            oldUser.setEmail(user.getEmail());
        }
        return userRepo.save(oldUser);
    }

    @Override
    public void deleteUser(int id) throws Exception {
        if (!userRepo.existsById(id)) {
            throw new Exception("User not found with id: " + id);
        }
        userRepo.deleteById(id);
    }

    @Override
    public User findUserByJwt(String jwt) throws Exception {
        try {
            String username = JwtProvider.getUsernameFromJwtToken(jwt); // Extract username from the token
            if (username == null || username.isEmpty()) {
                throw new Exception("Invalid token or no username found in the token");
            }

            User user = getUserByUsername(username); // Fetch user from the database by username
            if (user == null) {
                throw new Exception("User not found for username: " + username);
            }

            return user;
        } catch (Exception e) {
            throw new Exception("Error occurred while finding user by JWT: " + e.getMessage());
        }
    }

    @Override
    public User viewProfile(int userId) throws Exception {
        return userRepo.findById(userId)
                .orElseThrow(() -> new Exception("User not found with id: " + userId));
    }

    @Override
    public void changePassword(int userId, String oldPassword, String newPassword) throws Exception {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new Exception("User not found with id: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new Exception("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    // transaction related methods::
    @Override
    public Transaction borrowBook(int userId, int bookId) throws Exception {
        User user = getUserById(userId);
        Book book = bookRepo.findById(bookId).orElseThrow(() -> new Exception("Book not found"));

        if (book.getAvailableCopies() == 0) {
            throw new Exception("No copies available to borrow.");
        }

        // if (transactionRepo.existsByUser_IdAndBook_BookId(userId, bookId)) {
        //     throw new Exception("You have already borrowed this book.");
        // }

        // Update Book Details
        book.setAvailableCopies(book.getAvailableCopies() - 1);

        // Establish User-Book Relationship
        book.getUsers().add(user);
        user.getBorrowedBooks().add(book);

        // Save both entities
        bookRepo.save(book);
        userRepo.save(user);        

        // Create Transaction Record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setIssueDate(LocalDate.now());
        transaction.setStatus(com.umanage.libraryManagementApp.Entity.Status.ISSUED);

        return transactionRepo.save(transaction);
    }

    @Override
    public List<Transaction> getBorrowedBooksHistory(int userId) {
        return transactionRepo.findByUser_Id(userId);
    }

    @Override
    public Transaction returnBook(int userId, int bookId) throws Exception {
        Transaction transaction = transactionRepo.findByUser_Id(userId).stream()
                .filter(t -> t.getBook().getBookId() == bookId && t.getReturnDate() == null)
                .findFirst()
                .orElseThrow(() -> new Exception("No active transaction found for this book."));

        transaction.setReturnDate(LocalDate.now());
        transaction.setStatus(com.umanage.libraryManagementApp.Entity.Status.RETURNED);

        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        return transactionRepo.save(transaction);
    }

    @Override
    public List<Book> getBorrowedBooks(int userId) {
        return transactionRepo.findByUser_Id(userId).stream().map(Transaction::getBook).toList();
    }

    @Override
    public List<Transaction> getUnreturnedBooks(int userId) {
        return transactionRepo.findByUser_Id(userId).stream().filter(t -> t.getReturnDate() == null).toList();
    }

    // Books related methods::

    @Override
    public List<Book> getBooksByTitle(String title) {
        return bookRepo.findByTitleContaining(title);
    }

    @Override
    public List<Book> getBooksByAuthor(String author) {
        return bookRepo.findByAuthorContaining(author);
    }

    @Override
    public List<Book> getBooksByGenre(String genre) {
        return bookRepo.findByGenre(genre);
    }

    @Override
    public List<Book> getBooksByPublishedYear(int year) {
        return bookRepo.findByPublishedYear(year);
    }

    @Override
    public List<Book> getAllAvailableBooks() {
        return bookRepo.findByAvailableCopiesGreaterThan(0);
    }
}
