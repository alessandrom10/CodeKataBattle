package it.polimi.se2.grazzanimasini.ckb.controllers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.BattleInput;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import it.polimi.se2.grazzanimasini.ckb.database.model.Group;
import it.polimi.se2.grazzanimasini.ckb.managers.BattleManager;
import it.polimi.se2.grazzanimasini.ckb.managers.DeliveryEvaluationManager;
import it.polimi.se2.grazzanimasini.ckb.managers.GroupManager;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin
@RestController
public class DeliveryEvaluationController {

    private DeliveryEvaluationManager deliveryEvaluationManager;
    private GroupManager groupManager;
    private BattleManager battleManager;

    public DeliveryEvaluationController(DeliveryEvaluationManager deliveryEvaluationManager,
                                        GroupManager groupManager,
                                        BattleManager battleManager
    ) {

        this.deliveryEvaluationManager = deliveryEvaluationManager;
        this.groupManager = groupManager;
        this.battleManager = battleManager;
    }

    //this will be triggered by the automatic workflow inserted by the user in his/her push (the student must add a
    //workflow that triggers this function in order for it to be evaluated
    @PostMapping(path="/api/deliveryEvaluationInterface/newPushPerformed", produces="application/json")
    public boolean newPushPerformed(@RequestHeader(value = "Authorization") String authorizationHeader,
                                    @RequestHeader(value = "groupUuid") String groupUuid,
                                    @RequestHeader(value = "repositoryLink") String repositoryUrl) throws IOException {

        Group currentGroup = groupManager.getGroupByUuid(authorizationHeader, groupUuid);
        Battle currentBattle = battleManager.getBattleWithUuid(authorizationHeader, currentGroup.getuuidBattle().toString());
        return deliveryEvaluationManager.newPushPerformed(authorizationHeader, currentBattle, currentGroup, repositoryUrl);
    }
}
