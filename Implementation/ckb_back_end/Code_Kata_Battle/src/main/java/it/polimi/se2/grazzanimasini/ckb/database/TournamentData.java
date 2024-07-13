package it.polimi.se2.grazzanimasini.ckb.database;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.database.model.Tournament;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TournamentData {
    void insertTournament(@Param("tournament") Tournament tournament);
    List<Tournament> getTournaments();
    Tournament getTournamentWithUUID(@Param("tournament_uuid") String tournament_uuid);
    int getScoreOfUserInTournament(@Param("tournament_uuid") String tournament_uuid, @Param("user_uuid") String user_uuid);
    List<Tournament> getTournamentsOfUser(@Param("user_uuid") String user_uuid);
    List<Tournament> getOngoingTournamentsOfUser(@Param("user_uuid") String user_uuid);
    List<Tournament> getManagedTournamentsOfUser(@Param("user_uuid") String user_uuid);
    List<Tournament> getOngoingManagedTournamentsOfUser(@Param("user_uuid") String user_uuid);
    void addEducatorManageTournament(@Param("tournament_uuid") String tournament_uuid, @Param("user_uuid") String user_uuid);
    void addUserToTournament(@Param("tournament_uuid") String tournament_uuid, @Param("user_uuid") String user_uuid);
    boolean updateValue(@Param("dataUpdate") DataUpdate dataUpdate);
}
