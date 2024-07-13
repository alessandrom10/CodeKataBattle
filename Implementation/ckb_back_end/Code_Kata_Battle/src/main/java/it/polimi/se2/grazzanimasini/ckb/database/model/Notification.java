package it.polimi.se2.grazzanimasini.ckb.database.model;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.NotificationInput;

import java.util.UUID;

public class Notification {
    private UUID uuid;
    private UUID uuidUser;
    private String title;
    private String text;
    private NotificationCategory notificationCategory;
    private String relatedUuid;
    private boolean deleted;

    public Notification(UUID uuid,
                        UUID uuidUser,
                        String title,
                        String text,
                        NotificationCategory notificationCategory,
                        String relatedUuid,
                        boolean deleted
    ) {

        this.uuid = uuid;
        this.uuidUser = uuidUser;
        this.title = title;
        this.text = text;
        this.notificationCategory = notificationCategory;
        this.relatedUuid = relatedUuid;
        this.deleted = deleted;
    }

    public Notification(NotificationInput notificationInput) {
        this.uuid = UUID.randomUUID();
        this.uuidUser = notificationInput.getUuidUser();
        this.title = notificationInput.getTitle();
        this.text = notificationInput.getText();
        this.notificationCategory = notificationInput.getNotificationCategory();
        this.relatedUuid = notificationInput.getRelatedUuid();
        this.deleted = false;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
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

    public boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
