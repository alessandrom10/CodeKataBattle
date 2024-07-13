package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.Credentials;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.LoginResponse;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserInput;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import it.polimi.se2.grazzanimasini.ckb.managers.AccountManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@CrossOrigin
@RestController
public class AccountController {

    private AccountManager accountManager;

    @Autowired
    public AccountController(AccountManager accountManager) {
        this.accountManager = accountManager;
    }

    @PostMapping(path="/api/accountInterface/register", consumes = "application/json")
    public boolean register(@RequestBody UserInput userInput) {
        return accountManager.register(userInput);
    }

    @GetMapping(path="/api/accountInterface/getMyUser", produces = "application/json")
    public User getMyUser(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return accountManager.getMyUser(authorizationHeader);
    }

    //this function like any other defined in a controller, define how the correct request for that specific data should be,
    //in this case it asks for a get call at the ip of the server followed by "/api/accountInterface/getUsersSubscribedToTournament"
    //and having the header "Authorization" containing the authorization header (which contains the token) and the
    //tournament Uuid requested, then it returns (mapped in json) the list of users required
    @GetMapping(path="/api/accountInterface/getUsersSubscribedToTournament", produces = "application/json")
    public List<User> getUsersSubscribedToTournament(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                     @RequestHeader(value = "tournamentUuid") String tournamentUuid) {

        return accountManager.getUsersSubscribedToTournament(authorizationHeader, tournamentUuid);
    }

    @GetMapping(path="/api/accountInterface/getUsersEnrolledInBattle", produces = "application/json")
    public List<User> getUsersEnrolledInBattle(@RequestHeader(value = "Authorization") String authorizationHeader,
                                               @RequestHeader(value = "battleUuid") String battleUuid) {

        return accountManager.getUsersEnrolledInBattle(authorizationHeader, battleUuid);
    }

    @PostMapping(path="/api/accountInterface/login", consumes = "application/json", produces = "application/json")
    public LoginResponse login(@RequestBody Credentials credentials) {
        return accountManager.login(credentials);
    }

    @GetMapping(path="/api/accountInterface/isAcceptedToken", produces = "application/json")
    public Boolean isAcceptedToken(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return accountManager.isAcceptedHeader(authorizationHeader);
    }

    /*@PutMapping(path="/api/accountInterface/updateValue", consumes="application/json")
    public boolean updateValue( @RequestHeader(value = "Authorization") String authorizationHeader,
                                @RequestBody DataUpdate dataUpdate) throws SQLException, IOException {

        return accountManager.updateValue(authorizationHeader, dataUpdate);
    }*/
}
