package it.polimi.se2.grazzanimasini.ckb.controllers.model;

import java.util.UUID;

public class GroupInput {
    private UUID uuidBattle;
    private String name;

    public GroupInput(UUID uuidBattle, String name) {
        this.uuidBattle = uuidBattle;
        this.name = name;
    }

    public UUID getUuidBattle() {
        return uuidBattle;
    }

    public void setUuidBattle(UUID uuidBattle) {
        this.uuidBattle = uuidBattle;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
