package com.laybhariecom.demo.repository;

import com.laybhariecom.demo.model.Order;
import com.laybhariecom.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findByUser(User user);
}
