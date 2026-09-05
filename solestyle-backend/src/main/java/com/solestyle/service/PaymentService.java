package com.solestyle.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.RazorpayClient;
import com.solestyle.entity.Cart;
import com.solestyle.entity.Order;
import com.solestyle.repository.CartRepository;
import com.solestyle.repository.OrderRepository;
import com.razorpay.Utils;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(
            @Value("${razorpay.key.id}") String keyId,
            @Value("${razorpay.key.secret}") String keySecret,
            OrderRepository orderRepository,
            CartRepository cartRepository) throws Exception {

        this.razorpayClient = new RazorpayClient(keyId, keySecret);
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    public com.razorpay.Order createRazorpayOrder(double amount) throws Exception {

        JSONObject orderRequest = new JSONObject();

        orderRequest.put("amount", (int) (amount * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put(
                "receipt",
                "receipt_" + System.currentTimeMillis()
        );

        return razorpayClient.orders.create(orderRequest);
    }

    public boolean verifyPayment(
            Long orderId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) throws Exception {

        JSONObject attributes = new JSONObject();

        attributes.put("razorpay_order_id", razorpayOrderId);
        attributes.put("razorpay_payment_id", razorpayPaymentId);
        attributes.put("razorpay_signature", razorpaySignature);

        boolean isValid = Utils.verifyPaymentSignature(
                attributes,
                razorpayKeySecret
        );

        if (!isValid) {
            return false;
        }

        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return false;
        }

        order.setRazorpayOrderId(razorpayOrderId);
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setPaymentStatus("PAID");
        order.setStatus("PAID");

        orderRepository.save(order);

        // Clear cart only after successful payment
        Cart cart = cartRepository.findByUser(order.getUser());

        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }

        return true;
    }
}