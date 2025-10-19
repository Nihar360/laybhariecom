package com.laybhariecom.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.laybhariecom.demo.model.CartItem;
import com.laybhariecom.demo.model.Product;
import com.laybhariecom.demo.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProductAndSizeAndColor(User user, Product product, String size, String color);
    void deleteByUser(User user);
    void deleteByUserId(Long userId);
}
