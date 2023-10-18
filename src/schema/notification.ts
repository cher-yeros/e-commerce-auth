export const notificationSchema = `#graphql
  type Notification {
    id: ID!
    user: User!
    message: String!
    isRead: Boolean!
  }


`;
