import { scanall } from "/basic/scanner.js";
import { queenbee } from "/hive/queen.js";

export async function main(ns) {
  //when a hive is initialized, read port 1000 for the queen data
  //swarm will always initialize queen before hive for this reason
  let starttime = Date.now();
  let probstring = "NULL PORT DATA";
  while (probstring === "NULL PORT DATA"){
    probstring = ns.readPort(1000);
    await ns.sleep(10);
  }
  let probs = JSON.parse(probstring);
  //get hives and targets
  let servers = await scanall(ns);
  let purchasedservers = [];
  let targets = [];
  const host = ns.getHostname();
  let port = 1;
  for (let i = 0; i < servers.length; ++i){
    let serv = servers[i]["name"];
    if (serv.includes("pserv")){
      purchasedservers.push(servers[i]);
    } else if (serv == "home"){} else {
      targets.push(servers[i]);
    }
    //ns.exec("/singularity/backdoor.js", host, 1, servers[i]["name"]);
  }
  //figure out how much room you have for workers and initialize starting values
  let freeram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
  let usedram = ns.getServerUsedRam(host);
  let scriptram = ns.getScriptRam("/hive/worker.js", host);
  

  let hackports = [];
  let growports = [];
  let weakenports = [];
  let maxhack = 1;
  let maxgrow = 1;
  let maxweaken = 1;
  while (true){
    //every loop check port 1000 for a new queen.  If one is found update probs.
    usedram = ns.getServerUsedRam(host)
    probstring = ns.readPort(1000);
    freeram = ns.getServerMaxRam(host) - usedram;
    if (probstring != "NULL PORT DATA"){
      probs = JSON.parse(probstring);
    }
    if (typeof probs[0] === 'undefined'){
      probstring = await queenbee(ns);
      probs = JSON.parse(probstring);
    }
    if (typeof probs[0]["probability"] === 'undefined'){
      probstring = await queenbee(ns);
      probs = JSON.parse(probstring);
    }
    let memReserve = 1;
    if (ns.args[0] > 1){
      memReserve = targets.length;
    }
    //if there is enough room for more workers, the hive is allowed to make more workers.  Otherwise wait.
    if (usedram < ns.getServerMaxRam(host) - scriptram * memReserve * ns.args[0]){
    //generate a random number and check against probs to see which hack function will be performed
      let rand = Math.random();
      let prob1 = probs[0]["probability"];
      let prob2 = probs[0]["probability"] + probs[1]["probability"];
      ns.print("Max Hack: " + maxhack.toString());
      ns.print("Max Grow: " + maxgrow.toString());
      ns.print("Max Weaken: " + maxweaken.toString());
      if (rand <= prob1){
        //if it's hack, generate a random number, loop through all servers and
        //execute hack if it's hackwaggle is greater than that number.
        //it will be the same if probs tells us to grow or weaken, but for their waggles
        let servercheck = Math.random() * maxhack;
        for (let i = 0; i < targets.length; ++i){
          if (targets[i]["hackwaggle"] <= 0.00001 || typeof targets[i]["hackwaggle"] === 'undefined'){
            targets[i]["hackwaggle"] = 1;
          }
          if (targets[i]["hackwaggle"] >= servercheck){
            let obj = {};
            obj["server"] = targets[i]["name"];
            obj["port"] = port;
            hackports.push(obj);
            ns.exec("/hive/worker.js", host, ns.args[0], "hack", targets[i]["name"], port);
            port += 1;
            usedram += scriptram;
          }
        }
      } else if (rand > prob1 && rand <= prob2){
        
        let servercheck = Math.random() * maxgrow;
        for (let i = 0; i < targets.length; ++i){
          if (targets[i]["growwaggle"] <= 0.00001 || typeof targets[i]["growwaggle"] === 'undefined'){
            targets[i]["growwaggle"] = 1;
          }
          if (targets[i]["growwaggle"] >= servercheck){
            let obj = {};
            obj["server"] = targets[i]["name"];
            obj["port"] = port;
            growports.push(obj);
            ns.exec("/hive/worker.js", host, ns.args[0], "grow", targets[i]["name"], port);
            port += 1;
          }
        }
      } else {
        let servercheck = Math.random() * maxweaken;
        for (let i = 0; i < targets.length; ++i){
          if (targets[i]["weakenwaggle"] <= 0.00001 || targets[i]["weakenwaggle"] === 'undefined'){
            targets[i]["weakenwaggle"] = 1;
          }
          if (targets[i]["weakenwaggle"] >= servercheck){
            let obj = {};
            obj["server"] = targets[i]["name"];
            obj["port"] = port;
            weakenports.push(obj);
            ns.exec("/hive/worker.js", host, ns.args[0], "weaken", targets[i]["name"], port);
            port += 1;
          }
        }
      }
    }
    //check updated ports, update waggles, update used ram, and repeat loop
    if (hackports.length > 0){
      let finished = [];
      for (let i = 0; i < hackports.length; ++i){
        let thiswaggle = ns.readPort(hackports[i]["port"]);
        if (thiswaggle != "NULL PORT DATA"){
          for (let j = 0; j < targets.length; ++j){
            if (targets[j]["name"] == hackports[i]["server"]){
              let lastwaggle = targets[j]["hackwaggle"];
              targets[j]["hackwaggle"] = (thiswaggle + lastwaggle) / 2;
              finished.push(i);
              if (thiswaggle > maxhack){
                maxhack = (thiswaggle + lastwaggle) / 2;
              }
            }
          }
        } 
      }
      //remove used ports from array after loop to avoid index errors
      for (let i = 0; i < finished.length; ++i){
        hackports.splice(finished[i], 1);
      }
      finished = [];
    }
    if (growports.length > 0){
      let finished = [];
      for (let i = 0; i < growports.length; ++i){
        let thiswaggle = ns.readPort(growports[i]["port"]);
        if (thiswaggle != "NULL PORT DATA"){
          for (let j = 0; j < targets.length; ++j){
            if (targets[j]["name"] == growports[i]["server"]){
              let lastwaggle = targets[j]["growwaggle"];
              targets[j]["growwaggle"] = (thiswaggle + lastwaggle) / 2;
              finished.push(i)
              if (thiswaggle > maxgrow){
                maxgrow = (thiswaggle + lastwaggle) / 2;
              }
            }
          }
        }
      }
      for (let i = 0; i < finished.length; ++i){
        growports.splice(finished[i], 1);
      }
      finished = [];
    }
    if (weakenports.length > 0){
      let finished = [];
      for (let i = 0; i < weakenports.length; ++i){
        let thiswaggle = ns.readPort(weakenports[i]["port"]);
        if (thiswaggle != "NULL PORT DATA"){
          for (let j = 0; j < targets.length; ++j){
            if (targets[j]["name"] == weakenports[i]["server"]){
              let lastwaggle = targets[j]["weakenwaggle"];
              targets[j]["weakenwaggle"] = (thiswaggle + lastwaggle) / 2;
              finished.push(i);
              if (thiswaggle > maxweaken){
                maxweaken = (thiswaggle + lastwaggle) / 2;
              }
            }
          }
        }
      }
      for (let i = 0; i < finished.length; ++i){
        weakenports.splice(finished[i], 1);
      }
    }
    let curtime = Date.now();
    let elapsedtime = curtime - starttime;
    if (elapsedtime > ns.args[2]){
      maxweaken = maxweaken/ns.args[1];
      maxhack = maxhack/ns.args[1];
      maxgrow = maxgrow/ns.args[1];
      starttime = curtime;
    }
    await ns.sleep(10);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}