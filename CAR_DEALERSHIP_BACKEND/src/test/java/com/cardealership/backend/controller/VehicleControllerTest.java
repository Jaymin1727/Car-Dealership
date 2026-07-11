package com.cardealership.backend.controller;

import com.cardealership.backend.model.Vehicle;
import com.cardealership.backend.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import java.util.Collections;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    private Vehicle testVehicle;

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
                .transmission("Automatic")
                .fuel("Gasoline")
                .acceleration("3.8s")
                .topSpeed("180mph")
                .color("Black")
                .build();
    }

    @Test
    void getAllVehicles_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isForbidden()); // Spring Security denies entry
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void getAllVehicles_Authenticated_Success() throws Exception {
        when(vehicleService.getAllVehicles()).thenReturn(Collections.singletonList(testVehicle));

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user@example.com", roles = {"USER"})
    void addVehicle_StandardUser_ReturnsForbidden() throws Exception {
        mockMvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin@example.com", roles = {"ADMIN"})
    void addVehicle_AdminUser_Success() throws Exception {
        when(vehicleService.addVehicle(any(Vehicle.class))).thenReturn(testVehicle);

        mockMvc.perform(post("/api/vehicles")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"bmw-m4-competition\",\"name\":\"BMW M4 Competition\",\"model\":\"M4\",\"category\":\"Coupe\",\"year\":2024,\"price\":89900,\"horsepower\":503,\"torque\":479,\"transmission\":\"Automatic\",\"fuel\":\"Gasoline\",\"acceleration\":\"3.8s 0-60mph\",\"topSpeed\":\"180 mph\",\"color\":\"Frozen Black Metallic\",\"stock\":5,\"maxStock\":10,\"image\":\"http://image.com\",\"description\":\"Description\",\"featured\":true}"))
                .andExpect(status().isCreated());
    }
}
