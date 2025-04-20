export async function main(ns){
    ns.singularity.connect(ns.args[0]);
    let server = ns.getServer(ns.args[0]);
    if (!server.backdoorInstalled){
        await ns.singularity.installBackdoor();
    }
}