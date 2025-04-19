export async function main(ns) {
    let karma = ns.heart.break();
    let numSleeves = ns.sleeve.getNumSleeves();

    while (karma > -54000){
        for (let i = 0; i < numSleeves; ++i){
            let sleevedata = ns.sleeve.getSleeve(i);
            if (sleevedata.shock > 0){
                ns.sleeve.setToShockRecovery(i);
            } else {
                if (sleevedata.skills.strength < 75){
                ns.sleeve.setToCommitCrime(i, "Mug");
                } else {
                ns.sleeve.setToCommitCrime(i, "Homicide");
                }
            }
        }
        await ns.sleep(10000);
        karma = ns.heart.break();
    }
}