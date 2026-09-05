package com.solestyle.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.solestyle.entity.Cart;
import com.solestyle.entity.CartItem;
import com.solestyle.entity.Order;
import com.solestyle.entity.OrderItem;
import com.solestyle.entity.User;
import com.solestyle.repository.CartRepository;
import com.solestyle.repository.OrderRepository;
import com.solestyle.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    // Create order from user's cart
    public Order createOrder(Long userId, Order orderDetails) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        Cart cart = cartRepository.findByUser(user);

        if (cart == null || cart.getItems().isEmpty()) {
            return null;
        }

        Order order = new Order();

        order.setUser(user);

        // Customer / delivery details
        order.setCustomerName(orderDetails.getCustomerName());
        order.setCustomerEmail(orderDetails.getCustomerEmail());
        order.setPhone(orderDetails.getPhone());
        order.setAddress(orderDetails.getAddress());
        order.setCity(orderDetails.getCity());
        order.setState(orderDetails.getState());
        order.setPincode(orderDetails.getPincode());

        // Order status
        order.setStatus("PENDING");
        order.setPaymentStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        double subtotal = 0;

        List<OrderItem> orderItems = new ArrayList<>();

        // Convert cart items to order items
        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());

            double itemPrice = cartItem.getProduct().getPrice();

            orderItem.setPrice(itemPrice);

            subtotal += itemPrice * cartItem.getQuantity();

            orderItems.add(orderItem);
        }

        // Delivery charge
        double deliveryCharge = 0;

        if (subtotal > 0 && subtotal <= 999) {
            deliveryCharge = 99;
        }

        // Final amount
        double totalAmount = subtotal + deliveryCharge;

        order.setTotalAmount(totalAmount);

        // Attach order items
        order.setItems(orderItems);

        // Cascade will save OrderItems automatically
        Order savedOrder = orderRepository.save(order);

        // Cart remains unchanged until payment succeeds
        return savedOrder;
    }

    // Get all orders of a particular user
    public List<Order> getUserOrders(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return new ArrayList<>();
        }

        return orderRepository.findByUser(user);
    }

    // Get order by ID
    public Order getOrderById(Long orderId) {

        return orderRepository.findById(orderId).orElse(null);
    }

    // Admin: Get all orders
    public List<Order> getAllOrders() {

        return orderRepository.findAll();
    }

    // Admin: Update order status
    public Order updateOrderStatus(Long orderId, String status) {

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order != null) {
            order.setStatus(status);

            return orderRepository.save(order);
        }

        return null;
    }
}