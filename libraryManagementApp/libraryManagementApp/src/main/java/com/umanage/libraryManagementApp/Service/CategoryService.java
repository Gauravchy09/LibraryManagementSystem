package com.umanage.libraryManagementApp.Service;

import com.umanage.libraryManagementApp.Entity.Category;
import java.util.List;

public interface CategoryService {

    Category addCategory(Category category) throws Exception;

    Category getCategoryByName(String name);

    List<Category> getAllCategories();

    boolean checkCategoryExists(String name);

    void deleteCategoryById(int categoryId) throws Exception;

    void deleteCategoryByName(String name) throws Exception;
}
