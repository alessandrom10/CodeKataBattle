package it.polimi.se2.grazzanimasini.ckb.controllers.model;

import it.polimi.se2.grazzanimasini.ckb.database.model.NotificationCategory;

import java.util.UUID;

public class NotificationInput {
    private UUID uuidUser;
    private String title;
    private String text;
    private NotificationCategory notificationCategory;
    private String relatedUuid;

    public NotificationInput(UUID uuidUser,
                             String title,
                             String text,
                             NotificationCategory notificationCategory,
                             String relatedUuid) {

        this.uuidUser = uuidUser;
        this.title = title;
        this.text = text;
        this.notificationCategory = notificationCategory;
        this.relatedUuid = relatedUuid;
    }

    public UUID getUuidUser() {
        return uuidUser;
    }

    public void setUuidUser(UUID uuidUser) {
        this.uuidUser = uuidUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public NotificationCategory getNotificationCategory() {
        return notificationCategory;
    }

    public void setNotificationCategory(NotificationCategory notificationCategory) {
        this.notificationCategory = notificationCategory;
    }

    public String getRelatedUuid() {
        return relatedUuid;
    }

    public void setRelatedUuid(String relatedUuid) {
        this.relatedUuid = relatedUuid;
    }
}
