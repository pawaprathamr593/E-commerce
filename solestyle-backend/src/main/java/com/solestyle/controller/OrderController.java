package com.solestyle.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solestyle.entity.Order;
import com.solestyle.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create order from cart
    @PostMapping("/create/{userId}")
    public Order createOrder(
            @PathVariable Long userId,
            @RequestBody Order orderDetails) {

        return orderService.createOrder(userId, orderDetails);
    }

    // Get all orders of a particular user
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {

        return orderService.getUserOrders(userId);
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {

        return orderService.getOrderById(orderId);
    }

    // Admin: Get all orders
    @GetMapping
    public List<Order> getAllOrders() {

        return orderService.getAllOrders();
    }

    // Admin: Update order status
    @PutMapping("/{orderId}/status")
    public Order updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {

        return orderService.updateOrderStatus(orderId, status);
    }
}