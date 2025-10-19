package com.laybhariecom.demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.service.CategoryService;

import java.util.List;
import java.util.Locale.Category;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<com.laybhariecom.demo.model.Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse(true, "Categories fetched successfully", categories));
    }
}