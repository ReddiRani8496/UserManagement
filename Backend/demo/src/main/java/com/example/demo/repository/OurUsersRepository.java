package com.example.demo.repository;

import com.example.demo.entity.OurUsers;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OurUsersRepository extends MongoRepository<OurUsers,String> {
    Optional<OurUsers> findByEmail(String email);
}
