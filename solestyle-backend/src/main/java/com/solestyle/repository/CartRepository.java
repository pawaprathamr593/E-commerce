package com.solestyle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.Cart;
import com.solestyle.entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findByUser(User user);
}