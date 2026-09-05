package com.solestyle.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.solestyle.entity.Cart;
import com.solestyle.entity.CartItem;
import com.solestyle.entity.Product;
import com.solestyle.entity.User;
import com.solestyle.repository.CartItemRepository;
import com.solestyle.repository.CartRepository;
import com.solestyle.repository.ProductRepository;
import com.solestyle.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Cart addToCart(
            Long userId,
            Long productId,
            int quantity,
            String size) {

        User user = userRepository.findById(userId).orElse(null);
        Product product = productRepository.findById(productId).orElse(null);

        if (user == null || product == null) {
            return null;
        }

        Cart cart = cartRepository.findByUser(user);

        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setItems(new ArrayList<>());

            cartRepository.save(cart);
        }

        CartItem cartItem = new CartItem();

        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem.setSize(size);

        cart.getItems().add(cartItem);

        cartItemRepository.save(cartItem);
        cartRepository.save(cart);

        return cart;
    }

    public Cart getCartByUser(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        return cartRepository.findByUser(user);
    }

    public Cart updateCartItem(Long cartItemId, int quantity) {

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElse(null);

        if (cartItem == null) {
            return null;
        }

        if (quantity <= 0) {
            Cart cart = cartItem.getCart();

            cartItemRepository.delete(cartItem);

            if (cart != null) {
                cart.getItems().remove(cartItem);
                cartRepository.save(cart);
            }

            return cart;
        }

        Product product = cartItem.getProduct();

        if (quantity > product.getStock()) {
            quantity = product.getStock();
        }

        cartItem.setQuantity(quantity);

        cartItemRepository.save(cartItem);

        return cartItem.getCart();
    }

    public void removeCartItem(Long cartItemId) {

        CartItem cartItem = cartItemRepository
                .findById(cartItemId)
                .orElse(null);

        if (cartItem != null) {

            Cart cart = cartItem.getCart();

            cartItemRepository.delete(cartItem);

            if (cart != null) {
                cart.getItems().remove(cartItem);
                cartRepository.save(cart);
            }
        }
    }

    public void clearCart(Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return;
        }

        Cart cart = cartRepository.findByUser(user);

        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}