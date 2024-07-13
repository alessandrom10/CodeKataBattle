package it.polimi.se2.grazzanimasini.ckb.controllers.model;

import java.time.LocalDate;
import java.util.UUID;

public class BattleInput {
    private UUID tournamentUuid;
    private String name;
    private String description;
    private int groupSizeMinimum;
    private int groupSizeMaximum;
    private LocalDate deadlineRegistration;
    private LocalDate deadlineFinalSubmission;
    private LocalDate dateClosure;
    private String codeKataFiles;
    private String executableName;

    public BattleInput(UUID tournamentUuid,
                       String name,
                       String description,
                       int groupSizeMinimum,
                       int groupSizeMaximum,
                       LocalDate deadlineRegistration,
                       LocalDate deadlineFinalSubmission,
                       LocalDate dateClosure,
                       String codeKataFiles,
                       String executableName
    ) {

        this.tournamentUuid = tournamentUuid;
        this.name = name;
        this.description = description;
        this.groupSizeMinimum = groupSizeMinimum;
        this.groupSizeMaximum = groupSizeMaximum;
        this.deadlineRegistration = deadlineRegistration;
        this.deadlineFinalSubmission = deadlineFinalSubmission;
        this.dateClosure = dateClosure;
        this.codeKataFiles = codeKataFiles;
        this.executableName = executableName;
    }

    public UUID getTournamentUuid() {
        return tournamentUuid;
    }

    public void setTournamentUuid(UUID tournamentUuid) {
        this.tournamentUuid = tournamentUuid;
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

    public String getCodeKataFiles() {
        return codeKataFiles;
    }

    public void setCodeKataFiles(String codeKataFiles) {
        this.codeKataFiles = codeKataFiles;
    }

    public String getExecutableName() {
        return executableName;
    }

    public void setExecutableName(String executableName) {
        this.executableName = executableName;
    }
}
