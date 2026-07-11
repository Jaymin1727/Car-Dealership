package com.cardealership.backend.service;

import com.cardealership.backend.model.Purchase;
import com.cardealership.backend.model.Role;
import com.cardealership.backend.model.User;
import com.cardealership.backend.model.Vehicle;
import com.cardealership.backend.repository.PurchaseRepository;
import com.cardealership.backend.repository.UserRepository;
import com.cardealership.backend.repository.VehicleRepository;
import com.cardealership.backend.exception.BadRequestException;
import com.cardealership.backend.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private PurchaseRepository purchaseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle testVehicle;
    private User testUser;

    @BeforeEach
    void setUp() {
        testVehicle = Vehicle.builder()
                .id("bmw-m4-competition")
                .name("BMW M4 Competition")
                .model("M4")
                .category("Coupe")
                .year(2024)
                .price(89900)
                .stock(5)
                .maxStock(10)
                .image("http://image.com")
                .description("Desc")
                .build();

        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .role(Role.USER)
                .build();
    }

    @Test
    void purchaseVehicle_Success() {
        when(vehicleRepository.findById("bmw-m4-competition")).thenReturn(Optional.of(testVehicle));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(purchaseRepository.save(any(Purchase.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Purchase purchase = vehicleService.purchaseVehicle("bmw-m4-competition", 2, "test@example.com");

        assertNotNull(purchase);
        assertEquals(3, testVehicle.getStock()); // Deducted from 5
        assertEquals(179800.0, purchase.getTotalPrice());
        verify(vehicleRepository, times(1)).save(testVehicle);
    }

    @Test
    void purchaseVehicle_InsufficientStock_ThrowsException() {
        when(vehicleRepository.findById("bmw-m4-competition")).thenReturn(Optional.of(testVehicle));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(BadRequestException.class, () -> 
            vehicleService.purchaseVehicle("bmw-m4-competition", 10, "test@example.com")
        );
        verify(purchaseRepository, never()).save(any());
    }

    @Test
    void restockVehicle_Success() {
        when(vehicleRepository.findById("bmw-m4-competition")).thenReturn(Optional.of(testVehicle));
        when(vehicleRepository.save(any())).thenReturn(testVehicle);

        Vehicle restocked = vehicleService.restockVehicle("bmw-m4-competition", 5);

        assertNotNull(restocked);
        assertEquals(10, restocked.getStock()); // 5 + 5
    }
}
