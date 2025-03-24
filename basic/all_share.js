import { scanall } from "/basic/scanner.js";

export async function main(ns) {
  let servers = await scanall(ns);
  let purchasedservers = ns.getPurchasedServers();

  for (let i = 0; i < servers.length; ++i){
    let host = servers[i]["name"];
    let freeram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - ns.getScriptRam("/basic/execute_share.js", host);
    let scriptram = ns.getScriptRam("/basic/share.js", host);
    let threads = Math.floor(freeram/scriptram);
    ns.scp("/basic/execute_share.js", host);
    ns.scp("/basic/share.js", host);
    ns.exec("/basic/execute_share.js", host, 1, host, threads);
  }
  for (let i = 0; i < purchasedservers.length; ++i){
    let host = purchasedservers[i];
    let freeram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - ns.getScriptRam("/basic/execute_share.js", host);
    let scriptram = ns.getScriptRam("/basic/share.js", host);
    let threads = Math.floor(freeram/scriptram);
    ns.scp("/basic/execute_share.js", host);
    ns.scp("/basic/share.js", host);
    ns.exec("/basic/execute_share.js", host, 1, host, threads);
  }
}