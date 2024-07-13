package it.polimi.se2.grazzanimasini.ckb.managers;

import it.polimi.se2.grazzanimasini.ckb.controllers.model.DataUpdate;
import it.polimi.se2.grazzanimasini.ckb.database.model.Battle;
import it.polimi.se2.grazzanimasini.ckb.database.model.Group;
import org.eclipse.jgit.api.PullCommand;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.eclipse.jgit.api.Git;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

import static java.rmi.server.RMIClassLoader.loadClass;

@Service
public class DeliveryEvaluationManager {

    private GroupManager groupManager;
    @Value(("${resourcesPath}"))
    private String resourcePath;

    @Value(("${ckSubPath}"))
    private String ckSubPath;
    @Value(("${expectedInputSubPath}"))
    private String expectedInputSubPath;
    @Value(("${expectedOutputSubPath}"))
    private String expectedOutputSubPath;
    @Value(("${repositoriesForEvaluationSubPath}"))
    private String repositoriesForEvaluationSubPath;
    @Value(("${java.home}"))
    private String javaHome;

    public DeliveryEvaluationManager(GroupManager groupManager) {
        this.groupManager = groupManager;
    }

    public boolean newPushPerformed(String authorizationHeader, Battle currentBattle, Group currentGroup, String repositoryUrl) {
        try {
            System.out.println("New push has been performed");
            String localRepositoryFolder = cloneAndPullRepository(repositoryUrl);
            System.out.println("Before evaluation");
            int newScore = evaluate(authorizationHeader, localRepositoryFolder, currentBattle, currentGroup);
            System.out.println("After evaluation");

            //after the evaluation is performed, the score of the group is changed accordingly
            DataUpdate dataUpdate = new DataUpdate(currentGroup.getUuid().toString(), "score", String.valueOf(newScore));
            groupManager.updateGroupValue(authorizationHeader, dataUpdate);
            System.out.println("Before final return");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public String cloneAndPullRepository(String repositoryUrl) {
        try {
            String uuid = UUID.randomUUID().toString();
            String localRepositoryFolder = resourcePath + repositoriesForEvaluationSubPath + "/" + uuid;
            Files.createDirectories(Paths.get(localRepositoryFolder));

            //Clone the user's repository
            Git git =    Git.cloneRepository()
                            .setURI(repositoryUrl)
                            .setDirectory(new File(localRepositoryFolder))
                            .call();

            //Pull the user's repository
            PullCommand pullCmd = git.pull();
            pullCmd.call();

            git.close();
            return localRepositoryFolder;
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

    public int evaluate(String authorizationHeader, String downloadedRepositoryFolder, Battle currentBattle, Group currentGroup) throws IOException, InterruptedException {
        int totalNumberOfTestCases = 0;
        int testCasesPassed = 0;

        //this file contains the sets of input that are expected to be fed to the executable provided (executableName.jar)
        //there can be more parameters for each row, but each row will correspond to a single test case
        File expectedInputFile = new File(resourcePath + ckSubPath + "/" + currentBattle.getName() + "_ck" + expectedInputSubPath);

        //this file instead will have with the same logic as before (there can be more values for each line, but each line is a
        //single test case) the output that is expected from our executable, if such output will be different, the test case
        //will be considered as failed
        File expectedOutputFile = new File(resourcePath + ckSubPath + "/" + currentBattle.getName() + "_ck" + expectedOutputSubPath);
        File executableToTest = new File(downloadedRepositoryFolder + "/" + currentBattle.getExecutableName());

        BufferedReader expectedInputBuffer = new BufferedReader(new FileReader(expectedInputFile));
        BufferedReader expectedOutputBuffer = new BufferedReader(new FileReader(expectedOutputFile));

        //here for each line of both the expectedInput and expectedOutput, the java executable is launched and the
        //test is evaluated
        String line;
        while ((line = expectedInputBuffer.readLine()) != null) {
            totalNumberOfTestCases++;
            ProcessBuilder processBuilder = new ProcessBuilder(javaHome + "/bin/java.exe",
                                                                "-jar",
                                                                executableToTest.getCanonicalPath(),
                                                                line);
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            InputStream inputStream = process.getInputStream();
            BufferedReader readerExecutable = new BufferedReader(new InputStreamReader(inputStream));
            String executableLine = readerExecutable.readLine();
            if(Objects.equals(executableLine, expectedOutputBuffer.readLine())) {
                testCasesPassed++;
            }
        }

        return (testCasesPassed/totalNumberOfTestCases) * 10;
    }
}
