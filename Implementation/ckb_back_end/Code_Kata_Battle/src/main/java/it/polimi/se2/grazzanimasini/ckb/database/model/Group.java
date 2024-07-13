package it.polimi.se2.grazzanimasini.ckb.database.model;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.GroupInput;

import java.util.UUID;

public class Group {
    private UUID uuid;
    private UUID uuidBattle;
    private int size;
    private int score;
    private String name;

    public Group(UUID uuid,
                 UUID uuidBattle,
                 int size,
                 int score,
                 String name) {

        this.uuid = uuid;
        this.uuidBattle = uuidBattle;
        this.size = size;
        this.score = score;
        this.name = name;
    }

    public Group (GroupInput groupInput) {
        this.uuid = UUID.randomUUID();
        this.uuidBattle = groupInput.getUuidBattle();
        this.size = 0;
        this.score = 0;
        this.name = groupInput.getName();
    }

    public UUID getUuid() {
        return uuid;
    }

    public void setUuid(UUID uuid) {
        this.uuid = uuid;
    }

    public UUID getuuidBattle() {
        return uuidBattle;
    }

    public void setuuidBattle(UUID uuidBattle) {
        this.uuidBattle = uuidBattle;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
