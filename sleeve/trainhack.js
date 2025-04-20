export async function main(ns) {
    let numSleeves = ns.sleeve.getNumSleeves();

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
        ns.sleeve.travel(i, "Volhaven");
        ns.sleeve.setToUniversityCourse(i, "ZB Institute of Technology", "Algorithms");
    }
}