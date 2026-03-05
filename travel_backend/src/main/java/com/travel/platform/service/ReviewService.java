package com.travel.platform.service;

import com.travel.platform.model.Review;
import com.travel.platform.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private DestinationService destinationService;
    
    public Review saveReview(Review review) {
        if (review.getDestinationName() == null && review.getDestinationId() != null) {
            destinationService.getDestinationById(review.getDestinationId())
                .ifPresent(destination -> review.setDestinationName(destination.getName()));
        }
        Review savedReview = reviewRepository.save(review);
        updateDestinationRating(review.getDestinationId());
        return savedReview;
    }
    
    public List<Review> getReviewsByDestination(Long destinationId) {
        return reviewRepository.findByDestinationId(destinationId);
    }
    
    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id).orElse(null);
        if (review != null) {
            Long destinationId = review.getDestinationId();
            reviewRepository.deleteById(id);
            updateDestinationRating(destinationId);
        }
    }
    
    private void updateDestinationRating(Long destinationId) {
        List<Review> reviews = reviewRepository.findByDestinationId(destinationId);
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            destinationService.updateDestinationRating(destinationId, avgRating, reviews.size());
        } else {
            destinationService.updateDestinationRating(destinationId, 0.0, 0);
        }
    }
}