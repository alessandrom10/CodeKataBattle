package it.polimi.se2.grazzanimasini.ckb.managers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.*;
import it.polimi.se2.grazzanimasini.ckb.database.BattleData;
import it.polimi.se2.grazzanimasini.ckb.database.TournamentData;
import it.polimi.se2.grazzanimasini.ckb.database.model.NotificationCategory;
import it.polimi.se2.grazzanimasini.ckb.database.model.Tournament;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@Service
public class TournamentManager {

    private AccountManager accountManager;
    private TournamentData tournamentData;
    private NotificationManager notificationManager;
    private BattleData battleData;
    @Value("${resourcesPath}")
    private String resourcesPath;
    @Value("${tournamentPictureSubPath}")
    private String tournamentPictureSubPath;

    @Autowired
    public TournamentManager(AccountManager accountManager,
                             TournamentData tournamentData,
                             NotificationManager notificationManager,
                             BattleData battleData) {

        this.accountManager = accountManager;
        this.tournamentData = tournamentData;
        this.notificationManager = notificationManager;
        this.battleData = battleData;
    }

    public boolean insertTournament(String authorizationHeader, TournamentInput tournamentInput) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {

            //this part decode the base64 file received and saves it
            String base64Data = tournamentInput.getFilePicture().split(",")[1];
            byte[] fileDecodedBytes = Base64.getDecoder().decode(base64Data);
            String pathPictureString = resourcesPath + tournamentPictureSubPath + "/" + tournamentInput.getName() + ".jpeg";
            Path pathPicture = Paths.get(pathPictureString);
            Files.write(pathPicture, fileDecodedBytes);

            Tournament t1 = new Tournament(tournamentInput, pathPictureString);
            tournamentData.insertTournament(t1);
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            addEducatorManageTournament(authorizationHeader, t1.getUuid().toString(), userUuid);

            //this part sends notifications to all the application's users
            List<User> list = accountManager.getUsers(authorizationHeader);
            NotificationInput notificationInput;
            for (User user : list) {
                notificationInput = new NotificationInput(
                        user.getUuid(),
                        String.format("Tournament %s has just been created!", tournamentInput.getName()),
                        String.format("Tournament %s is now available for subscription", tournamentInput.getName()),
                        NotificationCategory.GENERIC_NOTIFICATION,
                        "");
                notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
            }
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getTournaments(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return setFilesInTournaments(tournamentData.getTournaments());
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getMyTournaments(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return getTournamentsOfUser(authorizationHeader, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getMyOngoingTournaments(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return getOngoingTournamentsOfUser(authorizationHeader, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getMyManagedTournaments(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return getManagedTournamentsOfUser(authorizationHeader, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getOngoingManagedTournamentsOfUser(String authorizationHeader, String userUuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return setFilesInTournaments(tournamentData.getOngoingManagedTournamentsOfUser(userUuid));
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getMyOngoingManagedTournaments(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return getOngoingManagedTournamentsOfUser(authorizationHeader, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public Tournament getTournamentWithUUID(String authorizationHeader, String tournamentUuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            Tournament tournament = tournamentData.getTournamentWithUUID(tournamentUuid);
            if(tournament.getFilePicturePath() != null) {
                byte[] fileContent = Files.readAllBytes(Paths.get(tournament.getFilePicturePath()));
                tournament.setFilePicturePath(Base64.getEncoder().encodeToString(fileContent));
            }
            return tournament;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //TO DO
    public List<UserScoreResponse> getUserScoresInTournamentWithUuid(String authorizationHeader, String tournamentUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<User> userList = accountManager.getUsersSubscribedToTournament(authorizationHeader, tournamentUuid);


            List<UserScoreResponse> list = new ArrayList<>();
            for(User user : userList) {
                UserScoreResponse userScoreResponse = new UserScoreResponse(user.getEmail(),
                    getScoreOfUserInTournament(authorizationHeader, tournamentUuid, user.getUuid().toString()));
                list.add(userScoreResponse);
            }
            return list;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public int getScoreOfUserInTournament(String authorizationHeader, String tournamentUuid, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return tournamentData.getScoreOfUserInTournament(tournamentUuid, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getTournamentsOfUser(String authorizationHeader, String user_uuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return setFilesInTournaments(tournamentData.getTournamentsOfUser(user_uuid));

        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getOngoingTournamentsOfUser(String authorizationHeader, String user_uuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return setFilesInTournaments(tournamentData.getOngoingTournamentsOfUser(user_uuid));
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> getManagedTournamentsOfUser(String authorizationHeader, String user_uuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return setFilesInTournaments(tournamentData.getManagedTournamentsOfUser(user_uuid));
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function returns the status of the specified user in the tournament, so whether he/she is managing it,
    //subscribed to it, or has nothing to do with it
    public UserTournamentStatus getTournamentUserStatus(String authorizationHeader, String tournamentUuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {

            List<Tournament> list = getMyManagedTournaments(authorizationHeader);
            for(Tournament tournament : list) {
                if(Objects.equals(tournament.getUuid().toString(), tournamentUuid))
                    return UserTournamentStatus.MANAGING;
            }

            list = getMyTournaments(authorizationHeader);
            for(Tournament tournament : list) {
                if(Objects.equals(tournament.getUuid().toString(), tournamentUuid))
                    return UserTournamentStatus.SUBSCRIBED;
            }

            return UserTournamentStatus.EXTERNAL;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Tournament> setFilesInTournaments(List<Tournament> tournamentList) throws IOException {
        for(Tournament tournament : tournamentList) {
            if(tournament.getFilePicturePath() != null) {
                byte[] fileContent = Files.readAllBytes(Paths.get(tournament.getFilePicturePath()));
                tournament.setFilePicturePath(Base64.getEncoder().encodeToString(fileContent));
            }
        }
        return tournamentList;
    }

    public boolean addEducatorManageTournament(String authorizationHeader, String tournament_uuid, String user_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            tournamentData.addEducatorManageTournament(tournament_uuid, user_uuid);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean addUserToTournament(String authorizationHeader, String tournament_uuid, String user_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            tournamentData.addUserToTournament(tournament_uuid, user_uuid);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function closes a tournament, due to data analysis we'd like to never actually remove data from our database,
    //therefore when a tournament, battle or notification is closed/eliminated it actually has just its attribute
    //changed in the database in a way that the system knows that it has to treat it as a closed/eliminated tournament,
    //battle or notification. Nothing really changes from the user point of view, but this allows us
    //to not "loose" precious data
    public boolean closeTournament(String authorizationHeader, String tournamentUuid, String motivation) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            if(battleData.getOngoingBattlesFromTournament(tournamentUuid).isEmpty()) {
                List<User> list = accountManager.getUsersSubscribedToTournament(authorizationHeader, tournamentUuid);
                Tournament t1 = getTournamentWithUUID(authorizationHeader, tournamentUuid);
                NotificationInput notificationInput;
                for(User user : list) {
                    notificationInput = new NotificationInput(
                            user.getUuid(),
                            String.format("The tournament %s has been closed", t1.getName()),
                            motivation,
                            NotificationCategory.GENERIC_NOTIFICATION,
                            tournamentUuid);
                    notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
                }
                DataUpdate dataUpdate = new DataUpdate(tournamentUuid, "date_closure", LocalDate.now().toString());
                updateValue(authorizationHeader, dataUpdate);
                return true;
            }
            else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This tournament still has some ongoing battles");
            }
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean updateValue(String authorizationHeader, DataUpdate dataUpdate) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return tournamentData.updateValue(dataUpdate);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }
}
