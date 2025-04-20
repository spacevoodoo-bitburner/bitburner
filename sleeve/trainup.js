export async function main(ns) {
    let numSleeves = ns.sleeve.getNumSleeves();
    let actions = ["str", "def", "dex", "agi", "Algorithms", "Leadership", "Leadership", "Algorithms"]

    for (let i = 0; i < numSleeves; ++i){
        let sleevedata = ns.sleeve.getSleeve(i);
        if (sleevedata.shock > 0){
            ns.sleeve.setToShockRecovery(i);
        }
    }
    while (ns.sleeve.getSleeve(0).shock > 0){
        await ns.sleep(500);
    }
    for (let i = 0; i < numSleeves; ++i){
        let action = actions[i];
        if (i < 4){
            ns.sleeve.travel(i, "Sector-12");
            ns.sleeve.setToGymWorkout(i, "Powerhouse Gym", action);
        } else {
            ns.sleeve.travel(i, "Volhaven");
            ns.sleeve.setToUniversityCourse(i, "ZB Institute of Technology", action);
        }
    }
}