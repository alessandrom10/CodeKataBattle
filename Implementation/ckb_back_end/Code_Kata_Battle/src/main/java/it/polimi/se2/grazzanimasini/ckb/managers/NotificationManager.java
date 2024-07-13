package it.polimi.se2.grazzanimasini.ckb.managers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.NotificationInput;
import it.polimi.se2.grazzanimasini.ckb.database.BattleData;
import it.polimi.se2.grazzanimasini.ckb.database.NotificationData;
import it.polimi.se2.grazzanimasini.ckb.database.TournamentData;
import it.polimi.se2.grazzanimasini.ckb.database.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Properties;
import java.util.UUID;

@Service
public class NotificationManager {
    private NotificationData notificationData;
    private AccountManager accountManager;
    private GroupManager groupManager;
    private BattleData battleData;
    private TournamentData tournamentData;

    @Autowired
    public NotificationManager(NotificationData notificationData,
                               AccountManager accountManager,
                               GroupManager groupManager,
                               BattleData battleData,
                               TournamentData tournamentData) {

        this.notificationData = notificationData;
        this.accountManager = accountManager;
        this.groupManager = groupManager;
        this.battleData = battleData;
        this.tournamentData = tournamentData;
    }

    public boolean sendNotificationApp(String authorizationHeader, NotificationInput notificationInput) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            notificationData.sendNotificationApp(new Notification(notificationInput));
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean inviteUserToGroup(String authorizationHeader, String groupUuid, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            Group group = groupManager.getGroupByUuid(authorizationHeader, groupUuid);
            Battle battle = battleData.getBattleWithUuid(group.getuuidBattle().toString());
            List<User> list = accountManager.getUsersEnrolledInBattle(authorizationHeader, battle.getUuid().toString());

            boolean hasElementWithAttribute = list.stream()
                    .anyMatch(usr -> usr.getUuid().toString().equals(userUuid));

            NotificationInput notificationInput;
            notificationInput = new NotificationInput(
                UUID.fromString(userUuid),
                "You have been invited to a new group!",
                String.format("You have been invited to group %s", group.getName()),
                NotificationCategory.GROUP_PARTECIPATION_INVITATION,
                groupUuid);
            sendNotificationApp(authorizationHeader, notificationInput);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean inviteEducatorToManageTournament(String authorizationHeader, String tournamentUuid, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<User> list = accountManager.getUsersSubscribedToTournament(authorizationHeader, tournamentUuid);

            //this cycle checks if the invited educator is subscribed to the tournament, if it's such, then he/she cannot
            //also manage the tournament, so he/she cannot be invited
            for(User user : list) {
                if(Objects.equals(user.getUuid().toString(), userUuid)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The requested user is subscribed to the tournament," +
                        " therefore he/she cannot be invited to manage it");
                }
            }

            Tournament tournament = tournamentData.getTournamentWithUUID(tournamentUuid);
            NotificationInput notificationInput;
            notificationInput = new NotificationInput(
                    UUID.fromString(userUuid),
                    "You have been invited to manage a tournament!",
                    String.format("You have been invited to manage %s", tournament.getName()),
                    NotificationCategory.TOURNAMENT_MANAGE_INVITATION,
                    tournamentUuid);
            sendNotificationApp(authorizationHeader, notificationInput);
            return true;

        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Notification> getMyNotifications(String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return notificationData.getNotificationsOfUser(userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Notification> getNotificationsOfUser(String authorizationHeader, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return notificationData.getNotificationsOfUser(userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //as also with tournaments and battles, a notification is never really "deleted", it is just modified in a way
    //that it will be considered as such when referring to the data to show to the user
    public boolean deleteNotification(String authorizationHeader, String notification_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            notificationData.deleteNotification(notification_uuid);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }
}
