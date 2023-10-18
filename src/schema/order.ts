export const orderSchema = `#graphql
  type Order {
    id: ID!
    user: User!
    product: Product!
    quantity: Int!
  }

`;
