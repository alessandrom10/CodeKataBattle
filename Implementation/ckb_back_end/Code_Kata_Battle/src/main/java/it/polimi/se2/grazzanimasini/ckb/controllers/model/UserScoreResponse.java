package it.polimi.se2.grazzanimasini.ckb.controllers.model;

public class UserScoreResponse {

    private String email;
    private int score;

    public UserScoreResponse(String email, int score) {
        this.email = email;
        this.score = score;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
