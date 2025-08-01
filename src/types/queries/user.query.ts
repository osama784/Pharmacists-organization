export interface IUserQuery {
    page?: string;
    limit?: string;
    username?: string | Object;
    email?: string | Object;
    phoneNumber?: string | Object;
    status?: string | Object;
    role?: string | Object;
}
