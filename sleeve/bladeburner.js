export async function main(ns) {
    let numSleeves = ns.sleeve.getNumSleeves();
    let actions = ["Bounty Hunter", "Retirement", "Tracking", "Infiltrate Synthoids", "Hyperbolic Regeneration Chamber", "Field Analysis", "Diplomacy", "Training"];

    for (let i = 0; i < numSleeves; ++i){
        let action = actions[i];
        if (i < 3){
            ns.sleeve.setToBladeburnerAction(i, "Take on contracts", action);
        } else {
            ns.sleeve.setToBladeburnerAction(i, action);
        }
    }
}