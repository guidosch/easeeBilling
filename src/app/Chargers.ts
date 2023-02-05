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
