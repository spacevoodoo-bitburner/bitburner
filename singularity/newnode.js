export async function main(ns){
    ns.singularity.commitCrime("Mug");
    ns.exec("/singularity/nodestartup.js", "home", 1, 8192, 1, 2, 5000);
    while (ns.getServerMaxRam("home") < 256){
        await ns.sleep(1000);
    }
    ns.exec("/basic/killall.js", "home");
    ns.killall("home", true);
    ns.exec("/singularity/spinup.js", "home", 1, "gang", "hive");
}