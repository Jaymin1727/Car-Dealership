package com.example.car_dealership_backend.repository;

import com.example.car_dealership_backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, String> {
    List<Purchase> findByUserId(Long userId);
    List<Purchase> findAllByOrderByPurchaseDateDesc();
}
