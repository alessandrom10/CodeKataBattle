package it.polimi.se2.grazzanimasini.ckb.controllers.model;

public class Credentials {

    private String email;
    private String password;

    public Credentials() {
        this.email = "";
        this.password = "";
    }

    public Credentials(String email, String password) {
        this.email = email;
        this.password = password;
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

}
