export const userDef = /* GraphQL */ `
  type Message {
    message: String!
  }

  type User {
    _id: ID!
    id: String
    name: String!
    email: String!
    password: String!
    createdAt: String
    upStringdAt: String
    role: String!
    isPremium: Boolean!
    premiumExpiresAt: String
  }
`;
