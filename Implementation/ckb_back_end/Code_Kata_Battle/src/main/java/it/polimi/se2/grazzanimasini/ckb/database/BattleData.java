package it.polimi.se2.grazzanimasini.ckb.database;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface BattleData {
    boolean insertBattle(@Param("battle") Battle battle);
    List<Battle> getBattles();
    public Battle getBattleWithUuid(@Param("battle_uuid") String battle_uuid);
    List<Battle> getBattlesFromTournament(@Param("tournament_uuid") String tournament_uuid);
    List<Battle> getBattlesFromUser(@Param("user_uuid") UUID user_uuid);
    List<Battle> getOngoingBattles();
    List<Battle> getOngoingBattlesFromTournament(@Param("tournament_uuid") String tournament_uuid);
    List<Battle> getOngoingBattlesFromUser(@Param("user_uuid") UUID user_uuid);
    boolean updateValue(@Param("dataUpdate") DataUpdate dataUpdate);
    boolean enrollUserInBattle(@Param("battle_uuid") String battle_uuid, @Param("user_uuid") String user_uuid);
    boolean deleteBattle(@Param("battle_uuid") String battle_uuid);
}
