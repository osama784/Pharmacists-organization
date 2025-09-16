export default interface ITreasuryFeeQuery {
    page?: string;
    limit?: string;
    name?: string | Object;
    value?: string | Object;
    associatedParty?: string | Object;
    associatedSection?: string | Object;
    receiptBook?: string | Object;
}
