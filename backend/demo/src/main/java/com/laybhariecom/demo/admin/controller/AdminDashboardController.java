package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.response.DashboardStatsResponse;
import com.laybhariecom.demo.admin.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminDashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(
        @RequestParam(defaultValue = "30") Integer days
    ) {
        log.info("Fetching dashboard stats for last {} days", days);
        DashboardStatsResponse stats = dashboardService.getDashboardStats(days);
        return ResponseEntity.ok(stats);
    }
}
