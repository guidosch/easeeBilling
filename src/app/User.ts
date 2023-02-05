export interface User {
    userId: number;
    eMail: string;
    phoneNo: string;
    firstName: string;
    lastName: string;
    street: string;
    zipCode: string;
    city: string;
    country: string;
    countryId: string;
    language: string;
    emailVerified: boolean;
    subscribeNewProductUpdate: boolean;
    subscribeProductUpdate: boolean;
    company?: null;
    isActive: boolean;
}
