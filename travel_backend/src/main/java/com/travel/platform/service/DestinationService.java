package com.travel.platform.service;

import com.travel.platform.model.Destination;
import com.travel.platform.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }
    
    public Optional<Destination> getDestinationById(Long id) {
        return destinationRepository.findById(id);
    }
    
    public Destination saveDestination(Destination destination) {
        return destinationRepository.save(destination);
    }
    
    public List<Destination> searchDestinations(String query) {
        return destinationRepository.findByNameContainingIgnoreCase(query);
    }
    
    public List<Destination> getTopRatedDestinations() {
        return destinationRepository.findTop5ByOrderByAverageRatingDesc();
    }
    
    public List<Destination> getDestinationsByCategory(String category) {
        return destinationRepository.findByCategory(category);
    }
    
    public void updateDestinationRating(Long destinationId, Double newRating, Integer reviewCount) {
        Optional<Destination> dest = destinationRepository.findById(destinationId);
        if (dest.isPresent()) {
            Destination destination = dest.get();
            destination.setAverageRating(newRating);
            destination.setReviewCount(reviewCount);
            destinationRepository.save(destination);
        }
    }
}