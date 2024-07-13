package it.polimi.se2.grazzanimasini.ckb.database;

import it.polimi.se2.grazzanimasini.ckb.database.model.Group;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface GroupData {
    void insertGroup(@Param("group") Group group);
    Group getGroupByUuid(@Param("group_uuid") String group_uuid);
    List<Group> getGroupsOfBattle(@Param("battle_uuid") String battle_uuid);
    List<Group> getGroupsOfUser(@Param("user_uuid") String user_uuid);
    List<Group> getOngoingGroupsOfUser(@Param("user_uuid") String user_uuid);
    boolean addUserToGroup(@Param("group_uuid") String group_uuid, @Param("user_uuid") String user_uuid);
    void updateGroupValue(@Param("group_uuid") String group_uuid, @Param("column_name") String column_name, @Param("newValue") String newValue);
}
