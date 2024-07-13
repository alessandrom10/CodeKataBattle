package it.polimi.se2.grazzanimasini.ckb.managers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.*;
import it.polimi.se2.grazzanimasini.ckb.database.BattleData;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import it.polimi.se2.grazzanimasini.ckb.database.model.NotificationCategory;
import it.polimi.se2.grazzanimasini.ckb.database.model.Tournament;
import it.polimi.se2.grazzanimasini.ckb.database.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class BattleManager {
    private BattleData battleData;
    private AccountManager accountManager;
    private RepositoryManager repositoryManager;
    private NotificationManager notificationManager;
    private TournamentManager tournamentManager;
    private DeliveryEvaluationManager deliveryEvaluationManager;
    @Value("${resourcesPath}")
    private String resourcesPath;
    @Value("${ckSubPath}")
    private String ckSubPath;

    @Autowired
    public BattleManager(BattleData battleData,
                         AccountManager accountManager,
                         RepositoryManager repositoryManager,
                         NotificationManager notificationManager,
                         TournamentManager tournamentManager,
                         DeliveryEvaluationManager deliveryEvaluationManager) {

        this.battleData = battleData;
        this.accountManager = accountManager;
        this.repositoryManager = repositoryManager;
        this.notificationManager = notificationManager;
        this.tournamentManager = tournamentManager;
        this.deliveryEvaluationManager = deliveryEvaluationManager;
    }

    //this function is used to when a new battle is created to insert it into the system
    public boolean insertBattle(String authorizationHeader, BattleInput battleInput) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            battleData.insertBattle(new Battle(battleInput, repositoryManager.getUsername()));

            //here it gets the list of all user subscribed to this tournament and send them a notification about the creation
            //of this new battle
            List<User> list = accountManager.getUsersSubscribedToTournament(authorizationHeader, battleInput.getTournamentUuid().toString());
            NotificationInput notificationInput;
            for(User user : list) {
                notificationInput = new NotificationInput(
                    user.getUuid(),
                    String.format("Battle %s has been created!", battleInput.getName()),
                        String.format("Battle %S has just been created!", battleInput.getName()),
                    NotificationCategory.GENERIC_NOTIFICATION,
                    "");
                notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
            }

            //here it sets up the correct time in which the battle should start (after the registration deadline)
            long delayInDays = ChronoUnit.DAYS.between(LocalDate.now(), battleInput.getDeadlineRegistration());
            long delayInMs = delayInDays * 24 * 60 * 60 * 1000;

            // Ensure the initial delay is positive
            if (delayInMs < 0) {
                System.out.println("The desired execution time is in the past.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Wrong dates inserted");
            }

            //when the moment for the battle to start comes the function createRepository with such parameters will be called
            ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
            scheduler.schedule(() -> createRepository(authorizationHeader, battleInput), delayInMs, TimeUnit.MILLISECONDS);
            System.out.println("Started waiting");
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function create a repository for our battle (this repository actually exist on GitHub with the unzipped files
    // that you provided while creating the battle in the front end)
    public boolean createRepository(String authorizationHeader, BattleInput battleInput) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            System.out.println("Creating repository");
            repositoryManager.createRepository(battleInput.getName());
            System.out.println("After creating repository");

            //here the file is handled and stored
            //String base64Data = battleInput.getCodeKataFiles().split(",")[1];
            //System.out.println("My cleaned file is: " + base64Data);
            byte[] fileDecodedBytes = Base64.getDecoder().decode(battleInput.getCodeKataFiles());
            String currentFolderPath = resourcesPath + ckSubPath + "/" + battleInput.getName() + "_ck";
            System.out.println("My current folder path is: " + currentFolderPath);
            Files.createDirectories(Paths.get(currentFolderPath));
            String pathZipString = currentFolderPath + "/" + battleInput.getName() + ".zip";
            Path pathZip = Paths.get(pathZipString);

            System.out.println("Creating repository");
            Files.write(pathZip, fileDecodedBytes);
            unzip(pathZipString, currentFolderPath);
            Files.delete(pathZip);

            repositoryManager.pushFolderToGitHub(battleInput.getName(), new File(currentFolderPath));
            Battle battle = new Battle(battleInput, repositoryManager.getUsername());

            //here notifications are sent to all the users subscribed to the tournament about the fact that the battle
            //is starting, and such notification also provides the link to this newly created battle
            List<User> list = accountManager.getUsersSubscribedToTournament(authorizationHeader, battleInput.getTournamentUuid().toString());
            NotificationInput notificationInput;
            for(User user : list) {
                notificationInput = new NotificationInput(
                        user.getUuid(),
                        String.format("Battle %s has just started!", battleInput.getName()),
                        String.format("Battle %s has just started, find it here: %s ",  battleInput.getName(),
                                                                                        battle.getRepositoryLink()),
                        NotificationCategory.GENERIC_NOTIFICATION,
                        battle.getUuid().toString());
                notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
            }
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getBattles(String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getBattles();
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public Battle getBattleWithUuid(String authorizationHeader, String battleUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getBattleWithUuid(battleUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getMyBattles(String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return battleData.getBattlesFromUser(UUID.fromString(userUuid));
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getMyOngoingBattles(String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return getOngoingBattlesFromUser(authorizationHeader, UUID.fromString(userUuid));
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getMyManagedBattles(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<Tournament> listTournament = tournamentManager.getMyManagedTournaments(authorizationHeader);
            List<Battle> fullBattleList = new ArrayList<>();
            for(Tournament tournament : listTournament) {
                List<Battle> listPart = getBattlesFromTournament(authorizationHeader, tournament.getUuid().toString());
                fullBattleList.addAll(listPart);
            }
            return fullBattleList;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getMyOngoingManagedBattles(String authorizationHeader) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<Tournament> listTournament = tournamentManager.getMyOngoingManagedTournaments(authorizationHeader);
            List<Battle> fullBattleList = new ArrayList<>();
            for(Tournament tournament : listTournament) {
                List<Battle> listPart = getOngoingBattlesFromTournament(authorizationHeader, tournament.getUuid().toString());
                fullBattleList.addAll(listPart);
            }
            return fullBattleList;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getBattlesFromTournament(String authorizationHeader, String tournament_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getBattlesFromTournament(tournament_uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getOngoingBattles(String authorizationHeader) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getOngoingBattles();
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getOngoingBattlesFromTournament(String authorizationHeader, String tournament_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getOngoingBattlesFromTournament(tournament_uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public List<Battle> getOngoingBattlesFromUser(String authorizationHeader, UUID user_uuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.getOngoingBattlesFromUser(user_uuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public UserBattleStatus getBattleUserStatus(String authorizationHeader, String battleUuid) throws IOException {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<Battle> list = getMyManagedBattles(authorizationHeader);
            for(Battle battle : list) {
                if(Objects.equals(battle.getUuid().toString(), battleUuid))
                    return UserBattleStatus.MANAGING;
            }

            list = getMyBattles(authorizationHeader);
            for(Battle battle : list) {
                if(Objects.equals(battle.getUuid().toString(), battleUuid))
                    return UserBattleStatus.ENROLLED;
            }

            return UserBattleStatus.EXTERNAL;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean updateValue(String authorizationHeader, DataUpdate dataUpdate) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.updateValue(dataUpdate);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean enrollMeInBattle(String authorizationHeader, String battleUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            String token = accountManager.getTokenFromHeader(authorizationHeader);
            String userUuid = accountManager.getUuidFromToken(token);
            return battleData.enrollUserInBattle(battleUuid, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    public boolean enrollUserInBattle(String authorizationHeader, String battleUuid, String userUuid) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            return battleData.enrollUserInBattle(battleUuid, userUuid);
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    //this function closes the battle
    public boolean closeBattle(String authorizationHeader, String battleUuid, String motivation) {
        if(accountManager.isAcceptedHeader(authorizationHeader)) {
            List<User> list = accountManager.getUsersEnrolledInBattle(authorizationHeader, battleUuid);
            Battle b1 = getBattleWithUuid(authorizationHeader, battleUuid);
            NotificationInput notificationInput;
            for(User user : list) {
                notificationInput = new NotificationInput(
                        user.getUuid(),
                        String.format("The battle %s has been closed", b1.getName()),
                        motivation,
                        NotificationCategory.GENERIC_NOTIFICATION,
                        battleUuid);
                notificationManager.sendNotificationApp(authorizationHeader, notificationInput);
            }
            DataUpdate dataUpdate = new DataUpdate(battleUuid, "date_closure", LocalDate.now().toString());
            updateValue(authorizationHeader, dataUpdate);
            dataUpdate = new DataUpdate(battleUuid, "closed_early", "1");
            updateValue(authorizationHeader, dataUpdate);
            return true;
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Authorization header not correct");
        }
    }

    private static void unzip(String zipFilePath, String destDirectory) throws IOException {
        try (ZipInputStream zipIn = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry entry = zipIn.getNextEntry();

            while (entry != null) {
                String filePath = destDirectory + java.io.File.separator + entry.getName();

                if (!entry.isDirectory()) {
                    extractFile(zipIn, filePath);
                } else {
                    // If the entry is a directory, create it
                    java.io.File dir = new java.io.File(filePath);
                    dir.mkdirs();
                }

                zipIn.closeEntry();
                entry = zipIn.getNextEntry();
            }
        }
    }

    private static void extractFile(ZipInputStream zipIn, String filePath) throws IOException {
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            byte[] buffer = new byte[1024];
            int len;
            while ((len = zipIn.read(buffer)) > 0) {
                fos.write(buffer, 0, len);
            }
        }
    }
}
