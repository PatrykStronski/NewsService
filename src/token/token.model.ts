export interface IToken {
    token: string;
    refresh?: string;
}

export interface IPayload {
    user: string;
    email: string;
    role: string;
}

export enum TokenType {
    standard,
    refresh
}