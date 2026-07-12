package com.example.car_dealership_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int horsepower;

    @Column(nullable = false)
    private int torque;

    @Column(nullable = false)
    private String transmission;

    @Column(nullable = false)
    private String fuel;

    @Column(nullable = false)
    private String acceleration;

    @Column(nullable = false)
    private String topSpeed;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private int stock;

    @Column(name = "max_stock", nullable = false)
    private int maxStock;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String image;

    @Column(nullable = false, length = 2048)
    private String description;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "tags")
    private String tags;
}
