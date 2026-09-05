package com.solestyle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}