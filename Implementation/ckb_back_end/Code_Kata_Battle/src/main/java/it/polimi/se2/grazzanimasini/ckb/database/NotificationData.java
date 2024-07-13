package it.polimi.se2.grazzanimasini.ckb.database;

import it.polimi.se2.grazzanimasini.ckb.database.model.Notification;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NotificationData {
    void sendNotificationApp(@Param("notification") Notification notification);
    List<Notification> getNotificationsOfUser(@Param("user_uuid") String user_uuid);
    void deleteNotification(@Param("notification_uuid") String notification_uuid);
}
