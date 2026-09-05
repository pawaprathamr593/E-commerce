package com.solestyle.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.razorpay.Order;
import com.solestyle.service.OrderService;
import com.solestyle.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    public PaymentController(
            PaymentService paymentService,
            OrderService orderService) {

        this.paymentService = paymentService;
        this.orderService = orderService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createPaymentOrder(
            @RequestParam Long orderId) {

        try {
            com.solestyle.entity.Order shopOrder =
                    orderService.getOrderById(orderId);

            if (shopOrder == null) {
                Map<String, Object> response = new HashMap<>();

                response.put("success", false);
                response.put("message", "Order not found");

                return ResponseEntity.badRequest().body(response);
            }

            Order razorpayOrder =
                    paymentService.createRazorpayOrder(
                            shopOrder.getTotalAmount());

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("orderId", shopOrder.getId());
            response.put("razorpayOrderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("razorpayKeyId", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", "Unable to create payment order");

            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(
            @RequestParam Long orderId,
            @RequestParam String razorpayOrderId,
            @RequestParam String razorpayPaymentId,
            @RequestParam String razorpaySignature) {

        try {
            boolean verified = paymentService.verifyPayment(
                    orderId,
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
            );

            Map<String, Object> response = new HashMap<>();

            if (verified) {
                response.put("success", true);
                response.put(
                        "message",
                        "Payment verified successfully"
                );

                return ResponseEntity.ok(response);
            }

            response.put("success", false);
            response.put(
                    "message",
                    "Payment verification failed"
            );

            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {

            e.printStackTrace();

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put(
                    "message",
                    "Error while verifying payment"
            );

            return ResponseEntity.internalServerError().body(response);
        }
    }
}