package com.cardealership.backend.controller;

import com.cardealership.backend.dto.PurchaseRequest;
import com.cardealership.backend.dto.RestockRequest;
import com.cardealership.backend.model.Purchase;
import com.cardealership.backend.model.Vehicle;
import com.cardealership.backend.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable String id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(vehicleService.searchVehicles(q));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> addVehicle(@Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.addVehicle(vehicle));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable String id, @Valid @RequestBody Vehicle vehicle) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVehicle(@PathVariable String id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/purchase")
    public ResponseEntity<Map<String, Object>> purchaseVehicle(
            @PathVariable String id,
            @Valid @RequestBody PurchaseRequest request,
            Principal principal) {
        
        Purchase purchase = vehicleService.purchaseVehicle(id, request.getQuantity(), principal.getName());
        
        // Build response matching frontend expectations
        Map<String, Object> response = new HashMap<>();
        response.put("id", purchase.getId());
        response.put("vehicleId", purchase.getVehicle().getId());
        response.put("vehicleName", purchase.getVehicle().getName());
        response.put("quantity", purchase.getQuantity());
        response.put("priceEach", purchase.getPriceEach());
        response.put("totalPrice", purchase.getTotalPrice());
        response.put("date", purchase.getPurchaseDate().toString());
        response.put("image", purchase.getVehicle().getImage());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vehicle> restockVehicle(
            @PathVariable String id,
            @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(vehicleService.restockVehicle(id, request.getAmount()));
    }
}
