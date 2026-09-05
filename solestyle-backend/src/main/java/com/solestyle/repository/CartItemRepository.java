package com.solestyle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}