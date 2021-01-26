package io.saidlaarab.authenticationserver.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    private String username;

    private String password;

    // the default constructor is necessary for the JPA entity...
    // (it's by default added, no need to add it)

    // Getters and Setters:

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
