package com.laybhariecom.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.laybhariecom.demo.model.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryName(String categoryName);
    List<Product> findByInStockTrue();
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.inStock = true")
    List<Product> findAvailableProductsByCategory(@Param("categoryName") String categoryName);
    
    @Query("SELECT p FROM Product p WHERE p.inStock = true ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts();
    
    @Query("SELECT p FROM Product p WHERE p.badge IS NOT NULL")
    List<Product> findFeaturedProducts();
}
