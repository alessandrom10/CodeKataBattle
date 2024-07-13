package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.BattleInput;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserBattleStatus;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserTournamentStatus;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import it.polimi.se2.grazzanimasini.ckb.managers.BattleManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.List;

@CrossOrigin
@RestController
public class BattleController {
    private BattleManager battleManager;

    @Autowired
    public BattleController(BattleManager battleManager) {
        this.battleManager = battleManager;
    }

    //this function request for a post call, an authorization header and also requires to have a body that specifies
    //all the attributes of a Battle that we want to insert into the system (all model classes followed by the "Input"
    //term, like "BattleInput" are the version of their real counterpart (Battle) with only the attributes that are
    //requested to be sent from the front end (or inserted by the user)
    @PostMapping(path="/api/battleInterface/insertBattle", consumes="application/json", produces="application/json")
    public boolean insertBattle(@RequestHeader(value = "Authorization") String authorizationHeader,
                                @RequestBody BattleInput battleInput) throws IOException {
        return battleManager.insertBattle(authorizationHeader, battleInput);
    }

    @GetMapping(path="/api/battleInterface/getBattles", produces="application/json")
    public List<Battle> getBattles(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return battleManager.getBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getMyBattles", produces="application/json")
    public List<Battle> getMyBattles(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return battleManager.getMyBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getMyOngoingBattles", produces="application/json")
    public List<Battle> getMyOngoingBattles(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return battleManager.getMyOngoingBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getMyManagedBattles", produces="application/json")
    public List<Battle> getMyManagedBattles(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return battleManager.getMyManagedBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getMyOngoingManagedBattles", produces="application/json")
    public List<Battle> getMyOngoingManagedBattles(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return battleManager.getMyOngoingManagedBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getBattlesFromTournament", produces="application/json")
    public List<Battle> getBattlesFromTournament(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                 @RequestHeader(value = "tournamentUuid") String tournament_uuid) {
        return battleManager.getBattlesFromTournament(authorizationHeader, tournament_uuid);
    }

    @GetMapping(path="/api/battleInterface/getOngoingBattles", produces="application/json")
    public List<Battle> getOngoingBattles(@RequestHeader(value = "Authorization") String authorizationHeader) {
        return battleManager.getOngoingBattles(authorizationHeader);
    }

    @GetMapping(path="/api/battleInterface/getOngoingBattlesFromTournament", produces="application/json")
    public List<Battle> getOngoingBattlesFromTournament(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                        @RequestHeader(value = "tournamentUuid") String tournament_uuid) {
        return battleManager.getOngoingBattlesFromTournament(authorizationHeader, tournament_uuid);
    }

    @GetMapping(path="/api/battleInterface/getBattleUserStatus", produces="application/json")
    public UserBattleStatus getBattleUserStatus(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                @RequestHeader(value = "battleUuid") String battleUuid) throws IOException {

        return battleManager.getBattleUserStatus(authorizationHeader, battleUuid);
    }

    @PostMapping(path="/api/battleInterface/enrollMeInBattle", produces="application/json")
    public boolean enrollMeInBattle(@RequestHeader(value = "Authorization") String authorizationHeader,
                                    @RequestHeader(value = "battleUuid") String battleUuid) {

        return battleManager.enrollMeInBattle(authorizationHeader, battleUuid);
    }

    @PostMapping(path="/api/battleInterface/closeBattle", produces="application/json")
    public boolean closeBattle(@RequestHeader(value = "Authorization") String authorizationHeader,
                               @RequestHeader(value = "battleUuid") String battleUuid,
                               @RequestHeader(value = "motivation") String motivation) {
        return battleManager.closeBattle(authorizationHeader, battleUuid, motivation);
    }
}
