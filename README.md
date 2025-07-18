# KhmerCoders Official Website

Welcome to the official repository for the KhmerCoders community website. This project is built with Next.js and uses Cloudflare for hosting and database services.

## How to Get Started

Clone the repository and install dependencies

```bash
git clone https://github.com/yourusername/khmercoders-web.git
cd khmercoders-web
npm install
```

Run the setup script to configure your environment variables, initialize the database, and populate it with sample data:

```bash
npm run setup
```

This script will:

- Create a `.env` file with necessary configuration
- Set up the local Cloudflare D1 database
- Apply database migrations
- Seed the database with initial data

Start the development server

```bash
npm run dev
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for detailed information on how to contribute to this project.
