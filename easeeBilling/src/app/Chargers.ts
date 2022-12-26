export interface Charger {
    id: string;
    name: string;
    permissions: Permissions[],
    powerUsage: PowerUsage[],
    powerUsageFrom:string,
    powerUsageTo:string
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
  }
  


// permissions: https://api.easee.cloud/api/chargers/{id}/permission --> charger id
//all chargers from site (site id: 485278): https://api.easee.cloud/api/chargers/{id}/site

const allChargers: Charger[] = [
    {
        "id": "EC3WGA79",
        "name": "PP37",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECRMV6TM",
        "name": "PP28",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECKR3P9L",
        "name": "PP27",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC7Q7HTK",
        "name": "PP26",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECSL3273",
        "name": "PP25",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC7UXPB3",
        "name": "PP24",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECHLAGAB",
        "name": "PP11",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC7QDYG5",
        "name": "PP09",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECG9SHR7",
        "name": "PP08",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC4JZNS6",
        "name": "PP07",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECYLW5H8",
        "name": "PP05/06",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECTX9X4Y",
        "name": "PP04",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC3APZ3F",
        "name": "PP03",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECNPY3WN",
        "name": "PP02",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC335SXB",
        "name": "PP01",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECLSGWN8",
        "name": "PP10",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC7X44AM",
        "name": "PP36",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECH6GBGV",
        "name": "PP35",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECHZTN6Q",
        "name": "PP34",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECUL8BPJ",
        "name": "PP33",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC3BNMC4",
        "name": "PP32",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECFQRAWG",
        "name": "PP31",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECXV4J7T",
        "name": "PP30",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC9JHGTL",
        "name": "PP29",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECXZMAN9",
        "name": "PP23",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC7KPM3H",
        "name": "PP22",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC5GWULA",
        "name": "PP12",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECU46ZBF",
        "name": "PP14",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECX5ZCQX",
        "name": "PP15",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC8UC36H",
        "name": "PP17",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC6WZ9PX",
        "name": "PP18",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECXNVRZC",
        "name": "PP19",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "EC2EMHGM",
        "name": "PP20",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    },
    {
        "id": "ECT8Y3HR",
        "name": "PP21",
        "permissions": [],
        "powerUsageFrom": "",
        "powerUsageTo": "",
        "powerUsage": []
    }
]