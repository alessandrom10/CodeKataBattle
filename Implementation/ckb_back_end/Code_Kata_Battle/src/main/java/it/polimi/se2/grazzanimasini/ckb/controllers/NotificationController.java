package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.NotificationInput;
import it.polimi.se2.grazzanimasini.ckb.database.model.Notification;
import it.polimi.se2.grazzanimasini.ckb.managers.AccountManager;
import it.polimi.se2.grazzanimasini.ckb.managers.NotificationManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class NotificationController {
    private NotificationManager notificationManager;
    private AccountManager accountManager;

    @Autowired
    public NotificationController(NotificationManager notificationManager, AccountManager accountManager) {
        this.notificationManager = notificationManager;
        this.accountManager = accountManager;
    }

    @PutMapping(path="/api/notificationInterface/sendNotificationApp", consumes="application/json")
    public boolean sendNotificationApp(@RequestHeader(value = "Authorization") String authorizationHeader,
                                       @RequestBody NotificationInput notificationInput) {
        return notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
    }

    @PutMapping(path="/api/notificationInterface/inviteUserToGroup", produces="application/json")
    public boolean inviteUserToGroup(@RequestHeader(value = "Authorization") String authorizationHeader,
                                     @RequestHeader(value = "groupUuid") String groupUuid,
                                     @RequestHeader(value = "userEmail") String userEmail) {

        String userUuid = accountManager.getUserByEmail(authorizationHeader,userEmail).getUuid().toString();
        return notificationManager.inviteUserToGroup(authorizationHeader, groupUuid, userUuid);
    }

    @PutMapping(path="/api/notificationInterface/inviteEducatorToManageTournament", produces="application/json")
    public boolean inviteEducatorToManageTournament(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                    @RequestHeader(value = "tournamentUuid") String tournamentUuid,
                                                    @RequestHeader(value = "userEmail") String userEmail) {

        String userUuid = accountManager.getUserByEmail(authorizationHeader,userEmail).getUuid().toString();
        return notificationManager.inviteEducatorToManageTournament(authorizationHeader, tournamentUuid, userUuid);
    }

    @GetMapping(path="/api/notificationInterface/getMyNotifications", produces="application/json")
    public List<Notification> getMyNotifications(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return notificationManager.getMyNotifications(authorizationHeader);
    }

    @DeleteMapping(path="/api/notificationInterface/delete", produces="application/json")
    public boolean deleteNotification(  @RequestHeader(value = "Authorization") String authorizationHeader,
                                        @RequestHeader(value = "notificationUuid") String notification_uuid) {
        return notificationManager.deleteNotification(authorizationHeader, notification_uuid);
    }
}
