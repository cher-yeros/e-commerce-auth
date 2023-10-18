export const productSchema = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    user: User!
    orders: [Order!]!
  }

`;
