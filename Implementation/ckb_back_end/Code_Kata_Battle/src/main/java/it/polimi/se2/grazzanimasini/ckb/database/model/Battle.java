package it.polimi.se2.grazzanimasini.ckb.database.model;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.BattleInput;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.LocalDate;
import java.util.UUID;

public class Battle {
    private UUID uuid;
    private UUID uuidTournament;
    private String name;
    private String description;
    private int groupSizeMinimum;
    private int groupSizeMaximum;
    private LocalDate deadlineRegistration;
    private LocalDate deadlineFinalSubmission;
    private LocalDate dateClosure;
    private URL repositoryLink;
    private boolean closedEarly;
    private String executableName;

    public Battle(UUID uuid,
                  UUID uuidTournament,
                  String name,
                  String description,
                  int groupSizeMinimum,
                  int groupSizeMaximum,
                  LocalDate deadlineRegistration,
                  LocalDate deadlineFinalSubmission,
                  LocalDate dateClosure,
                  URL repositoryLink,
                  boolean closedEarly,
                  String executableName
    ) {
        this.uuid = uuid;
        this.uuidTournament = uuidTournament;
        this.name = name;
        this.description = description;
        this.groupSizeMinimum = groupSizeMinimum;
        this.groupSizeMaximum = groupSizeMaximum;
        this.deadlineRegistration = deadlineRegistration;
        this.deadlineFinalSubmission = deadlineFinalSubmission;
        this.dateClosure = dateClosure;
        this.repositoryLink = repositoryLink;
        this.closedEarly = closedEarly;
        this.executableName = executableName;
    }

    public Battle (BattleInput battleInput, String username) throws MalformedURLException {
        this.uuid = UUID.randomUUID();
        this.uuidTournament = battleInput.getTournamentUuid();
        this.name = battleInput.getName();
        this.description = battleInput.getDescription();
        this.groupSizeMinimum = battleInput.getGroupSizeMinimum();
        this.groupSizeMaximum = battleInput.getGroupSizeMaximum();
        this.deadlineRegistration = battleInput.getDeadlineRegistration();
        this.deadlineFinalSubmission = battleInput.getDeadlineFinalSubmission();
        this.dateClosure = battleInput.getDateClosure();
        this.repositoryLink = new URL(String.format("https://github.com/%s/%s.git", username, battleInput.getName()));
        this.closedEarly = false;
        this.executableName = battleInput.getExecutableName();
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public UUID getUuidTournament() {
        return uuidTournament;
    }

    public void setUuidTournament(UUID uuidTournament) {
        this.uuidTournament = uuidTournament;
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

    public int getGroupSizeMinimum() {
        return groupSizeMinimum;
    }

    public void setGroupSizeMinimum(int groupSizeMinimum) {
        this.groupSizeMinimum = groupSizeMinimum;
    }

    public int getGroupSizeMaximum() {
        return groupSizeMaximum;
    }

    public void setGroupSizeMaximum(int groupSizeMaximum) {
        this.groupSizeMaximum = groupSizeMaximum;
    }

    public LocalDate getDeadlineRegistration() {
        return deadlineRegistration;
    }

    public void setDeadlineRegistration(LocalDate deadlineRegistration) {
        this.deadlineRegistration = deadlineRegistration;
    }

    public LocalDate getDeadlineFinalSubmission() {
        return deadlineFinalSubmission;
    }

    public void setDeadlineFinalSubmission(LocalDate deadlineFinalSubmission) {
        this.deadlineFinalSubmission = deadlineFinalSubmission;
    }

    public LocalDate getDateClosure() {
        return dateClosure;
    }

    public void setDateClosure(LocalDate dateClosure) {
        this.dateClosure = dateClosure;
    }

    public URL getRepositoryLink() {
        return repositoryLink;
    }

    public void setRepositoryLink(URL repositoryLink) {
        this.repositoryLink = repositoryLink;
    }

    public boolean getClosedEarly() {
        return closedEarly;
    }

    public void setClosedEarly(boolean closedEarly) {
        this.closedEarly = closedEarly;
    }

    public String getExecutableName() {
        return executableName;
    }

    public void setExecutableName(String executableName) {
        this.executableName = executableName;
    }
}
