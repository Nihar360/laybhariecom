package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.AdminRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRolePermissionRepository extends JpaRepository<AdminRolePermission, Long> {
    
    Optional<AdminRolePermission> findByRoleName(String roleName);
    
    boolean existsByRoleName(String roleName);
}
