const pokemonData = [
  {
    "Name": "Cinderace",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Garchomp",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "None",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Gengar",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SingleTarget",
    "CC": "Low",
    "PlayStyle": "Poke",
    "Classification": "Assassin"
  },
  {
    "Name": "Cramorant",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "UtilityMage"
  },
  {
    "Name": "Alolan-Ninetales",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "UtilityMage"
  },
  {
    "Name": "Wigglytuff",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Buffer",
    "OtherAttr": "AntiCC"
  },
  {
    "Name": "Machamp",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "None",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Engage",
    "OtherAttr": "AntiCC"
  },
  {
    "Name": "Absol",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "High",
    "Range": "None",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SingleTarget",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Slowbro",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "CCTank",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Mr-Mime",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Venusaur",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "High",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "LargeAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Lucario",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SingleTarget",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Bruiser",
    "OtherAttr": "AntiCC"
  },
  {
    "Name": "Talonflame",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin"
  },
  {
    "Name": "Eldegoss",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Healer",
    "OtherAttr": "Heals"
  },
  {
    "Name": "Greninja",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Crustle",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "None",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Snorlax",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "Peel"
  },
  {
    "Name": "Charizard",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Engage"
  },
  {
    "Name": "Pikachu",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "UtilityMage"
  },
  {
    "Name": "Zeraora",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Gardevoir",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Blissey",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Buffer",
    "OtherAttr": "Heals"
  },
  {
    "Name": "Blastoise",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "LargeAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "Peel"
  },
  {
    "Name": "Mamoswine",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Weak",
    "Mobility": "Low",
    "Range": "None",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "CCTank",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Sylveon",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "DrainTank"
  },
  {
    "Name": "Greedent",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Engage",
    "OtherAttr": "AntiCC"
  },
  {
    "Name": "Decidueye",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "High",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "None",
    "PlayStyle": "Poke",
    "Classification": "ADC"
  },
  {
    "Name": "Tsareena",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Bruiser",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Dragonite",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Trevenant",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "LargeAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "CCTank"
  },
  {
    "Name": "Aegislash",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Hoopa",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "LargeAOE",
    "CC": "Medium",
    "PlayStyle": "Assist",
    "Classification": "Healer",
    "OtherAttr": "Peel"
  },
  {
    "Name": "Duraludon",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Azumarill",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Bruiser",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Espeon",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Delphox",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "LargeAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "UtilityMage",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Glaceon",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Buzzwole",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SingleTarget",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Tyranitar",
    "EarlyGame": "Weak",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Mew",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Assist",
    "Classification": "UtilityMage"
  },
  {
    "Name": "Dodrio",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "Low",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Scizor",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Scyther",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Clefable",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "None",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Healer",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Zoroark",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Sableye",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Engage",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Urshifu-SS",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "None",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Urshifu-RS",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Dragapult",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "ADC"
  },
  {
    "Name": "Comfey",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "Dive",
    "Classification": "Healer"
  },
  {
    "Name": "Zacian",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Weak",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Engage",
    "OtherAttr": "Peel"
  },
  {
    "Name": "Goodra",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Lapras",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "MediumAOE",
    "CC": "Medium",
    "PlayStyle": "SplitMap",
    "Classification": "DrainTank"
  },
  {
    "Name": "Chandelure",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage",
    "OtherAttr": "SpaceControl"
  },
  {
    "Name": "Umbreon",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SingleTarget",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Buffer",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Leafeon",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Inteleon",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Low",
    "Range": "High",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SingleTarget",
    "CC": "None",
    "PlayStyle": "Poke",
    "Classification": "BurstMage"
  },
  {
    "Name": "Mewtwo-Y",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "ADC",
    "OtherAttr": "Peel"
  },
  {
    "Name": "Mewtwo-X",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Engage",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Blaziken",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Mimikyu",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Assassin",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Meowscarada",
    "EarlyGame": "Strong",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Metagross",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Gyarados",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Medium",
    "PlayStyle": "Dive",
    "Classification": "Engage"
  },
  {
    "Name": "Miraidon",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "High",
    "Bulk": "Low",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "MediumAOE",
    "CC": "None",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Falinks",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Ceruledge",
    "EarlyGame": "Weak",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "Dive",
    "Classification": "Assassin"
  },
  {
    "Name": "Ho-Oh",
    "EarlyGame": "Medium",
    "MidGame": "Weak",
    "LateGame": "Strong",
    "Mobility": "Medium",
    "Range": "Low",
    "Bulk": "High",
    "Damage": "Medium",
    "DamageType": "Consistent",
    "DamageAffect": "SmallAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "DrainTank"
  },
  {
    "Name": "Armarouge",
    "EarlyGame": "Weak",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Low",
    "PlayStyle": "Teamfight",
    "Classification": "BurstMage"
  },
  {
    "Name": "Darkrai",
    "EarlyGame": "Medium",
    "MidGame": "Strong",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "High",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin",
    "OtherAttr": "Lockdown"
  },
  {
    "Name": "Psyduck",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Medium",
    "Bulk": "Low",
    "Damage": "Low",
    "DamageType": "Consistent",
    "DamageAffect": "MediumAOE",
    "CC": "High",
    "PlayStyle": "Teamfight",
    "Classification": "Engage"
  },
  {
    "Name": "Tinkaton",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "Low",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "Bruiser"
  },
  {
    "Name": "Galarian-Rapidash",
    "EarlyGame": "Medium",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "High",
    "Range": "Low",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "SmallAOE",
    "CC": "None",
    "PlayStyle": "SplitMap",
    "Classification": "Assassin",
    "OtherAttr": "PickFinding"
  },
  {
    "Name": "Suicune",
    "EarlyGame": "Strong",
    "MidGame": "Medium",
    "LateGame": "Medium",
    "Mobility": "None",
    "Range": "Medium",
    "Bulk": "Medium",
    "Damage": "Medium",
    "DamageType": "Burst",
    "DamageAffect": "MediumAOE",
    "CC": "Medium",
    "PlayStyle": "Teamfight",
    "Classification": "UtilityMage"
  }
];

module.exports = pokemonData;