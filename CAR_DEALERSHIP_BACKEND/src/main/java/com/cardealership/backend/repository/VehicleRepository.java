package com.cardealership.backend.repository;

import com.cardealership.backend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    
    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.fuel) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Vehicle> searchVehicles(@Param("query") String query);

    List<Vehicle> findByCategory(String category);
}
