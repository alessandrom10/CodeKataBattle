module projectSE2
open util/boolean

sig Email {}
sig TestCase {}
sig BuildAutomationScript {}
sig string {}

sig User {
    email: one Email,
    password: one string,
    name: one string,
    surname: one string,
    nickname: lone string
}

sig Student extends User {
    var tournaments: some Tournament
}

sig Educator extends User {
    var tournamentsOwned: set Tournament,
    var tournamentsModerator: set Tournament
}{
    #tournamentsOwned + #tournamentsModerator > 0
}

sig Battle {
    name: one string,
    description: lone string,
    owner: one Educator,
    var enrolledStudentList: set Student,
    codeKata: one CodeKata,
    teamMinimumSize: one Int,
    teamMaximumSize: one Int,
    var groupList: set Group,
    battleEvent: one Event,
    var solutionList: set Solution,
    manualReview: one Bool
}{
    teamMinimumSize <= teamMaximumSize
    teamMinimumSize >= 1
    #enrolledStudentList <= #enrolledStudentList'
    #groupList <= #groupList'
    #solutionList <= #solutionList'
}

sig Tournament {
    name: one string,
    owner: one Educator,
    var administratorList: set Educator,
    var subscribedStudentList: set Student,
    var battleList: set Battle,
    tournamentEvent: one Event
}{
    owner in administratorList
    #administratorList > 0
    #subscribedStudentList <= #subscribedStudentList'

}

sig Solution {
    groupID: one Int,
    automatedScore: one Int,
    manualReviewScore: lone Int
}{
    automatedScore >= 0 and automatedScore <= 7 // should be 100, limited by alloy
}

sig CodeKata {
    description: one string,
    testCases: some TestCase,
    buildAutomationScript: some BuildAutomationScript
}

sig Group {
    name: one string,
    groupID: one Int,
    var studentList: some Student,
    var size: one Int
}{
    size = #studentList
}

sig Event {
    startDate: one Int,
    endDate: one Int,
}{
    startDate < endDate
}


// ------------------------ MODEL CONSTRAINTS ------------------------

// all user have a unique email address and a unique nickname if set
fact {
    always (all disj u1, u2: User | u1.email != u2.email and
    (u1.nickname != none implies u1.nickname != u2.nickname))
}

// every Email is associated to one User
fact {
    always (all e: Email | one u: User | u.email = e)
}

// students and tournaments are associated to each other
fact {
    always (all s: Student, t: Tournament | s in t.subscribedStudentList iff t in s.tournaments)
}

// educators and tournaments are associated to each other
fact {
    always (all t: Tournament, e: Educator | t.owner = e iff t in e.tournamentsOwned)
    always (all t: Tournament, e: Educator | e in t.administratorList iff (t in e.tournamentsModerator or t.owner = e))
}

// all battles are associated to a tournament
fact {
    always (all b: Battle | one t: Tournament | b in t.battleList)
}

// all battles in a tournament must have a unique name
fact {
    always (all t: Tournament | all disj b1, b2: t.battleList |  b1.name != b2.name)
}

// all battles' owner must be an educator of the tournament
fact {
    always (all t: Tournament | all b: t.battleList | b.owner in t.administratorList)
}

// all groups in the battle must have the cardinality between teamMinimumSize and teamMaximumSize
fact {
    always (all b: Battle | all g: b.groupList | g.size >= b.teamMinimumSize && g.size <= b.teamMaximumSize)
}

// all enrolled students in the battle must be also subscribed to the tournament
fact {
    always (all t: Tournament | all b: t.battleList | all s: b.enrolledStudentList | s in t.subscribedStudentList)
}

// all battles associtated to a tournament must start and end during the tournament
fact {
    always (all t: Tournament | all b: t.battleList | b.battleEvent.startDate >= t.tournamentEvent.startDate && b.battleEvent.endDate <= t.tournamentEvent.endDate)
}

// all battles in a tournament must not overlap in time
fact {
    always (all t: Tournament | all disj b1, b2: t.battleList | b1.battleEvent.startDate > b2.battleEvent.endDate or b1.battleEvent.endDate < b2.battleEvent.startDate)
}

// all groups in a battle must have a unique name
fact {
    always (all b: Battle | all disj g1, g2: b.groupList | g1.name != g2.name)
}

// all groups in a battle must be composed by students that are enrolled in the battle
fact {
    always (all b: Battle | all g: b.groupList | all s: g.studentList | s in b.enrolledStudentList)
}

// a student can be in only subscribe to a group per battle
fact {
    always (all b: Battle | all g: b.groupList | all disj s1, s2: g.studentList | s1 != s2)
    always (all b: Battle | all disj g1, g2: b.groupList | all s: Student | s in g1.studentList implies (not s in g2.studentList))
}

// all tournaments must have a unique name
fact {
    always (all disj t1, t2: Tournament | t1.name != t2.name)
}

// all solutions are associated to a battle
fact {
    always (all s: Solution | one b: Battle | s in b.solutionList)
}

// a solution is present in a battle if and only if the group is present in the battle
fact {
    always (all b: Battle, s: Solution | (s in b.solutionList) iff (some g: b.groupList | s.groupID = g.groupID))
}

