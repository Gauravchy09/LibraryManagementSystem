package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Book;
import com.umanage.libraryManagementApp.Entity.Category;
import com.umanage.libraryManagementApp.Repository.BookRepo;
import com.umanage.libraryManagementApp.Repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private BookRepo bookRepo;


    @Override
    public Category addCategory(Category category) throws Exception {
        List<Book> books = category.getBooks();

        for (Book book : books) {
            book.setCategory(category); // Ensure category reference is set
            bookRepo.save(book); // Save each book individually if necessary
        }

        return categoryRepo.save(category); // Save category after ensuring books are updated
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryRepo.findByName(name);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    @Override
    public boolean checkCategoryExists(String name) {
        return categoryRepo.existsByName(name);
    }

    @Override
    public void deleteCategoryById(int categoryId) throws Exception {
        if (!categoryRepo.existsById(categoryId)) {
            throw new Exception("Category not found with ID: " + categoryId);
        }
        Category category = categoryRepo.findById(categoryId).orElseThrow(
                () -> new Exception("Category not found with ID: " + categoryId));

        // Update associated books
        for (Book book : category.getBooks()) {
            book.setCategory(null); // Or assign a default category if required
        }
        bookRepo.saveAll(category.getBooks()); // Save updated book details

        categoryRepo.deleteById(categoryId);
    }

    @Override
    public void deleteCategoryByName(String name) throws Exception {
        Category category = categoryRepo.findByName(name);
        if (category == null) {
            throw new Exception("Category not found with name: " + name);
        }

        // Update associated books
        for (Book book : category.getBooks()) {
            book.setCategory(null); // Or assign a default category if needed
        }
        bookRepo.saveAll(category.getBooks()); // Save updated book details

        categoryRepo.delete(category);
    }
}
