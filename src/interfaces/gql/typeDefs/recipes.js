export const recipesDef = /* GraphQL */ `
  type Steps {
    instruction: String
    description: String
  }

  type Values {
    item: String
  }

  type Metaextra {
    id: Int
    title: String
    values: [Values]
  }

  type Metaheader {
    id: Int
    title: String
    element: String
  }

  type Ingredients {
    id: Int
    name: String
    emoji: String
  }

  type keywords {
    id: Int
    keyword: String
  }

  type Ratings {
    stars: String
    votes: String
  }

  type Recipe {
    _id: ID!
    id: String
    title: String
    image: String
    time: String
    video: String
    preview: String
    history: String
    keywords: [keywords]
    steps: [Steps]
    metaextra: [Metaextra]
    tips: [String]
    ingredients: [Ingredients]
    ratings: [Ratings]
    uploadDate: String
    metaheader: [Metaheader]
  }
`;
