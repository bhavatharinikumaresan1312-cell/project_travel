package com.travel.platform.repository;

import com.travel.platform.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByCountryContainingIgnoreCase(String country);
    List<Destination> findByNameContainingIgnoreCase(String name);
    List<Destination> findByCategory(String category);
    List<Destination> findTop5ByOrderByAverageRatingDesc();
}