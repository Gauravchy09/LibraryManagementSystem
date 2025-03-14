package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Book;
import com.umanage.libraryManagementApp.Repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepo bookRepo;

    @Override
    public Book addBook(Book book) {
        return bookRepo.save(book);
    }

    @Override
    public Book getBookById(int bookId) throws Exception {
        if (bookId <= 0) {
            throw new Exception("Invalid book ID: " + bookId);
        }
    
        return bookRepo.findById(bookId)
            .orElseThrow(() -> new Exception("Book not found with ID: " + bookId));
    }
    

    @Override
    public List<Book> getAllBooks() {
        return bookRepo.findAll();
    }

    @Override
    public List<Book> searchBooksByTitle(String title) {
        return bookRepo.findByTitleContaining(title);
    }

    @Override
    public List<Book> searchBooksByAuthor(String author) {
        return bookRepo.findByAuthorContaining(author);
    }

    @Override
    public List<Book> searchBooksByGenre(String genre) {
        return bookRepo.findByGenre(genre);
    }

    @Override
    public List<Book> getBooksByPublishedYear(int year) {
        return bookRepo.findByPublishedYear(year);
    }

    @Override
    public List<Book> getAvailableBooks(int copies) {
        return bookRepo.findByAvailableCopiesGreaterThan(copies);
    }

    @Override
    public void deleteBook(int id) throws Exception {
        if (!bookRepo.existsById(id)) {
            throw new Exception("Book not found with ID: " + id);
        }
        bookRepo.deleteById(id);
    }

    @Override
    public boolean checkIsbnExists(String isbn) {
        return bookRepo.existsByIsbn(isbn);
    }

    @Override
    public Book updateBook(Book book, int bookId) throws Exception {
        Book existingBook = bookRepo.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found with id: " + bookId));

        if (book.getTitle() != null) {
            existingBook.setTitle(book.getTitle());
        }
        if (book.getAuthor() != null) {
            existingBook.setAuthor(book.getAuthor());
        }
        if (book.getGenre() != null) {
            existingBook.setGenre(book.getGenre());
        }
        if (book.getPublishedYear() != 0) {
            existingBook.setPublishedYear(book.getPublishedYear());
        }
        if (book.getAvailableCopies() != 0) {
            existingBook.setAvailableCopies(book.getAvailableCopies());
        }
        if (book.getIsbn() != null && !bookRepo.existsByIsbn(book.getIsbn())) {
            existingBook.setIsbn(book.getIsbn());
        }

        return bookRepo.save(existingBook);
    }

}
