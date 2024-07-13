// log in the user
// should return the token
// should pass the email and the password
export const login = async (credentialsJson) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (credentialsJson.email === 'test@test.com' && credentialsJson.password === 'password') {
                resolve({ token: 'fake_token', message: 'Login successful'});
            } else {
                reject({message: 'Invalid email or password'});
            }
        }, 1000);
    });
}

// checks that the toker is valid
// should pass the token
// should return true if the token is valid, false otherwise
export const isTokenAcceptable = async (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Valid Token', isValid: true});
            } else {
                reject({ message: 'Invalid Token', isValid: false});
            }
        }, 500);
    });
}

// sing up function
// should pass the credentials (email, password, firstname, lastname)
// should return a generic confirmation message
export const signUp = async (credentialsJson) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (credentialsJson.username && credentialsJson.password && credentialsJson.firstname && credentialsJson.lastname) {
                resolve({ message: 'Signup successful' });
            } else {
                reject({message: 'All fields are required'});
            }
        }, 1000);
    });
}

// get the list of tournaments of the user (educator or not).
// should pass the token
// should return the list of tournaments . For every tournament the name, the last change (a date), the status (subscribed, managing, not subscribed) and the number of partecipants is returned and the associated image
export const getTournamentsOfUser = async (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve(tournaments.filter(tournament => tournament.status !== 'not subscribed'));
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });
}

// get the list of popular tournaments.
// should pass the token
// should return the list of tournaments . For every tournament the name, the last change (a date), the status (subscribed, managing, not subscribed) and the number of partecipants is returned and the associated image
export const getTournamentsPopular = async (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve(tournaments);
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });
}

// creates a new tournament
// should pass the token and the tournament data (name, description, image)
// should return a generic confirmation message
export const createTournament = async (token, tournamentJson) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Tournament created successfully' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    });
}

// creates a new battle
// should pass the token and the tournament data (name, description, start date, end date, codekata)
// should return a generic confirmation message
export const createBattle = async (token, battleJson) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Tournament created successfully' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    });
}

// get The username
// should pass the token
// should return the username
export const getUsername = async (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ username: 'Test User' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    });
}

// get the info of a tournament given the id
export const getTournament = async (token, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                const tournament = tournaments.find(tournament => tournament.id === id);
                if (tournament) {
                    resolve(tournament);
                } else {
                    reject('Tournament not found');
                }
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });
}

// subscribe to a tournament given the id
export const subscribe = async (token, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Subscribed successfully' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    });
}

// get the list of battles of the tournament
// should pass the token and the tournament id
export const getBattlesOfTournament = async (token, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                const battlesOfTournament = battles;
                resolve(battlesOfTournament);
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });
}

// get the status of a user in respect to a battle
// should pass the token and the battle id
// should return if the user is subscribed, managing or not subscribed and if it's on a group (wich has crated or not)
export const getUserStatusBattlewise = async (token, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                const randomIndex = Math.floor(Math.random() * userstatus.length);
                const userStatus = userstatus[randomIndex];
                resolve(userStatus);
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });

}

//enroll to a battle
// should pass the token and the battle id
// should return a generic confirmation message
export const enroll = async (token, id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Enrolled successfully' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    }
    );
}

// create a group
// should pass the token and the group data (name and list of partecipants)
// should return a generic confirmation message
export const createGroup = async (token, groupJson) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                resolve({ message: 'Group created successfully' });
            } else {
                reject({message: 'Invalid token'});
            }
        }, 1000);
    });
}

export const findUser = async (token, battleId, username) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (token === 'fake_token') {
                const users = [
                    {
                        username: 'user1',
                        email: 'pollo@mail.com'
                    },];
                resolve(users);
            } else {
                reject('Invalid token');
            }
        }, 1000);
    });

}

//get the notification for the user
// should pass the token
// should return the list of notifications (for every notification the text and the date, and also if it needs a button or not)
export const getNotifications = async (token) => {
    // Simula un ritardo di rete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Restituisci un array di notifiche di prova
    return [
        { message: 'Notification 1' },
        { message: 'Notification 2' },
        { message: 'Notification 3' },
    ];
};

// get the list of battles of the tournament
// should pass the token and the tournament id
// should return the list of battles. For every battle the name, the last change (a date), the status (subscribed, managing, not subscribed) and the number of partecipants is returned and the associated image

