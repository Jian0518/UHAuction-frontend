# UH Auction Frontend

A Vue.js-based frontend application for the UH Auction system.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- Vue CLI

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/Jian0518/UHAuction-frontend
cd uh_auction_frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

### Start Development Server
```bash
npm run serve
```
This will start the development server with hot-reload at `http://localhost:8080`

### Build for Production
```bash
npm run build
```
This will create a production-ready build in the `dist` directory

## Configuration

### WebSocket Configuration
The application is configured to proxy WebSocket connections to the backend server. This configuration can be found in `vue.config.js`:
- WebSocket endpoint: `/ws`
- Backend target: `http://localhost:8080`

### Environment Variables
Create a `.env` file in the root directory for environment-specific configurations:
```
VUE_APP_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── api/   
├── util/   
├── assets/         
├── components/     
├── views/         
├── router/         
├── store/        
└── App.vue         
```

## Features

- Real-time auction updates via WebSocket
- User authentication
- Bidding system
- Data visualization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


