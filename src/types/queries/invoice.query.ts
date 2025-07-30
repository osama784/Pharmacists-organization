export default interface IInvoiceQueries {
    page?: string;
    limit?: string;
    status?: string | Object;
    syndicateMembership?: string | Object;
    total?: string | Object;
    paidDate?: Date | Object;
    createdAt?: Date | Object;
    isFinesIncluded?: string;
}
