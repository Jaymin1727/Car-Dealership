package com.cardealership.backend.repository;

import com.cardealership.backend.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, String> {
    List<Purchase> findByUserId(Long userId);
    List<Purchase> findAllByOrderByPurchaseDateDesc();
}
