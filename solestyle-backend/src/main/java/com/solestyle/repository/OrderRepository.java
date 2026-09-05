package com.solestyle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.Order;
import com.solestyle.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}