package io.saidlaarab.businesslogicserver.domain;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource
public interface CarRepository extends CrudRepository<Car, Long>{
	
	// Define additional methods using some prefix like: findBy+EntityName
	List<Car> findByColor(@Param("color") String color);
//	
	List<Car> findByYear(@Param("year") int year);
//	
//	// Use multiple criteria:
//	List<Car> findByColorAndYear(String color, int year);
//	
//	// Fetch cars by brand and sort by year:
//	public List<Car> findByBrandOrderByYearAsc(String brand);
//	// Fetch using SQL statements:
//	@Query("select c from Car c where c.brand = ?1")
//	List<Car> findByBrand(String brand);
}