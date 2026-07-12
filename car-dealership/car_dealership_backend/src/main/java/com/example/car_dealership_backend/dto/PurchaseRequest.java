package com.example.car_dealership_backend.dto;


import jakarta.validation.constraints.Min;
import lombok.Data;


@Data
public class PurchaseRequest {
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
