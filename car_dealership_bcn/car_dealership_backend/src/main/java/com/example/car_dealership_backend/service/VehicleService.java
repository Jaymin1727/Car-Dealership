package com.example.car_dealership_backend.service;

import com.example.car_dealership_backend.exception.ResourceNotFoundException;
import com.example.car_dealership_backend.model.Purchase;
import com.example.car_dealership_backend.model.User;
import com.example.car_dealership_backend.model.Vehicle;
import com.example.car_dealership_backend.repository.PurchaseRepository;
import com.example.car_dealership_backend.repository.UserRepository;
import com.example.car_dealership_backend.repository.VehicleRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;

    public VehicleService(VehicleRepository vehicleRepository,
                          PurchaseRepository purchaseRepository,
                          UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(String id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with ID: " + id));
    }

    public List<Vehicle> searchVehicles(String query) {
        return vehicleRepository.searchVehicles(query);
    }

    @Transactional
    public Vehicle addVehicle(Vehicle vehicle) throws BadRequestException {
        if (vehicle.getId() == null || vehicle.getId().trim().isEmpty()) {
            vehicle.setId("vehicle-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (vehicleRepository.existsById(vehicle.getId())) {
            throw new BadRequestException("Vehicle with this ID already exists.");
        }
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public Vehicle updateVehicle(String id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);

        vehicle.setName(vehicleDetails.getName());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setCategory(vehicleDetails.getCategory());
        vehicle.setYear(vehicleDetails.getYear());
        vehicle.setPrice(vehicleDetails.getPrice());
        vehicle.setHorsepower(vehicleDetails.getHorsepower());
        vehicle.setTorque(vehicleDetails.getTorque());
        vehicle.setTransmission(vehicleDetails.getTransmission());
        vehicle.setFuel(vehicleDetails.getFuel());
        vehicle.setAcceleration(vehicleDetails.getAcceleration());
        vehicle.setTopSpeed(vehicleDetails.getTopSpeed());
        vehicle.setColor(vehicleDetails.getColor());
        vehicle.setStock(vehicleDetails.getStock());
        vehicle.setMaxStock(vehicleDetails.getMaxStock());
        vehicle.setImage(vehicleDetails.getImage());
        vehicle.setDescription(vehicleDetails.getDescription());
        vehicle.setFeatured(vehicleDetails.isFeatured());
        vehicle.setTags(vehicleDetails.getTags());

        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(String id) {
        Vehicle vehicle = getVehicleById(id);
        purchaseRepository.deleteByVehicle(vehicle);
        vehicleRepository.delete(vehicle);
    }

    @Transactional
    public Purchase purchaseVehicle(String id, int quantity, String userEmail) throws BadRequestException {
        Vehicle vehicle = getVehicleById(id);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        if (vehicle.getStock() < quantity) {
            throw new BadRequestException("Insufficient stock. Only " + vehicle.getStock() + " available.");
        }

        vehicle.setStock(vehicle.getStock() - quantity);
        vehicleRepository.save(vehicle);

        double totalPrice = vehicle.getPrice() * quantity;
        Purchase purchase = Purchase.builder()
                .user(user)
                .vehicle(vehicle)
                .quantity(quantity)
                .priceEach(vehicle.getPrice())
                .totalPrice(totalPrice)
                .build();

        return purchaseRepository.save(purchase);
    }

    @Transactional
    public Vehicle restockVehicle(String id, int amount) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStock(vehicle.getStock() + amount);
        return vehicleRepository.save(vehicle);
    }
}
