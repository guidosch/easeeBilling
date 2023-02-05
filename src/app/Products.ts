export interface Products {
    id:                 number;
    siteKey:            string;
    name:               string;
    levelOfAccess:      number;
    address:            Address;
    siteType:           number;
    ratedCurrent:       number;
    partnerId:          number;
    circuits:           Circuit[];
    equalizers:         any[];
    userRole:           number;
    allowedSiteActions: string[];
}

export interface Address {
    street:         string;
    buildingNumber: null;
    zip:            string;
    area:           string;
    country:        Country;
    latitude:       null;
    longitude:      null;
    altitude:       null;
}

export interface Country {
    id:          string;
    name:        string;
    phonePrefix: number;
}

export interface Circuit {
    id:               number;
    siteId:           number;
    circuitPanelId:   number;
    panelName:        string;
    ratedCurrent:     number;
    chargers:         Charger[];
    masterBackplate:  null;
    useDynamicMaster: boolean;
    parentCircuitId:  null;
}

export interface Charger {
    id:            string;
    name:          string;
    levelOfAccess: number;
    userRole:      number;
    productCode:   number;
    backPlate:     BackPlate;
    isTemporary:   boolean;
    color:         null;
    createdOn:     Date;
    updatedOn:     Date;
}

export interface BackPlate {
    id:                string;
    masterBackPlateId: string;
    name:              null;
}
