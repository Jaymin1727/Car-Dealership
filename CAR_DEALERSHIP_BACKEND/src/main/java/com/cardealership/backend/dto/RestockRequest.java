package com.cardealership.backend.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class RestockRequest {
    @Min(value = 1, message = "Restock amount must be at least 1")
    private int amount;
}
