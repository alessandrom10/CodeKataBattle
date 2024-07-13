package it.polimi.se2.grazzanimasini.ckb.managers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.LoginResponse;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserInput;
import it.polimi.se2.grazzanimasini.ckb.database.UserData;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.Credentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@Service
public class AccountManager {
    @Value("${serverName}")
    private String serverName;
    @Value("${tokenHoursLifetime}")
    private int tokenHoursLifetime;
    private Algorithm cipheringAlgorithm;
    private JWTVerifier jwtVerifier;
    private UserData userData;

    //in this constructor we create a JWTVerifier that checks whether our token has our "serverName" and we use as
    //chiphering algorithm the HMAC256 with "secret" as our secret word (just as an example)
    @Autowired
    public AccountManager( @Value("${serverName}") String serverName, UserData userData) {
        this.cipheringAlgorithm = Algorithm.HMAC256("secret");

        this.jwtVerifier = JWT.require(cipheringAlgorithm)
                              .withIssuer(serverName)
                              .build();

        this.userData = userData;
    }

    public boolean register(UserInput userInput) {
        try {
            userData.insertUser(new User(userInput));
            return true;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error registering the user");
        }
    }

    //this function returns a list of all the users in the db, this function, like any other function that returns users
    //set to "" their password before sending it out, this way the password of our users can't be extracted so easily
    public List<User> getUsers(String authorizationHeader) {
        if (isAcceptedHeader(authorizationHeader)) {
            List<User> list = userData.getUsers();
            for (User user : list) {
                user.setPassword("");
            }
            return list;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function (like all the ones with my in their name) will extract who is the user calling the server from the
    //username in their token, and from there return them custom data, in this case this function will return them their
    //specific user data
    public User getMyUser(String authorizationHeader) {
        if (isAcceptedHeader(authorizationHeader)) {
            String chipheredToken = getTokenFromHeader(authorizationHeader);
            String userUuid = getUuidFromToken(chipheredToken);
            User user = userData.getUserByUuid(userUuid);
            user.setPassword("");
            return user;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public User getUserByEmail(String authorizationHeader, String userEmail) {
        if (isAcceptedHeader(authorizationHeader)) {

            //this part of the function (present in many managers class) just calls the corresponding function in the
            //database classes, which will then use specific sql queries to get our data
            User user = userData.getUserByEmail(userEmail);

            user.setPassword("");
            return user;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<User> getUsersSubscribedToTournament(String authorizationHeader, String tournamentUuid) {
        if (isAcceptedHeader(authorizationHeader)) {
            List<User> list = userData.getUsersSubscribedToTournament(tournamentUuid);
            for (User user : list) {
                user.setPassword("");
            }
            return list;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<User> getUsersEnrolledInBattle(String authorizationHeader, String battleUuid) {
        if (isAcceptedHeader(authorizationHeader)) {
            List<User> list = userData.getUsersEnrolledInBattle(battleUuid);
            for (User user : list) {
                user.setPassword("");
            }
            return list;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function answer to a user login, by checking in the db if there is a user with both his/her username and password
    //if that is so, it give him/her back a token for our specific server, and for his/her specific username that will last
    //for an amount of hour specified in the tokenHoursLifetime variable (10 in our case)
    @Transactional(rollbackFor = Exception.class, readOnly = true)
    public LoginResponse login(Credentials credentials) {
        String email = credentials.getEmail();
        String password = credentials.getPassword();
        List<User> listPeopleWithEmailAndPassword = userData.getUsersWithEmailAndPassword(email, password);

        LoginResponse loginResponse = new LoginResponse();
        if (!listPeopleWithEmailAndPassword.isEmpty()) {
            String userUuid = listPeopleWithEmailAndPassword.get(0).getUuid().toString();
            loginResponse.setMessage("Username and password are correct, you have now access to our database");
            LocalDateTime expirationDate = LocalDateTime.now().plusHours(tokenHoursLifetime);

            String chipheredTokenString = JWT.create()
                                            .withIssuer(serverName)
                                            .withExpiresAt(Date.from(expirationDate.atZone(ZoneId.systemDefault()).toInstant()))
                                            .withSubject(userUuid)
                                            .sign(this.cipheringAlgorithm);

            loginResponse.setCipheredTokenString(chipheredTokenString);
            return loginResponse;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username or password are incorrect");
        }
    }

    //this function checks if the header is correct
    public boolean isAcceptedHeader(String authorizationHeader) {
        String authorizationToken = getTokenFromHeader(authorizationHeader);
        return authorizationHeader.startsWith("Bearer") && isAcceptedToken(authorizationToken);
    }

    //this function checks if the received token is correct
    public boolean isAcceptedToken(String communicationToken) {
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(communicationToken);
            return true;
        } catch (JWTVerificationException exception) {
            return false;
        }
    }

    public String getTokenFromHeader(String authorizationHeader) {
        return authorizationHeader.substring(authorizationHeader.indexOf(" ") + 1);
    }
    public String getUuidFromToken(String communicationToken) {
        try {
            DecodedJWT decodedJWT = jwtVerifier.verify(communicationToken);
            return decodedJWT.getSubject();
        } catch (JWTVerificationException exception) {
            exception.printStackTrace();
            return "";
        }
    }

    //this function is used to update some particular attribute of our user, we preferred to have it only callable
    //by our internal functions and not from our front end, since even if its scope is limited, we wanted to avoid
    //undesirable or malicious behaviour
    public boolean updateValue(String authorizationHeader, DataUpdate dataUpdate) {
        if (isAcceptedHeader(authorizationHeader)) {
            userData.updateValue(dataUpdate);
            return true;
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }
}
