package com.laybhariecom.demo.repository;

import com.laybhariecom.demo.model.CartItem;
import com.laybhariecom.demo.model.Product;
import com.laybhariecom.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    /**
     * Find cart item by user, product, size, and color
     */
    Optional<CartItem> findByUserAndProductAndSizeAndColor(
            User user, 
            Product product, 
            String size, 
            String color
    );
    
    /**
     * Find all cart items for a specific user
     */
    List<CartItem> findByUser(User user);
    
    /**
     * Find cart item by user and product (ignoring size and color)
     */
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    
    /**
     * Delete all cart items for a specific user
     */
    void deleteByUser(User user);
    
    /**
     * Count cart items for a specific user
     */
    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user = :user")
    Long countByUser(@Param("user") User user);
    
    /**
     * Check if a product exists in user's cart
     */
    @Query("SELECT CASE WHEN COUNT(ci) > 0 THEN true ELSE false END " +
           "FROM CartItem ci WHERE ci.user = :user AND ci.product = :product")
    boolean existsByUserAndProduct(@Param("user") User user, @Param("product") Product product);
}