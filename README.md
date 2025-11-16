# Livora Server

A Node.js/Express.js backend server for a property management system. This server provides REST API endpoints for managing properties and user ratings with MongoDB integration.

## Features

- **Property Management**: CRUD operations for property listings
- **Rating System**: User ratings and reviews for properties
- **Search & Filter**: Search properties by name and filter by various criteria
- **Sorting**: Sort properties by date (newest/oldest) and price (highest/lowest)
- **User-specific Data**: Filter properties by seller email and ratings by user

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with MongoDB Atlas)
- **Environment**: dotenv for configuration
- **CORS**: Cross-origin resource sharing enabled

## Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd livora-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   DB_user=your_mongodb_username
   DB_password=your_mongodb_password
   PORT=3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will start running on `http://localhost:3000`

## API Endpoints

### Properties

| Method | Endpoint                   | Description                        | Query Parameters          |
| ------ | -------------------------- | ---------------------------------- | ------------------------- |
| GET    | `/api/properties`          | Get all properties                 | `sort`, `search`, `email` |
| GET    | `/api/properties/featured` | Get featured properties (latest 6) | -                         |
| GET    | `/api/properties/:id`      | Get property by ID                 | -                         |
| POST   | `/api/properties`          | Create new property                | -                         |
| PATCH  | `/api/properties/:id`      | Update property                    | -                         |
| DELETE | `/api/properties/:id`      | Delete property                    | -                         |

#### Query Parameters for `/api/properties`:

- `sort`: `oldest`, `highest`, `lowest` (default: newest)
- `search`: Search by property name
- `email`: Filter by seller email

### Ratings

| Method | Endpoint                            | Description                       | Query Parameters |
| ------ | ----------------------------------- | --------------------------------- | ---------------- |
| GET    | `/api/ratings`                      | Get all ratings                   | `email`          |
| GET    | `/api/ratings/property/:propertyId` | Get ratings for specific property | `email`, `type`  |
| POST   | `/api/ratings`                      | Create new rating                 | -                |
| DELETE | `/api/ratings/:propertyId`          | Delete all ratings for a property | -                |

#### Query Parameters for `/api/ratings/property/:propertyId`:

- `email`: User email
- `type`: `others` (exclude user's rating) or `my` (user's rating only)

## Data Models

### Property

```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  image: String,
  location: String,
  description: String,
  costing: Number,
  sellerEmail: String,
  sellerImage: String,
  createdAt: Date
}
```

### Rating

```javascript
{
  _id: ObjectId,
  propertyId: String,
  userEmail: String,
  rating: Number,
  comment: String,
  createdAt: Date
}
```

## Development

### Scripts

- `npm start`: Start the production server
- `npm test`: Run tests (currently not implemented)

### Project Structure

```
livora-server/
├── index.js          # Main server file
├── package.json      # Project dependencies and scripts
├── .env              # Environment variables (not in repo)
└── README.md         # This file
```

## Environment Variables

| Variable      | Description                 | Required |
| ------------- | --------------------------- | -------- |
| `DB_user`     | MongoDB username            | Yes      |
| `DB_password` | MongoDB password            | Yes      |
| `PORT`        | Server port (default: 3000) | No       |

## Database Collections

- **properties**: Stores property listings
- **ratings**: Stores user ratings and reviews

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support or questions, please create an issue in the repository or contact the development team.
