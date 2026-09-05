package com.solestyle.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.solestyle.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}