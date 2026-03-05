package com.travel.platform.config;

import com.travel.platform.model.Destination;
import com.travel.platform.model.User;
import com.travel.platform.repository.DestinationRepository;
import com.travel.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Override
    public void run(String... args) throws Exception {
        User admin = new User("admin", "admin@travel.com", "admin123");
        admin.setRole("ADMIN");
        userRepository.save(admin);
        Destination paris = new Destination("Paris", "France", "City of Light with iconic Eiffel Tower");
        paris.setImageUrl("https://images.unsplash.com/photo-1431274172761-fca41d930114?w=400&h=300&fit=crop");
        paris.setCategory("City");
        paris.setBestTimeToVisit("April-June, September-October");
        paris.setDuration("3-5 days");
        paris.setBudget("₹12,000-25,000/day");
        destinationRepository.save(paris);
        
        Destination tokyo = new Destination("Tokyo", "Japan", "Modern metropolis with rich culture");
        tokyo.setImageUrl("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop");
        tokyo.setCategory("City");
        tokyo.setBestTimeToVisit("March-May, September-November");
        tokyo.setDuration("4-7 days");
        tokyo.setBudget("₹10,000-20,000/day");
        destinationRepository.save(tokyo);
        
        Destination bali = new Destination("Bali", "Indonesia", "Tropical paradise with beautiful beaches");
        bali.setImageUrl("https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop");
        bali.setCategory("Beach");
        bali.setBestTimeToVisit("April-October");
        bali.setDuration("5-10 days");
        bali.setBudget("₹4,000-12,000/day");
        destinationRepository.save(bali);
        
        Destination london = new Destination("London", "United Kingdom", "Historic city with royal palaces and museums");
        london.setImageUrl("https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop");
        london.setCategory("City");
        london.setBestTimeToVisit("May-September");
        london.setDuration("3-6 days");
        london.setBudget("₹15,000-30,000/day");
        destinationRepository.save(london);
        
        Destination dubai = new Destination("Dubai", "UAE", "Futuristic city with luxury shopping and ultramodern architecture");
        dubai.setImageUrl("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop");
        dubai.setCategory("Luxury");
        dubai.setBestTimeToVisit("November-March");
        dubai.setDuration("3-5 days");
        dubai.setBudget("₹16,000-40,000/day");
        destinationRepository.save(dubai);
        
        Destination santorini = new Destination("Santorini", "Greece", "Stunning Greek island with white buildings and blue domes");
        santorini.setImageUrl("https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop");
        santorini.setCategory("Island");
        santorini.setBestTimeToVisit("April-October");
        santorini.setDuration("3-5 days");
        santorini.setBudget("₹8,000-20,000/day");
        destinationRepository.save(santorini);
        
        Destination maldives = new Destination("Maldives", "Maldives", "Tropical paradise with crystal clear waters and overwater bungalows");
        maldives.setImageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop");
        maldives.setCategory("Beach");
        maldives.setBestTimeToVisit("November-April");
        maldives.setDuration("5-7 days");
        maldives.setBudget("₹25,000-65,000/day");
        destinationRepository.save(maldives);
        
        Destination iceland = new Destination("Iceland", "Iceland", "Land of fire and ice with stunning waterfalls and northern lights");
        iceland.setImageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop");
        iceland.setCategory("Nature");
        iceland.setBestTimeToVisit("June-August");
        iceland.setDuration("7-10 days");
        iceland.setBudget("₹12,000-25,000/day");
        destinationRepository.save(iceland);
        
        Destination newyork = new Destination("New York", "USA", "The city that never sleeps with iconic skyline and Broadway shows");
        newyork.setImageUrl("https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop");
        newyork.setCategory("City");
        newyork.setBestTimeToVisit("April-June, September-November");
        newyork.setDuration("4-6 days");
        newyork.setBudget("₹16,000-33,000/day");
        destinationRepository.save(newyork);
    }
}