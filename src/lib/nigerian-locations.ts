export interface NigerianLocation {
  name: string;
  state: string;
}

export const nigerianStates: string[] = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export const nigerianLocations: NigerianLocation[] = [
  // Lagos State
  { name: "Lagos", state: "Lagos" },
  { name: "Ikeja", state: "Lagos" },
  { name: "Apapa", state: "Lagos" },
  { name: "Lekki", state: "Lagos" },
  { name: "Badagry", state: "Lagos" },
  { name: "Victoria Island", state: "Lagos" },
  { name: "Surulere", state: "Lagos" },
  { name: "Yaba", state: "Lagos" },
  { name: "Oshodi", state: "Lagos" },
  { name: "Mushin", state: "Lagos" },
  { name: "Ikorodu", state: "Lagos" },
  { name: "Epe", state: "Lagos" },

  // Oyo / Ogun / Ondo / Ekiti / Kwara
  { name: "Ibadan", state: "Oyo" },
  { name: "Oyo", state: "Oyo" },
  { name: "Ogbomoso", state: "Oyo" },
  { name: "Abeokuta", state: "Ogun" },
  { name: "Sagamu", state: "Ogun" },
  { name: "Otta", state: "Ogun" },
  { name: "Akure", state: "Ondo" },
  { name: "Ondo City", state: "Ondo" },
  { name: "Ado-Ekiti", state: "Ekiti" },
  { name: "Ilorin", state: "Kwara" },
  { name: "Offa", state: "Kwara" },

  // Edo / Delta
  { name: "Benin City", state: "Edo" },
  { name: "Warri", state: "Delta" },
  { name: "Asaba", state: "Delta" },
  { name: "Sapele", state: "Delta" },
  { name: "Ughelli", state: "Delta" },

  // Anambra / Imo / Abia / Ebonyi / Enugu
  { name: "Onitsha", state: "Anambra" },
  { name: "Awka", state: "Anambra" },
  { name: "Nnewi", state: "Anambra" },
  { name: "Owerri", state: "Imo" },
  { name: "Aba", state: "Abia" },
  { name: "Umuahia", state: "Abia" },
  { name: "Abakaliki", state: "Ebonyi" },
  { name: "Enugu", state: "Enugu" },
  { name: "Nsukka", state: "Enugu" },

  // Rivers / Akwa Ibom / Cross River / Bayelsa
  { name: "Port Harcourt", state: "Rivers" },
  { name: "Uyo", state: "Akwa Ibom" },
  { name: "Calabar", state: "Cross River" },
  { name: "Yenagoa", state: "Bayelsa" },

  // FCT
  { name: "Abuja", state: "FCT (Abuja)" },
  { name: "Gwagwalada", state: "FCT (Abuja)" },

  // Kano / Kaduna / Plateau / Bauchi / Gombe
  { name: "Kano", state: "Kano" },
  { name: "Kaduna", state: "Kaduna" },
  { name: "Zaria", state: "Kaduna" },
  { name: "Jos", state: "Plateau" },
  { name: "Bauchi", state: "Bauchi" },
  { name: "Gombe", state: "Gombe" },

  // Borno / Yobe / Adamawa / Taraba
  { name: "Maiduguri", state: "Borno" },
  { name: "Damaturu", state: "Yobe" },
  { name: "Yola", state: "Adamawa" },
  { name: "Jalingo", state: "Taraba" },

  // Sokoto / Katsina / Kebbi / Zamfara / Jigawa / Niger / Nasarawa / Kogi
  { name: "Sokoto", state: "Sokoto" },
  { name: "Katsina", state: "Katsina" },
  { name: "Birnin Kebbi", state: "Kebbi" },
  { name: "Gusau", state: "Zamfara" },
  { name: "Dutse", state: "Jigawa" },
  { name: "Minna", state: "Niger" },
  { name: "Lafia", state: "Nasarawa" },
  { name: "Lokoja", state: "Kogi" },

  // Benue
  { name: "Makurdi", state: "Benue" },
  { name: "Otukpo", state: "Benue" },

  // Osun
  { name: "Osogbo", state: "Osun" },
  { name: "Ile-Ife", state: "Osun" },
];
