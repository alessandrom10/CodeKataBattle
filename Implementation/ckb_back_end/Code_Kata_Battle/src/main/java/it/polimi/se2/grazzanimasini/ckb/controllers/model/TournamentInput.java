package it.polimi.se2.grazzanimasini.ckb.controllers.model;

import java.time.LocalDate;

public class TournamentInput {
    private String name;
    private String description;
    private LocalDate deadlineSubscription;
    private String filePicture;

    public TournamentInput(String name, String description, LocalDate deadlineSubscription, String filePicture) {
        this.name = name;
        this.description = description;
        this.deadlineSubscription = deadlineSubscription;
        this.filePicture = filePicture;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDeadlineSubscription() {
        return deadlineSubscription;
    }

    public void setDeadlineSubscription(LocalDate deadlineSubscription) {
        this.deadlineSubscription = deadlineSubscription;
    }

    public String getFilePicture() {
        return filePicture;
    }

    public void setFilePicture(String filePicture) {
        this.filePicture = filePicture;
    }
}