// all solutions must have an existing groupID
fact {
    always (all s: Solution | one g: Group | s.groupID = g.groupID)
}

// all solutions have a manualReviewScore if and only if the manualReview is true in the battle
fact {
    always (all b: Battle, s: b.solutionList | (s.manualReviewScore != none iff b.manualReview = True))
}

// all groups have a uniqie groupID
fact {
    always (all disj g1, g2: Group | g1.groupID != g2.groupID)
}

// all groups are associated to a battle
fact {
    always (all g: Group | one b: Battle | g in b.groupList)
}

// all event is associated to a tournament or a battle
fact {
    always (all e: Event | one t: Tournament | e in t.tournamentEvent || one b: Battle | e in b.battleEvent)
}

// all code katas are associated to a battle
fact {
    always (all ck: CodeKata | one b: Battle | ck in b.codeKata)
}

// all test cases are associated to a code kata
fact {
    always (all tc: TestCase | one ck: CodeKata | tc in ck.testCases)
}

// all build automation scripts are associated to a code kata
fact {
    always (all bas: BuildAutomationScript | one ck: CodeKata | bas in ck.buildAutomationScript)
}

// ------------------------------- GOALS -------------------------------

// G1: Have his/her own profile on the application
assert DifferentEmailOrNicknameImpliesDifferentUsers {
    all u1, u2: User | u1.email != u2.email implies u1 != u2
    all u1, u2: User | u1.nickname != u2.nickname implies u1 != u2
}


// G2: Participate in a coding tournament
assert StudentsSubscribedToBattleAlsoSubscribedToTournament {
    all b: Battle, s: b.enrolledStudentList | one t: Tournament | b in t.battleList and s in t.subscribedStudentList
}

pred StudentParticipatesInTournament[s: Student, t: Tournament] {
    one b: Battle | b in t.battleList and s in b.enrolledStudentList
    #t.subscribedStudentList < #t.subscribedStudentList'
}


// G3: Cooperate with colleagues
assert StudentInGroupAlsoInBattle {
    all g: Group, s: g.studentList, b: Battle | g in b.groupList implies s in b.enrolledStudentList
}

assert NoLoneSolution {
    all b: Battle, s: b.solutionList | one g: Group | s.groupID = g.groupID
    all b: Battle, g: Group, s: Solution | (not g in b.groupList) implies (not (s in b.solutionList and s.groupID = g.groupID))
}

assert GroupSizeIsCorrect {
    all g: Group | g.size = #g.studentList
    all b: Battle, g: b.groupList | g.size >= b.teamMinimumSize and g.size <= b.teamMaximumSize
}

pred StudentCollaborateWithColleagues[stud: Student, g: Group, sol: Solution] {
    stud in g.studentList
    sol.groupID = g.groupID
    g.size > 1
}


// G4 : Review their own performance score
fun solutionsOfStudentInTournament(s: Student, t: Tournament): set Solution {
    {sol: Solution | some b: t.battleList, g: b.groupList | s in g.studentList and sol in b.solutionList and sol.groupID = g.groupID}
}

pred showStudentSolutions[stud: Student, t: Tournament, sols: set Solution] {
    sols = solutionsOfStudentInTournament[stud, t]
    #sols > 1
}


// G5: Organize coding tournaments
assert NoEducatorWithoutTournament {
    all e: Educator | some t: Tournament | e in t.administratorList
}

assert NoOverlappingBattles {
    all t: Tournament | all disj b1, b2: t.battleList | (b1.battleEvent.startDate < b2.battleEvent.startDate) implies (b1.battleEvent.endDate < b2.battleEvent.startDate) 
}

pred showEducatorsInTournament[t: Tournament, edus: set Educator] {
    edus = t.administratorList
    #edus > 1
}


// G6: Run coding battles in their tournaments
assert BattleOwnerIsEducatorOfTournament {
    all t: Tournament, b: t.battleList | b.owner in t.administratorList
}


// G7: Close an existing coding battle in their tournaments
pred showClosedBattle[t: Tournament] {
    #t.battleList > #t.battleList'
}


// G8 & G9: Obtain an automated evaluation over a student solution & Manually review students submissions
assert CorrectSolutionScore{
    all s: Solution | s.automatedScore != none
    all b: Battle, s: b.solutionList | s.manualReviewScore != none iff b.manualReview = True
}

// ------------------------------- RUNS -------------------------------
check DifferentEmailOrNicknameImpliesDifferentUsers for 15 but 3 steps
check StudentsSubscribedToBattleAlsoSubscribedToTournament for 15 but 3 steps
check StudentInGroupAlsoInBattle for 15 but 3 steps
check NoLoneSolution for 10 but 3 steps
check GroupSizeIsCorrect for 15 but 3 steps
check NoEducatorWithoutTournament for 15 but 3 steps
check NoOverlappingBattles for 5 but 3 steps
check BattleOwnerIsEducatorOfTournament for 15 but 3 steps
check CorrectSolutionScore for 15 but 3 steps

run StudentParticipatesInTournament for 20 but exactly 3 steps
run StudentCollaborateWithColleagues for 20 but exactly 3 steps
run showStudentSolutions for 20 but exactly 3 steps
run showEducatorsInTournament for 20 but exactly 3 steps
run showClosedBattle for 20 but exactly 3 steps