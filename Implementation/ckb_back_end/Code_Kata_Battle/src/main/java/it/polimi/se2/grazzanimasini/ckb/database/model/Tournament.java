package it.polimi.se2.grazzanimasini.ckb.database.model;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.TournamentInput;

import java.time.LocalDate;
import java.util.UUID;

public class Tournament {
    private UUID uuid;
    private String name;
    private String description;
    private LocalDate deadlineSubscription;
    private LocalDate dateClosure;
    private String filePicturePath;


    public Tournament(UUID uuid,
                      String name,
                      String description,
                      LocalDate deadlineSubscription,
                      LocalDate dateClosure,
                      String filePicturePath) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.deadlineSubscription = deadlineSubscription;
        this.dateClosure = dateClosure;
        this.filePicturePath = filePicturePath;
    }

    public Tournament(TournamentInput tournamentInput, String filePicturePath) {
        this.uuid = UUID.randomUUID();
        this.name = tournamentInput.getName();
        this.description = tournamentInput.getDescription();
        this.deadlineSubscription = tournamentInput.getDeadlineSubscription();
        this.filePicturePath = filePicturePath;
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
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

    public LocalDate getDateClosure() {
        return dateClosure;
    }

    public void setDateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
    }

    public String getFilePicturePath() {
        return filePicturePath;
    }

    public void setFilePicturePath(String filePicturePath) {
        this.filePicturePath = filePicturePath;
    }
}
