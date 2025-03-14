package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Book;
import java.util.List;

public interface BookService {

    Book addBook(Book book);

    Book getBookById(int id) throws Exception;

    List<Book> getAllBooks();

    List<Book> searchBooksByTitle(String title);

    List<Book> searchBooksByAuthor(String author);

    List<Book> searchBooksByGenre(String genre);

    List<Book> getBooksByPublishedYear(int year);

    List<Book> getAvailableBooks(int copies);

    Book updateBook (Book book, int bookId) throws Exception;

    void deleteBook(int id) throws Exception;

    boolean checkIsbnExists(String isbn);
}
