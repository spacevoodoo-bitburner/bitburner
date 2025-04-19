export async function main(ns) {
  let mooks = ["Honey", "Sugarbag", "Sweat", "Carpenter", "Digger", "Longhorn", "Cuckoo", "Squash", "Cutter"]
  let mookindex = 0;
  let karma = ns.heart.break();
  let othergangarray = ["Speakers for the Dead", "The Syndicate", "NiteSec", "The Black Hand", "The Dark Army"];
  
  while (karma > -54000){
    karma = ns.heart.break();
    ns.tprint(karma);
    await ns.sleep(600000)
  }
  if (!ns.gang.inGang()){
    ns.gang.createGang("Slum Snakes");
    ns.gang.recruitMember("Bumble");
    ns.gang.recruitMember("Killer");
    ns.gang.recruitMember("Mason");
  }
  while (karma <= -54000 && ns.gang.inGang()){
    let equipment = ns.gang.getEquipmentNames();
    let members = ns.gang.getMemberNames();
    let fullup = true;
    for (let i = 0; i < members.length; ++i){
      let gangdata = ns.gang.getMemberInformation(members[i]);
      if (gangdata.str_asc_mult >= 4 && gangdata.upgrades.length < 21){
        fullup = false;
      }
    }
    let otherganginfo = ns.gang.getOtherGangInformation();
    let maxpower = 0;
    for (let i = 0; i < othergangarray.length; ++i){
      if (otherganginfo[othergangarray[i]]["power"] > maxpower){
        maxpower = otherganginfo[othergangarray[i]]["power"];
      }
    }
    let mygang = ns.gang.getGangInformation();
    let mypower = mygang.power;
    for (let i = 0; i < members.length; ++i){
      let gangdata = ns.gang.getMemberInformation(members[i]);
      if (gangdata.dex >= 110 && gangdata.str_asc_mult == 1){
        ns.gang.ascendMember(members[i]);
        ns.gang.setMemberTask(members[i], "Train Combat");
      } else if (gangdata.dex >= 225 && gangdata.str_asc_mult > 1 && gangdata.str_asc_mult < 3){
        ns.gang.ascendMember(members[i]);
        ns.gang.setMemberTask(members[i], "Train Combat");
      } else if (gangdata.dex >= 350 && gangdata.str_asc_mult > 3 && gangdata.str_asc_mult < 4){
        ns.gang.ascendMember(members[i]);
        ns.gang.setMemberTask(members[i], "Train Combat")
      } else {
        if (members.length < 12 && gangdata.str > 500){
          ns.gang.setMemberTask(members[i], "Terrorism");
        } else if (members.length == 12 && gangdata.str > 500 && !fullup){
          ns.gang.setMemberTask(members[i], "Human Trafficking");
        } else if (members.length == 12 && gangdata.str > 500 && fullup){
          if (mypower < maxpower * 4){
            ns.gang.setTerritoryWarfare(false);
            ns.gang.setMemberTask(members[i], "Territory Warfare");
          } else {
            ns.gang.setMemberTask(members[i], "Human Trafficking");
            ns.gang.setTerritoryWarfare(true);
          }
          let asc = ns.gang.getAscensionResult(members[i]);
          if (asc.str >= 2 || asc.cha >= 2 || asc.def >= 2 || asc.agi >= 2 || asc.dex >= 2 || asc.hack >= 2){
            ns.gang.ascendMember(members[i]);
          }
        }
        else if (gangdata.str < 500) {
          ns.gang.setMemberTask(members[i], "Train Combat");
        } else {
          ns.gang.setMemberTask(members[i], "Train Combat");
        }
      }
    }
    if (members.length < 12 && ns.gang.canRecruitMember()){
      ns.gang.recruitMember(mooks[mookindex]);
      mookindex += 1;
    }
    for (let i = 0; i < members.length; ++i){
      let gangdata = ns.gang.getMemberInformation(members[i]);
      if (gangdata.str_asc_mult >= 4){
        let curEquipment = gangdata.upgrades;
        let curAugments = gangdata.upgrades;
        for (let j = 0; j < equipment.length; ++j){
          let curCash = ns.getServerMoneyAvailable("home");
          let equipmentCost = ns.gang.getEquipmentCost(equipment[j]);
          if (!curEquipment.includes(equipment[j]) && !curAugments.includes(equipment[j]) && equipmentCost < curCash){
            ns.gang.purchaseEquipment(members[i], equipment[j]);
          }
        }
      }
    }
    await ns.sleep(10000);
  }
}