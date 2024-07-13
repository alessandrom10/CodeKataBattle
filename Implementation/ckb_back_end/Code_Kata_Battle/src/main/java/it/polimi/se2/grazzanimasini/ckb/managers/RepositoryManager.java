package it.polimi.se2.grazzanimasini.ckb.managers;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.CredentialsProvider;
import org.eclipse.jgit.transport.URIish;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.kohsuke.github.GHCreateRepositoryBuilder;
import org.kohsuke.github.GitHub;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.File;
import java.io.IOException;

@Service
public class RepositoryManager {
    @Value("${github.token}")
    private String githubToken;
    @Value(("${github.username}"))
    private String username;

    @Value(("${github.email}"))
    private String email;

    //this function actually creates the repository for our newly created battle
    public void createRepository(String repositoryName) {
        try {
            GitHub github = GitHub.connectUsingOAuth(githubToken);

            //Create a new GitHub repository
            GHCreateRepositoryBuilder repositoryBuilder = github.createRepository(repositoryName)
                    .description("Repository created using GitHub API")
                    .private_(false);

            repositoryBuilder.create();
        } catch (IOException e) {
            System.out.println("Error creating the repository");
            e.printStackTrace();
        }
    }

    //this function actually pushes our code kata (which provided in zip format has then be unzipped) to the
    //newly created repository
    public void pushFolderToGitHub(String repositoryName, File localFolder) {
        try {
            //Open the local repository
            Git git = Git.init().setDirectory(localFolder).call();

            //Set up credentials
            CredentialsProvider credentialsProvider = new UsernamePasswordCredentialsProvider(githubToken, githubToken);

            String gitRepositoryUrl = String.format("https://github.com/%s/%s.git", username, repositoryName);
            git.remoteSetUrl()
                    .setRemoteUri(new URIish(gitRepositoryUrl))
                    .setRemoteName("origin")
                    .call();

            //Add and commit changes
            git.add().addFilepattern(".").call();
            git.commit().setMessage("Add changes").call();

            //Push changes to the remote repository
            git.push().setCredentialsProvider(credentialsProvider).call();

            System.out.println("Folder pushed to the remote repository successfully.");
        } catch (GitAPIException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public String getGithubToken() {
        return githubToken;
    }

    public void setGithubToken(String githubToken) {
        this.githubToken = githubToken;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