// lore ipsum text for the tournament description
const tournamentDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget lectus neque. Nam placerat mi eget condimentum viverra. Morbi dignissim sollicitudin aliquet. Quisque pharetra purus mauris, vel mollis justo aliquet at. Fusce ultrices facilisis luctus. Nam vitae molestie sem. Cras malesuada ultrices nisl, in ullamcorper velit rutrum sit amet. Quisque in velit bibendum, mattis velit a, condimentum dolor. Phasellus ac maximus libero. Pellentesque pulvinar hendrerit egestas. Quisque hendrerit tortor eu sapien mattis, eu pharetra nisi dictum. Aenean id odio at nisl iaculis bibendum in sed nisl. Donec consectetur est ut congue ultrices. Aliquam luctus facilisis suscipit. Vivamus sollicitudin semper dui, sit amet pellentesque est tincidunt sit amet. Morbi dictum at felis a ornare.In quis sem at velit sagittis vestibulum vitae eget ante. Curabitur nec lacinia arcu. Phasellus a leo est. Fusce et dui quis nibh vulputate faucibus. Suspendisse potenti. Integer non dictum mi, sit amet rutrum erat. Quisque vitae pellentesque ex. Vivamus ullamcorper tincidunt dignissim. In scelerisque dui eu mi porttitor rutrum. Cras dapibus semper luctus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean nec lectus nec erat ultrices venenatis. Praesent varius est leo, ut pulvinar nulla ullamcorper eu.Ut consequat convallis mattis. Aenean mi tellus, volutpat lacinia iaculis nec, tempor sed eros. Nam malesuada libero risus, et imperdiet neque scelerisque quis. Sed vitae dapibus ante. Aliquam dapibus erat in tellus condimentum porta. Quisque ut semper est, quis luctus tortor. Nulla id mi felis.Integer eu diam vel nibh consectetur consequat. Praesent magna mauris, ornare vitae quam sed, rhoncus euismod quam. Suspendisse feugiat tellus eget sapien consectetur, quis tempor diam feugiat. Suspendisse vel est ligula. Nulla vel ultricies justo. In mollis rutrum ante vel feugiat. Vivamus efficitur, est eu facilisis consequat, diam lectus sodales magna, quis posuere turpis massa vitae dui. Pellentesque ultrices pharetra dolor, ac faucibus purus ultricies ut. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin feugiat, turpis nec porta porta, nisi metus dictum lacus, sit amet condimentum ipsum nibh a erat. Suspendisse ac augue ac metus varius lobortis. Ut non vestibulum ex, et tempus arcu. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla in magna urna.Duis velit nunc, commodo eget iaculis vel, porttitor ut risus. Ut finibus libero lacus, suscipit ornare dui finibus eget. Integer auctor velit sem, et ultricies orci sagittis a. Curabitur turpis lectus, volutpat non diam in, tempus laoreet lectus. Nulla facilisi. Mauris sit amet sollicitudin purus, id eleifend est. Mauris egestas viverra cursus. Curabitur tristique mauris elementum metus pellentesque, consectetur hendrerit neque congue. Nullam tempor ante et metus laoreet tempor. Nunc fermentum vel massa vel viverra. Morbi fringilla tincidunt velit molestie auctor."
const tournaments = [
    {
        name: 'My Tournament 1',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'subscribed',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 1
    },
    {
        name: 'My Tournament 2',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'managing',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 2
    },
    {
        name: 'My Tournament 3',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'subscribed',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 3
    },
    {
        name: 'Tournament 4',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'subscribed',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 4
    },
    {
        name: 'Tournament 5',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'not subscribed',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 5
    },
    {
        name: 'Tournament 6',
        lastChange: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        status: 'not subscribed',
        numberOfParticipants: Math.floor(Math.random() * 100),
        description: `${tournamentDescription}`,
        image: 'ApplicationPictures/tournamentCardPicture',
        id: 6
    }
];

const battles = [
    {
        name: 'My Battle 1',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'active',
        battleId: 1,
        
        codeKataUrl: 'https://github.com/something/something'
    },
    {
        name: 'My Battle 2',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'past',
        battleId: 2,
        
        codeKataUrl: 'https://github.com/something/something'
    },
    {
        name: 'My Battle 3',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'future',
        battleId: 3,
        
        codeKataUrl: 'https://github.com/something/something'
    },
    {
        name: 'My Battle 4',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'active',
        battleId: 4,
        
        codeKataUrl: 'https://github.com/something/something'
    },
    {
        name: 'My Battle 5',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'past',
        battleId: 5,
        
        codeKataUrl: 'https://github.com/something/something'
    },
    {
        name: 'My Battle 6',
        description: `${tournamentDescription}`,
        startDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        endDate: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        teamMinimumSize: 1,
        teamMaximumSize: 2,
        battleStatus: 'future',
        battleId: 6,
        
        codeKataUrl: 'https://github.com/something/something'
    }
];

const userstatus = [
    {
        userStatus: 'enrolled',
        groupName: 'Group 1',
        groupStatus: 'participating'
    },
    {
        userStatus: 'owner',
        groupName: 'Group 2',
        groupStatus: 'creator'
    },
    {
        userStatus: 'not enrolled',
        groupName: null,
        groupStatus: null
    },
    {
        userStatus: 'assistant',
        groupName: 'Group 3',
        groupStatus: 'participating'
    },
    {
        userStatus: 'enrolled',
        groupName: 'Group 4',
        groupStatus: 'creator'
    },
    {
        userStatus: 'assistant',
        groupName: null,
        groupStatus: null
    }
];