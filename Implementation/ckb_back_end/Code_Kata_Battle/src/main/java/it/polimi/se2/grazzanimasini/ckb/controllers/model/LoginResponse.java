package it.polimi.se2.grazzanimasini.ckb.controllers.model;

public class LoginResponse {

    private String message;
    private String cipheredCommunicationToken;

    public LoginResponse() {
        this.message = "";
        this.cipheredCommunicationToken = "";
    }

    public LoginResponse(String message, String cipheredCommunicationToken) {
        this.message = message;
        this.cipheredCommunicationToken = cipheredCommunicationToken;
    }

    public String getCipheredTokenString() {
        return cipheredCommunicationToken;
    }

    public String getMessage() {
        return message;
    }

    public void setCipheredTokenString(String cipheredTokenCommunicationToken) {
        this.cipheredCommunicationToken = cipheredTokenCommunicationToken;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
