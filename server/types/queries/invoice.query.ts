export default interface IInvoiceQueries {
    page?: string;
    limit?: string;
    id?: string;
    receiptNumber?: string | Object;
    pharmacist?: Object;
    bank?: Object;
    status?: string | Object;
    syndicateMembership?: string | Object;
    total?: string | Object;
    paidDate?: Date | Object;
    createdAt?: Date | Object;
    isFinesIncluded?: string;
}
