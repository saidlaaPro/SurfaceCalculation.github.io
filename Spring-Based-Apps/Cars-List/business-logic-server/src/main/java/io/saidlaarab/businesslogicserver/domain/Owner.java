package io.saidlaarab.businesslogicserver.domain;

import javax.persistence.*;
import java.util.List;

@Entity
public class Owner {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private long ownerId;
	private String firstName, lastName;
	@OneToMany(cascade=CascadeType.ALL, mappedBy="owner")
	
	private List<Car> cars;
	
//	@ManyToMany(cascade=CascadeType.MERGE)
//	@JoinTable(name="car_owner", joinColumns={@JoinColumn(name="ownerId")}, inverseJoinColumns= {@JoinColumn(name="id")})
//	private Set<Car> cars = new HashSet<Car>(0);

	// Constructors:
	public Owner(String firstName, String lastName) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
	}
	
	public Owner() {
		
	}

	// Setters and Getters:
	public List<Car> getCars() {
		return cars;
	}

	public void setCars(List<Car> cars) {
		this.cars = cars;
	}
	
	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

}
