package com.solestyle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}