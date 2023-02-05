export interface LoginResponse {

    accessToken: string,
    expiresIn: number,
    accessClaims: string[],
    tokenType: string,
    refreshToken: string
}
