export default interface IInvoiceQueries {
    page?: string;
    limit?: string;
    status?: string;
    total?: string | Object;
    paidDate?: Date | Object;
    createdAt?: Date | Object;
}
