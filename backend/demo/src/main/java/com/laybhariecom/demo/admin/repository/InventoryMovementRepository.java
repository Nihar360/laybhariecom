package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.InventoryMovement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Long> {
    
    List<InventoryMovement> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    Page<InventoryMovement> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);
    
    @Query("SELECT im FROM InventoryMovement im WHERE im.createdAt BETWEEN :startDate AND :endDate ORDER BY im.createdAt DESC")
    List<InventoryMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT im FROM InventoryMovement im WHERE im.reason = :reason ORDER BY im.createdAt DESC")
    List<InventoryMovement> findByReason(@Param("reason") InventoryMovement.MovementReason reason);
    
    @Query("SELECT im FROM InventoryMovement im WHERE im.adminUser.id = :adminId ORDER BY im.createdAt DESC")
    Page<InventoryMovement> findByAdminUserId(@Param("adminId") Long adminId, Pageable pageable);
}
