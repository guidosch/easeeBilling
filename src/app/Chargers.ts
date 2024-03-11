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
    invitationId?: string | null;
    expiresInDays?: number | null;

}

export interface PowerUsage {
    from: string;
    to: string;
    totalEnergy: number;
    highRate: boolean;
    solarPower : boolean;
}
