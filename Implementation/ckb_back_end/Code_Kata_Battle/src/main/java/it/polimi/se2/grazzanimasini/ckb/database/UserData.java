package it.polimi.se2.grazzanimasini.ckb.database;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserData {

    //this set of classes defines the method that will be made available by the MyBatis framework to be directly
    //executed in SQL, each of these functions will in fact correspond to a sql query that is defined in the resources
    //folder of this project in specific xml files, where for each of these methods there will be a corresponding query
    //as well as having mappers between type of data in the database and corresponding java classes
    //Furthermore in the database/typehandlers folder there are also classes that are used to map between specific
    //database type of data (url and uuid) to their corresponding Java objects defined in the libraries that we have used
    void insertUser(@Param("user") User user);
    List<User> getUsers();
    User getUserByUuid(@Param("user_uuid") String user_uuid);
    User getUserByEmail(@Param("user_email") String user_email);
    List<User> getUsersSubscribedToTournament(@Param("tournament_uuid") String tournament_uuid);
    List<User> getUsersEnrolledInBattle(@Param("battle_uuid") String battle_uuid);
    List<User> getUsersWithEmailAndPassword(@Param("email") String email, @Param("password") String password);
    Boolean updateValue(@Param("dataUpdate") DataUpdate dataUpdate);
}
