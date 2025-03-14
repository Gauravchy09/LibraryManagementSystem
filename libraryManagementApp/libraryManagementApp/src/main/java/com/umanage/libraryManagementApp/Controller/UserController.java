package com.umanage.libraryManagementApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.umanage.libraryManagementApp.Entity.Book;
import com.umanage.libraryManagementApp.Entity.Transaction;
import com.umanage.libraryManagementApp.Entity.User;
import com.umanage.libraryManagementApp.Service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PutMapping("/update")
    public User updateUser(@RequestBody User user, @RequestHeader("Authorization") String jwt) throws Exception {
        User loggedInUser = userService.findUserByJwt(jwt);
        return userService.updateUser(user, loggedInUser.getId());
    }

    @GetMapping("/profile")
    public User viewProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User loggedInUser = userService.findUserByJwt(jwt);
        return userService.viewProfile(loggedInUser.getId());
    }

    @PutMapping("/change-password")
    public String changePassword(@RequestHeader("Authorization") String jwt,
                                 @RequestParam String oldPassword,
                                 @RequestParam String newPassword) throws Exception {
        User loggedInUser = userService.findUserByJwt(jwt);
        userService.changePassword(loggedInUser.getId(), oldPassword, newPassword);
        return "Password changed successfully";
    }
    


    // transaction - related mehtods::

    @PostMapping("/{userId}/borrow/{bookId}")
    public ResponseEntity<?> borrowBook(@PathVariable int userId, @PathVariable int bookId) {
        try {
            Transaction transaction = userService.borrowBook(userId, bookId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/borrowed-books")
    public List<Transaction> getBorrowedBooksHistory(@RequestHeader("Authorization") String jwt) throws Exception {
        User loggedInUser = userService.findUserByJwt(jwt);
        return userService.getBorrowedBooksHistory(loggedInUser.getId());
    }
    

    @PostMapping("/{userId}/return/{bookId}")
    public ResponseEntity<?> returnBook(@PathVariable int userId, @PathVariable int bookId) {
        try {
            Transaction transaction = userService.returnBook(userId, bookId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // books -related methods::
    @GetMapping("/{userId}/borrowed-books")
    public ResponseEntity<?> getBorrowedBooks(@PathVariable int userId) {
        List<Book> borrowedBooks = userService.getBorrowedBooks(userId);
        return ResponseEntity.ok(borrowedBooks);
    }

    @GetMapping("/{userId}/unreturned-books")
    public ResponseEntity<?> getUnreturnedBooks(@PathVariable int userId) {
        List<Transaction> unreturnedBooks = userService.getUnreturnedBooks(userId);
        return ResponseEntity.ok(unreturnedBooks);
    }

    @GetMapping("/books/title/{title}")
    public List<Book> getBooksByTitle(@PathVariable String title) {
        return userService.getBooksByTitle(title);
    }

    @GetMapping("/books/author/{author}")
    public List<Book> getBooksByAuthor(@PathVariable String author) {
        return userService.getBooksByAuthor(author);
    }

    @GetMapping("/books/genre/{genre}")
    public List<Book> getBooksByGenre(@PathVariable String genre) {
        return userService.getBooksByGenre(genre);
    }

    @GetMapping("/books/year/{year}")
    public List<Book> getBooksByPublishedYear(@PathVariable int year) {
        return userService.getBooksByPublishedYear(year);
    }

    @GetMapping("/books/available")
    public List<Book> getAllAvailableBooks() {
        return userService.getAllAvailableBooks();
    }

}
