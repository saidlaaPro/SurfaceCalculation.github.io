package io.saidlaarab.businesslogicserver.controllers;

import io.saidlaarab.businesslogicserver.domain.Car;
import io.saidlaarab.businesslogicserver.domain.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CarController {
	@Autowired
	private CarRepository carRepository;

	@GetMapping("/cars")
	public Iterable<Car> getCars(){
		return carRepository.findAll();
	}

	@GetMapping("/hello")
	public String hello(){
		return "Hello!";
	}
}
