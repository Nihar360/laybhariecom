package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.StockAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    
    Optional<StockAlert> findByProductId(Long productId);
    
    List<StockAlert> findByIsActiveTrue();
    
    @Query("SELECT sa FROM StockAlert sa WHERE sa.isActive = true AND sa.product.stockCount <= sa.threshold")
    List<StockAlert> findLowStockAlerts();
    
    boolean existsByProductId(Long productId);
}
