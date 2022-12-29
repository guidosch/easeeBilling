export interface Charger {
    id: string;
    name: string;
    permissions: Permission[],
    users: string,
    powerUsage: PowerUsage[],
    totalConsumption:number,
    totalCostsInPeriod: number,
    totalConsumptionKWhHighRate: number,
    totalConsumptionKWhLowRate: number,
    totalConsumptionEligibleForSolar:number
}

export interface Permission {
    userId: number;
    name: string;
    phoneNumber: string;
    email: string;
}

export interface PowerUsage {
    from: string;
    to: string;
    totalEnergy: number;
    highRate: boolean;
    solarPower : boolean;
}



/**
 * create charger array with up to date users with secure.component.ts map function
 */
export const allChargers: Charger[] = [
    {
        "id": "EC3WGA79",
        "name": "PP37",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
        "totalConsumption":0,
        "users":""
    },
    {
        "id": "ECRMV6TM",
        "name": "PP28",
        "permissions": [
            {
                "userId": 566132,
                "name": "Yves Diacon",
                "phoneNumber": "+41792459339",
                "email": "yves.diacon@hotmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECKR3P9L",
        "name": "PP27",
        "permissions": [
            {
                "userId": 566132,
                "name": "Yves Diacon",
                "phoneNumber": "+41792459339",
                "email": "yves.diacon@hotmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC7Q7HTK",
        "name": "PP26",
        "permissions": [
            {
                "userId": 566132,
                "name": "Yves Diacon",
                "phoneNumber": "+41792459339",
                "email": "yves.diacon@hotmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECSL3273",
        "name": "PP25",
        "permissions": [
            {
                "userId": 530332,
                "name": "Guido Schnider",
                "phoneNumber": "+41796131787",
                "email": "solar.waidliving@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC7UXPB3",
        "name": "PP24",
        "permissions": [
            {
                "userId": 555808,
                "name": "Marcel Gloyer",
                "phoneNumber": "+41787970221",
                "email": "marcel.gloyer@gmx.net"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECHLAGAB",
        "name": "PP11",
        "permissions": [
            {
                "userId": 568382,
                "name": "Regula Sigg",
                "phoneNumber": "+41787711270",
                "email": "rsigg@gmx.ch"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC7QDYG5",
        "name": "PP09",
        "permissions": [
            {
                "userId": 565458,
                "name": "Sandra Schreiner",
                "phoneNumber": "+41788832837",
                "email": "san.m.schreiner@gmail.com"
            },
            {
                "userId": 565453,
                "name": "Silas Füglistaler",
                "phoneNumber": "+41786203675",
                "email": "silasfue@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECG9SHR7",
        "name": "PP08",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC4JZNS6",
        "name": "PP07",
        "permissions": [
            {
                "userId": 565473,
                "name": "Lukas Sonderegger",
                "phoneNumber": "+41764252181",
                "email": "sonlu@bluewin.ch"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECYLW5H8",
        "name": "PP05/06",
        "permissions": [
            {
                "userId": 564522,
                "name": "Peter Leemann",
                "phoneNumber": "+41796891574",
                "email": "peter.leemann@bluewin.ch"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECTX9X4Y",
        "name": "PP04",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC3APZ3F",
        "name": "PP03",
        "permissions": [
            {
                "userId": 566079,
                "name": "Lorenza Rapetti",
                "phoneNumber": "+41795182262",
                "email": "lorenza.rapetti@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECNPY3WN",
        "name": "PP02",
        "permissions": [
            {
                "userId": 566079,
                "name": "Lorenza Rapetti",
                "phoneNumber": "+41795182262",
                "email": "lorenza.rapetti@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC335SXB",
        "name": "PP01",
        "permissions": [
            {
                "userId": 568250,
                "name": "Pratap Zala",
                "phoneNumber": "+41763297472",
                "email": "pratap.zala@bluewin.ch"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECLSGWN8",
        "name": "PP10",
        "permissions": [
            {
                "userId": 563445,
                "name": "Flavia Amgwerd",
                "phoneNumber": "+41795072411",
                "email": "flavia@amgwerd.net"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC7X44AM",
        "name": "PP36",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECH6GBGV",
        "name": "PP35",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECHZTN6Q",
        "name": "PP34",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECUL8BPJ",
        "name": "PP33",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC3BNMC4",
        "name": "PP32",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECFQRAWG",
        "name": "PP31",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECXV4J7T",
        "name": "PP30",
        "permissions": [
            {
                "userId": 567054,
                "name": "Pierre Thielen",
                "phoneNumber": "+41789445244",
                "email": "thielenpierre@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC9JHGTL",
        "name": "PP29",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECXZMAN9",
        "name": "PP23",
        "permissions": [
            {
                "userId": 574108,
                "name": "Dieter Steger",
                "phoneNumber": "+41787394473",
                "email": "dieter.steger@gmx.net"
            },
            {
                "userId": 572448,
                "name": "Jürgen Karle",
                "phoneNumber": "+41787683229",
                "email": "juergenkarle@gmx.net"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC7KPM3H",
        "name": "PP22",
        "permissions": [
            {
                "userId": 565577,
                "name": "Andrea Christoffel",
                "phoneNumber": "+41795582140",
                "email": "christoffela@gmx.ch"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC5GWULA",
        "name": "PP12",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECU46ZBF",
        "name": "PP14",
        "permissions": [
            {
                "userId": 577752,
                "name": "Ulla Bernhart",
                "phoneNumber": "+41764013045",
                "email": "ullabernhart@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECX5ZCQX",
        "name": "PP15",
        "permissions": [
            {
                "userId": 574134,
                "name": "Tino Theler",
                "phoneNumber": "+41797691434",
                "email": "tino.theler@gmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC8UC36H",
        "name": "PP17",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC6WZ9PX",
        "name": "PP18",
        "permissions": [
            {
                "userId": 565120,
                "name": "Gregor Stalder",
                "phoneNumber": "+41796799405",
                "email": "gstalder@ikmail.com"
            },
            {
                "userId": 565121,
                "name": "Leo Stalder",
                "phoneNumber": "+41786161323",
                "email": "lstalder@ikmail.com"
            }
        ],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECXNVRZC",
        "name": "PP19",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "EC2EMHGM",
        "name": "PP20",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    },
    {
        "id": "ECT8Y3HR",
        "name": "PP21",
        "permissions": [],
        "powerUsage": [],
        "totalCostsInPeriod": 0,
        "totalConsumptionKWhHighRate": 0,
        "totalConsumptionKWhLowRate": 0,
        "totalConsumptionEligibleForSolar": 0,
      "totalConsumption":0,
      "users":""
    }
]
