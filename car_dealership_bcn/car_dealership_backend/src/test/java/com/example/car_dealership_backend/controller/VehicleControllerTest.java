package com.example.car_dealership_backend.controller;

import com.example.car_dealership_backend.model.Vehicle;
import com.example.car_dealership_backend.service.VehicleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.net.URI;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;



@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldAddVehicleSuccessfully() {
    }

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
    @WithMockUser(username = "jaymin@gmail.com", roles = {"ADMIN"})
    void addVehicle_AdminUser_Success() throws Exception {
        when(vehicleService.addVehicle(any(Vehicle.class))).thenReturn(testVehicle);

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":\"bmw-m4-competition\",\"name\":\"BMW M4 Competition\",\"model\":\"M4\",\"category\":\"Coupe\",\"year\":2024,\"price\":89900,\"horsepower\":503,\"torque\":479,\"transmission\":\"Automatic\",\"fuel\":\"Gasoline\",\"acceleration\":\"3.8s 0-60mph\",\"topSpeed\":\"180 mph\",\"color\":\"Frozen Black Metallic\",\"stock\":5,\"maxStock\":10,\"image\":\"http://image.com\",\"description\":\"Description\",\"featured\":true}"))
                .andExpect(status().isCreated());
    }


    @Test
    @WithMockUser(username = "jaymin@gmail.com", roles = "ADMIN")
    void shouldReturnAllVehicles() throws Exception {

        List<Vehicle> vehicles = List.of(
                Vehicle.builder()
                        .id("bmw-m4")
                        .name("BMW M4 Competition")
                        .model("M4")
                        .category("Coupe")
                        .price(89900)
                        .stock(5)
                        .build(),

                Vehicle.builder()
                        .id("audi-r8")
                        .name("Audi R8")
                        .model("R8")
                        .category("Sports")
                        .price(150000)
                        .stock(3)
                        .build()
        );

        when(vehicleService.getAllVehicles()).thenReturn(vehicles);

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("BMW M4 Competition"))
                .andExpect(jsonPath("$[0].model").value("M4"))
                .andExpect(jsonPath("$[1].name").value("Audi R8"))
                .andExpect(jsonPath("$[1].model").value("R8"));
    }

    @Test
    @WithMockUser(username = "jaymin@gmail.com", roles = "ADMIN")
    void shouldUpdateVehicleSuccessfully() throws Exception {

        Vehicle updatedVehicle = Vehicle.builder()
                .id("bmw-m4-competition")
                .name("BMW M4 Competition Updated")
                .model("M4 CS")
                .category("Coupe")
                .year(2025)
                .price(95000)
                .stock(8)
                .maxStock(15)
                .image("http://image.com")
                .description("Updated Description")
                .transmission("Automatic")
                .fuel("Gasoline")
                .acceleration("3.5s")
                .topSpeed("190mph")
                .color("Blue")
                .build();

        when(vehicleService.updateVehicle(any(String.class), any(Vehicle.class)))
                .thenReturn(updatedVehicle);

        mockMvc.perform(put(URI.create("/api/vehicles/bmw-m4-competition"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                    {
                      "name":"BMW M4 Competition Updated",
                      "model":"M4 CS",
                      "category":"Coupe",
                      "year":2025,
                      "price":95000,
                      "stock":8,
                      "maxStock":15,
                      "image":"http://image.com",
                      "description":"Updated Description",
                      "transmission":"Automatic",
                      "fuel":"Gasoline",
                      "acceleration":"3.5s",
                      "topSpeed":"190mph",
                      "color":"Blue"
                    }
                    """))
                .andExpect(jsonPath("$.category").value("Coupe"))
                .andExpect(jsonPath("$.year").value(2025))
                .andExpect(jsonPath("$.color").value("Blue"))
                .andExpect(jsonPath("$.transmission").value("Automatic"))
                .andExpect(jsonPath("$.fuel").value("Gasoline"));
    }

    @Test
    @WithMockUser(username = "jaymin@gmail.com", roles = "ADMIN")
    void shouldDeleteVehicleSuccessfully() throws Exception {

        doNothing().when(vehicleService).deleteVehicle("bmw-m4-competition");

        mockMvc.perform(delete("/api/vehicles/bmw-m4-competition"))
                .andExpect(status().isNoContent());

        verify(vehicleService, times(1))
                .deleteVehicle("bmw-m4-competition");
    }
}
