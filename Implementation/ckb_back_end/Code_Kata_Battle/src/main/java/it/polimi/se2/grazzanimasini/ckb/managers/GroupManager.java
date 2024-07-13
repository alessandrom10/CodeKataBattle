package it.polimi.se2.grazzanimasini.ckb.managers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.GroupInput;
import it.polimi.se2.grazzanimasini.ckb.database.GroupData;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import it.polimi.se2.grazzanimasini.ckb.database.model.Group;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class GroupManager {
    private AccountManager accountManager;
    private GroupData groupData;

    public GroupManager(AccountManager accountManager, GroupData groupData) {
        this.accountManager = accountManager;
        this.groupData = groupData;
    }

    public boolean insertGroup(String authorizationHeader, GroupInput groupInput) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            Group g1 = new Group(groupInput);
            groupData.insertGroup(g1);
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            addUserToGroup(authorizationHeader, g1.getUuid().toString(), userUuid);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public Group getGroupByUuid (String authorizationHeader, String groupUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return groupData.getGroupByUuid(groupUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Group> getMyGroups (String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUUid = accountManager.getUuidFromToken(token);
            return groupData.getGroupsOfUser(userUUid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public Group getMyGroupInBattle (String authorizationHeader, String battleUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUUid = accountManager.getUuidFromToken(token);
            List<Group> list = getMyGroups(authorizationHeader);
            for(Group group : list) {
                if(Objects.equals(group.getuuidBattle().toString(), battleUuid))
                    return group;
            }
            throw new ResponseStatusException(HttpStatus.NO_CONTENT, "The user has no group in such battle");
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Group> getMyOngoingGroups (String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUUid = accountManager.getUuidFromToken(token);
            return groupData.getOngoingGroupsOfUser(userUUid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Group> getGroupsOfBattle (String authorizationHeader, String battle_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return groupData.getGroupsOfBattle(battle_uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Group> getGroupsOfUser (String authorizationHeader, String user_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return groupData.getGroupsOfUser(user_uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean addUserToGroup(String authorizationHeader, String groupUuid, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            Group g1 = getGroupByUuid(authorizationHeader, groupUuid);
            List<User> list = accountManager.getUsersEnrolledInBattle(authorizationHeader, g1.getuuidBattle().toString());
            for(User user : list) {
                if(Objects.equals(user.getUuid().toString(), userUuid)) {
                    groupData.addUserToGroup(groupUuid, userUuid);
                    DataUpdate dataUpdate = new DataUpdate(groupUuid, "size", Integer.toString(g1.getSize() + 1));
                    updateGroupValue(authorizationHeader, dataUpdate);
                    return true;
                }
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The requested user is not enrolled in the battle");
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean updateGroupValue(String authorizationHeader, DataUpdate dataUpdate) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            groupData.updateGroupValue(dataUpdate.getuuid(), dataUpdate.getColumnName(), dataUpdate.getNewValue());
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }
}
