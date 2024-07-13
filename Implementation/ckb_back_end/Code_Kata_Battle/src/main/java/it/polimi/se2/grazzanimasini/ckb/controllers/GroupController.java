package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.controllers.model.GroupInput;
import it.polimi.se2.grazzanimasini.ckb.database.model.Group;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import it.polimi.se2.grazzanimasini.ckb.managers.AccountManager;
import it.polimi.se2.grazzanimasini.ckb.managers.GroupManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class GroupController {
    private GroupManager groupManager;
    private AccountManager accountManager;

    @Autowired
    public GroupController(GroupManager groupManager, AccountManager accountManager) {
        this.groupManager = groupManager;
        this.accountManager = accountManager;
    }

    @PostMapping(path="/api/groupInterface/insertGroup", consumes="application/json", produces="application/json")
    public boolean insertGroup( @RequestHeader(value = "Authorization") String authorizationHeader,
                                @RequestBody GroupInput groupInput) {

        return groupManager.insertGroup(authorizationHeader, groupInput);
    }

    @GetMapping(path="/api/groupInterface/getGroupByUuid", produces="application/json")
    public Group getGroupByUuid (@RequestHeader(value = "Authorization") String authorizationHeader,
                                 @RequestHeader(value = "groupUuid") String groupUuid) {

        return groupManager.getGroupByUuid(authorizationHeader, groupUuid);
    }

    @GetMapping(path="/api/groupInterface/getMyGroups", produces="application/json")
    public List<Group> getMyGroups (@RequestHeader(value = "Authorization") String authorizationHeader) {

        return groupManager.getMyGroups(authorizationHeader);
    }

    @GetMapping(path="/api/groupInterface/getMyGroupInBattle", produces="application/json")
    public Group getMyGroupInBattle (@RequestHeader(value = "Authorization") String authorizationHeader,
                                     @RequestHeader(value = "battleUuid") String battleUuid) {

        return groupManager.getMyGroupInBattle(authorizationHeader, battleUuid);
    }

    @GetMapping(path="/api/groupInterface/getMyOngoingGroups", produces="application/json")
    public List<Group> getMyOngoingGroups (@RequestHeader(value = "Authorization") String authorizationHeader) {

        return groupManager.getMyOngoingGroups(authorizationHeader);
    }

    @GetMapping(path="/api/groupInterface/getGroupsOfBattle", produces="application/json")
    public List<Group> getGroupsOfBattle (@RequestHeader(value = "Authorization") String authorizationHeader,
                                          @RequestHeader(value = "battleUuid") String battle_uuid) {

        return groupManager.getGroupsOfBattle(authorizationHeader, battle_uuid);
    }

    @PostMapping(path="/api/groupInterface/addUserToGroup", produces="application/json")
    public boolean addUserToGroup( @RequestHeader(value = "Authorization") String authorizationHeader,
                                   @RequestHeader(value = "groupUuid") String groupUuid,
                                   @RequestHeader(value = "userEmail") String userEmail) {

        User u1 = accountManager.getUserByEmail(authorizationHeader, userEmail);
        return groupManager.addUserToGroup(authorizationHeader, groupUuid, u1.getUuid().toString());
    }

    @PutMapping(path="/api/groupInterface/updateGroupScore", produces="application/json")
    public boolean updateGroupValue(@RequestHeader(value = "Authorization") String authorizationHeader,
                                    @RequestBody DataUpdate dataUpdate) {

        return groupManager.updateGroupValue(authorizationHeader, dataUpdate);
    }
}
