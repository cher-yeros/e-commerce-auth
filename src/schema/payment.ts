export const paymentSchema = `#graphql
  type Payment {
    id: ID!
    user: User!
    amount: Float!
    status: String!
  }

`;
