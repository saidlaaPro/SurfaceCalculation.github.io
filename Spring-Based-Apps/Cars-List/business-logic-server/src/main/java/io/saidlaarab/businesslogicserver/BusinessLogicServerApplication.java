package io.saidlaarab.businesslogicserver;

import io.saidlaarab.businesslogicserver.domain.Car;
import io.saidlaarab.businesslogicserver.domain.CarRepository;
import io.saidlaarab.businesslogicserver.domain.Owner;
import io.saidlaarab.businesslogicserver.domain.OwnerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BusinessLogicServerApplication extends SpringBootServletInitializer {
	// Create a logger for this class:
	private static final Logger logger = LoggerFactory.getLogger(BusinessLogicServerApplication.class);

	@Autowired
	private CarRepository carRepository;
	@Autowired
	private OwnerRepository ownerRepository;

	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

	public static void main(String[] args) {

		SpringApplication.run(BusinessLogicServerApplication.class, args);
		logger.info("Your Spring Boot Application has started successfully...");
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(BusinessLogicServerApplication.class);
	}

	@Bean
	CommandLineRunner runner() {
		return args -> {
			// Save some demo data to the database:
			Owner owner1 = new Owner("Youssef", "Harb");
			Owner owner2 = new Owner("Said", "Khoder");
			Owner owner3 = new Owner("Mohammed", "Ali");
			Owner owner4 = new Owner("Ahmed", "Montassir");
			ownerRepository.save(owner1);
			ownerRepository.save(owner2);
			ownerRepository.save(owner3);
			ownerRepository.save(owner4);

			// Add some cars:
			carRepository.save(new Car("Ford", "Mustang", "Red", "ADF-1121", 2017, 95000, owner1));
			carRepository.save(new Car("Nissan", "Leaf", "White", "SSJ-3002", 2014, 29000, owner2));
			carRepository.save(new Car("Toyota", "Prios", "Silver", "KKO-0212", 2018, 39000,owner1));
			carRepository.save(new Car("Wolkswagen", "Golf6", "Black", "KKO-0212", 2017, 25000,owner4));
			carRepository.save(new Car("Nissan", "Leaf", "White", "SSJ-3002", 2014, 29000, owner3));

		};
	}

}
