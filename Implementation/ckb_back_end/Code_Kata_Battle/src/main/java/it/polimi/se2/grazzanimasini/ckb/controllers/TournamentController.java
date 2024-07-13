package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.TournamentInput;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserScoreResponse;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.UserTournamentStatus;
import it.polimi.se2.grazzanimasini.ckb.database.model.Tournament;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import it.polimi.se2.grazzanimasini.ckb.managers.AccountManager;
import it.polimi.se2.grazzanimasini.ckb.managers.TournamentManager;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
@CrossOrigin
@RestController
public class TournamentController {
    private TournamentManager tournamentManager;
    private AccountManager accountManager;

    public TournamentController(TournamentManager tournamentManager, AccountManager accountManager) {
        this.tournamentManager = tournamentManager;
        this.accountManager = accountManager;
    }
    @PostMapping(path="/api/tournamentInterface/insertTournament", consumes="application/json", produces="application/json")
    public boolean insertTournament(@RequestHeader(value = "Authorization") String authorizationHeader,
                                    @RequestBody TournamentInput tournamentInput) throws IOException {
        return tournamentManager.insertTournament(authorizationHeader, tournamentInput);
    }

    @GetMapping(path="/api/tournamentInterface/getTournaments", produces="application/json")
    public List<Tournament> getTournaments(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return tournamentManager.getTournaments(authorizationHeader);
    }

    @GetMapping(path="/api/tournamentInterface/getMyTournaments", produces="application/json")
    public List<Tournament> getMyTournaments(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return tournamentManager.getMyTournaments(authorizationHeader);
    }

    @GetMapping(path="/api/tournamentInterface/getMyOngoingTournaments", produces="application/json")
    public List<Tournament> getMyOngoingTournaments(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return tournamentManager.getMyOngoingTournaments(authorizationHeader);
    }

    @GetMapping(path="/api/tournamentInterface/getMyManagedTournaments", produces="application/json")
    public List<Tournament> getMyManagedTournaments(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return tournamentManager.getMyManagedTournaments(authorizationHeader);
    }

    @GetMapping(path="/api/tournamentInterface/getMyOngoingManagedTournaments", produces="application/json")
    public List<Tournament> getMyOngoingManagedTournaments(@RequestHeader(value = "Authorization") String authorizationHeader) throws IOException {
        return tournamentManager.getMyOngoingManagedTournaments(authorizationHeader);
    }

    @GetMapping(path="/api/tournamentInterface/getTournamentWithUUID", produces="application/json")
    public Tournament getTournamentWithUUID(@RequestHeader(value = "Authorization") String authorizationHeader,
                                            @RequestHeader(value = "tournamentUuid") String tournamentUuid) throws IOException {

        return tournamentManager.getTournamentWithUUID(authorizationHeader, tournamentUuid);
    }

    @GetMapping(path="/api/tournamentInterface/getUserScoresInTournamentWithUuid", produces="application/json")
    public List<UserScoreResponse> getUserScoresInTournamentWithUuid(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                                     @RequestHeader(value = "tournamentUuid") String tournamentUuid) {

        return tournamentManager.getUserScoresInTournamentWithUuid(authorizationHeader, tournamentUuid);
    }

    @GetMapping(path="/api/tournamentInterface/getManagedTournaments", produces="application/json")
    public List<Tournament> getManagedTournaments( @RequestHeader(value = "Authorization") String authorizationHeader,
                                                   @RequestHeader(value = "userUuid") String user_uuid) throws IOException {

        return tournamentManager.getManagedTournamentsOfUser(authorizationHeader, user_uuid);
    }

    @GetMapping(path="/api/tournamentInterface/getTournamentUserStatus", produces="application/json")
    public UserTournamentStatus getTournamentUserStatus(@RequestHeader(value = "Authorization") String authorizationHeader,
                                                        @RequestHeader(value = "tournamentUuid") String tournamentUuid) throws IOException {

        return tournamentManager.getTournamentUserStatus(authorizationHeader, tournamentUuid);
    }

    @PostMapping(path="/api/tournamentInterface/addEducatorManageTournament", produces="application/json")
    public boolean addEducatorManageTournament( @RequestHeader(value = "Authorization") String authorizationHeader,
                                                @RequestHeader(value = "tournamentUuid") String tournament_uuid,
                                                @RequestHeader(value = "userEmail") String userEmail) {

        User u1 = accountManager.getUserByEmail(authorizationHeader, userEmail);
        return tournamentManager.addEducatorManageTournament(authorizationHeader, tournament_uuid, u1.getUuid().toString());
    }

    @PostMapping(path="/api/tournamentInterface/addUserToTournament", produces="application/json")
    public boolean addUserToTournament( @RequestHeader(value = "Authorization") String authorizationHeader,
                                        @RequestHeader(value = "tournamentUuid") String tournament_uuid,
                                        @RequestHeader(value = "userUuid") String user_uuid) {

        return tournamentManager.addUserToTournament(authorizationHeader, tournament_uuid, user_uuid);
    }

    @PostMapping(path="/api/tournamentInterface/closeTournament", produces="application/json")
    public boolean closeTournament( @RequestHeader(value = "Authorization") String authorizationHeader,
                                    @RequestHeader(value = "tournamentUuid") String tournament_uuid,
                                    @RequestHeader(value = "motivation") String motivation) throws IOException {

        return tournamentManager.closeTournament(authorizationHeader, tournament_uuid, motivation);
    }
}
