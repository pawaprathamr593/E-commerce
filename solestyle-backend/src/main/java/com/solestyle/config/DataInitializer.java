package com.solestyle.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.solestyle.entity.Category;
import com.solestyle.entity.Product;
import com.solestyle.entity.User;
import com.solestyle.repository.CategoryRepository;
import com.solestyle.repository.ProductRepository;
import com.solestyle.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        return args -> {

            // -----------------------------------------
            // Categories
            // -----------------------------------------

            Category sneakers = categoryRepository.findAll()
                    .stream()
                    .filter(category -> category.getName().equalsIgnoreCase("Sneakers"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category category = new Category();
                        category.setName("Sneakers");
                        return categoryRepository.save(category);
                    });

            Category running = categoryRepository.findAll()
                    .stream()
                    .filter(category -> category.getName().equalsIgnoreCase("Running"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category category = new Category();
                        category.setName("Running");
                        return categoryRepository.save(category);
                    });

            Category sports = categoryRepository.findAll()
                    .stream()
                    .filter(category -> category.getName().equalsIgnoreCase("Sports"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category category = new Category();
                        category.setName("Sports");
                        return categoryRepository.save(category);
                    });

            Category formal = categoryRepository.findAll()
                    .stream()
                    .filter(category -> category.getName().equalsIgnoreCase("Formal"))
                    .findFirst()
                    .orElseGet(() -> {
                        Category category = new Category();
                        category.setName("Formal");
                        return categoryRepository.save(category);
                    });

            // -----------------------------------------
            // Admin User
            // -----------------------------------------

            if (userRepository.findByEmail("admin@solestyle.com") == null) {

                User admin = new User();

                admin.setName("SoleStyle Admin");
                admin.setEmail("admin@solestyle.com");
                admin.setPassword("admin123");
                admin.setRole("ADMIN");

                userRepository.save(admin);
            }

            // -----------------------------------------
            // Sample Products
            // -----------------------------------------

            if (productRepository.count() == 0) {

                Product p1 = new Product();
                p1.setName("Air Max Street");
                p1.setDescription(
                        "Modern everyday sneakers with a comfortable cushioned sole."
                );
                p1.setPrice(4999);
                p1.setStock(25);
                p1.setImageUrl(
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                );
                p1.setBrand("Nike");
                p1.setGender("Men");
                p1.setSizes("7,8,9,10,11");
                p1.setCategory(sneakers);

                productRepository.save(p1);

                Product p2 = new Product();
                p2.setName("Cloud Runner");
                p2.setDescription(
                        "Lightweight running shoes designed for daily training."
                );
                p2.setPrice(5999);
                p2.setStock(20);
                p2.setImageUrl(
                        "https://images.unsplash.com/photo-1552346154-21d32810aba3"
                );
                p2.setBrand("Adidas");
                p2.setGender("Women");
                p2.setSizes("6,7,8,9,10");
                p2.setCategory(running);

                productRepository.save(p2);

                Product p3 = new Product();
                p3.setName("Velocity Pro");
                p3.setDescription(
                        "Performance sports shoes with a lightweight construction."
                );
                p3.setPrice(4499);
                p3.setStock(30);
                p3.setImageUrl(
                        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
                );
                p3.setBrand("Puma");
                p3.setGender("Men");
                p3.setSizes("7,8,9,10,11");
                p3.setCategory(sports);

                productRepository.save(p3);

                Product p4 = new Product();
                p4.setName("Classic Leather");
                p4.setDescription(
                        "Clean and elegant leather shoes suitable for formal occasions."
                );
                p4.setPrice(3999);
                p4.setStock(15);
                p4.setImageUrl(
                        "https://images.unsplash.com/photo-1549298916-b41d501d3772"
                );
                p4.setBrand("Clarks");
                p4.setGender("Men");
                p4.setSizes("7,8,9,10");
                p4.setCategory(formal);

                productRepository.save(p4);

                Product p5 = new Product();
                p5.setName("Street Flex");
                p5.setDescription(
                        "Stylish casual sneakers built for everyday comfort."
                );
                p5.setPrice(3499);
                p5.setStock(35);
                p5.setImageUrl(
                        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
                );
                p5.setBrand("Nike");
                p5.setGender("Women");
                p5.setSizes("6,7,8,9");
                p5.setCategory(sneakers);

                productRepository.save(p5);

                Product p6 = new Product();
                p6.setName("Run Ultra");
                p6.setDescription(
                        "Responsive running shoes for long-distance comfort."
                );
                p6.setPrice(6499);
                p6.setStock(18);
                p6.setImageUrl(
                        "https://images.unsplash.com/photo-1539185441755-769473a23570"
                );
                p6.setBrand("Asics");
                p6.setGender("Unisex");
                p6.setSizes("7,8,9,10,11");
                p6.setCategory(running);

                productRepository.save(p6);

                System.out.println("SoleStyle sample products created successfully.");
            }
        };
    }
}