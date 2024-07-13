package it.polimi.se2.grazzanimasini.ckb.database.model;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserInput;

import java.util.UUID;

public class User {
    private UUID uuid;
    private String email;
    private String password;
    private String username;
    private String phoneNumber;
    private String calendarId;

    public User(UUID uuid, String email, String password, String username, String phoneNumber, String calendarId) {
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.calendarId = calendarId;
    }

    public User(UserInput userInput) {
        this.uuid = UUID.randomUUID();
        this.email = userInput.getEmail();
        this.password = userInput.getPassword();
        this.username = userInput.getUsername();
        this.phoneNumber = userInput.getPhoneNumber();
        this.calendarId = userInput.getCalendarId();
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(String calendarId) {
        this.calendarId = calendarId;
    }
}
