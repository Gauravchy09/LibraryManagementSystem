package com.umanage.libraryManagementApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.umanage.libraryManagementApp.Entity.*;
import com.umanage.libraryManagementApp.Service.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookService bookService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private CategoryService categoryService;

    // ==================== USER MANAGEMENT ====================
    @GetMapping("/user")
    public List<User> getAllUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/user/id/{userId}")
    public User getUserById(@PathVariable int userId) throws Exception {
        return userService.getUserById(userId);
    }

    @GetMapping("/user/username/{userName}")
    public User getUserByUsername(@PathVariable String userName) throws Exception {
        return userService.getUserByUsername(userName);
    }

    @DeleteMapping("/user/delete/{userId}")
    public void deleteUserById(@PathVariable int userId) throws Exception {
        userService.deleteUser(userId);
    }

    @GetMapping("/user/profile")    // error
    public User getUserFromToken(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwt(jwt);
        if (user == null) {
            throw new Exception("Invalid JWT token or user not found.");
        }
        user.setPassword(null);
        return user;
    }

    // ==================== BOOK MANAGEMENT ====================
    @PostMapping("/book/add")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }

    @PutMapping("/book/update/{bookId}")
    public Book updateBook(@PathVariable int bookId, @RequestBody Book book) throws Exception {
        return bookService.updateBook(book, bookId);
    }

    @DeleteMapping("/book/delete/{bookId}")
    public void deleteBook(@PathVariable int bookId) throws Exception {
        bookService.deleteBook(bookId);
    }

    @GetMapping("/book/{bookId}")
    public Book getBookById(@PathVariable int bookId) throws Exception {
        return bookService.getBookById(bookId);
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    // ==================== TRANSACTION MANAGEMENT ====================
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/transactions/user/{userId}")
    public List<Transaction> getTransactionsByUser(@PathVariable int userId) {
        return transactionService.getTransactionsByUserId(userId);
    }

    @GetMapping("/transactions/book/{bookId}")
    public List<Transaction> getTransactionsByBook(@PathVariable int bookId) {
        return transactionService.getTransactionsByBookId(bookId);
    }

    // ==================== CATEGORY MANAGEMENT ====================
    @PostMapping("/category/add")
    public Category addCategory(@RequestBody Category category) throws Exception {
        return categoryService.addCategory(category);
    }

    @DeleteMapping("/category/delete/id/{categoryId}")
    public void deleteCategoryById(@PathVariable int categoryId) throws Exception {
        categoryService.deleteCategoryById(categoryId);
    }

    @DeleteMapping("/category/delete/name/{categoryName}")
    public void deleteCategoryById(@PathVariable String categoryName) throws Exception {
        categoryService.deleteCategoryByName(categoryName);
    }

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }
}
