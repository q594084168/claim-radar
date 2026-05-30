# ClaimRadar - AI-Powered Settlement Discovery

Find settlements you can actually claim. AI-powered discovery of class action settlements, data breach claims, and consumer refunds.

## Features

- 🌎 **Multi-Country Support**: USA, Canada, Australia
- 🤖 **AI-Powered Parsing**: Automatic extraction of claim details
- 📊 **Claim Score System**: 5-dimension scoring (Payout, Difficulty, Coverage, Speed, Risk)
- 🔍 **Advanced Filtering**: By country, category, payment method, receipt requirements
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔎 **SEO Optimized**: Dynamic pages for long-tail search traffic

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI / DeepSeek for content extraction
- **Deployment**: Vercel + Supabase (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)
- OpenAI or DeepSeek API key (optional, for AI parsing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/claim-radar.git
cd claim-radar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

4. Set up the database:
```bash
npx prisma migrate dev
```

5. Seed the database with initial data:
```bash
npx tsx src/lib/seed.ts
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
claim-radar/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── claims/        # Claims API endpoints
│   │   │   └── collect/       # Data collection API
│   │   ├── [country]/         # Country pages (us, ca, au)
│   │   ├── [category]/        # Category pages (data-breach, class-action, etc.)
│   │   └── page.tsx           # Homepage
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── scoring.ts         # Claim Score engine
│   │   ├── ai-parser.ts       # AI content extraction
│   │   ├── data-collector.ts  # Web scraping utilities
│   │   └── seed.ts            # Database seed script
│   └── types/
│       └── claim.ts           # TypeScript types
└── package.json
```

## API Endpoints

### GET /api/claims
Get a list of claims with optional filtering.

**Query Parameters:**
- `country`: Filter by country (US, CA, AU)
- `category`: Filter by category (data-breach, class-action, consumer-settlement)
- `noReceipt`: Filter for no-receipt claims (true/false)
- `paypal`: Filter for PayPal payment claims (true/false)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

### GET /api/claims/[slug]
Get a single claim by slug.

### POST /api/collect
Collect and parse a settlement page.

**Request Body:**
```json
{
  "url": "https://example.com/settlement"
}
```

## Claim Score System

The Claim Score is a 0-100 score based on 5 dimensions:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Payout | 40% | Higher estimated payout = higher score |
| Difficulty | 25% | Fewer requirements = higher score |
| Coverage | 15% | More states/countries = higher score |
| Speed | 10% | Faster payment methods = higher score |
| Risk | 10% | Less risk factors = higher score |

## SEO Pages

The system automatically generates SEO-optimized pages for:

- `/us` - US claims
- `/ca` - Canada claims
- `/au` - Australia claims
- `/data-breach` - Data breach settlements
- `/class-action` - Class action settlements
- `/consumer-settlement` - Consumer settlements
- `/no-receipt-claims` - Claims without receipt requirements
- `/paypal-settlements` - Claims with PayPal payment
- `/expiring-soon` - Claims expiring within 30 days

## Data Sources

### Level 1 (Official)
- Epiq
- Kroll
- Angeion Group
- JND Legal Administration

### Level 2 (Aggregators)
- TopClassActions
- ClassAction.org
- SettlementClass

### Level 3 (News)
- Google News
- Legal news feeds

## Deployment

### Vercel + Supabase (Recommended)

1. Create a Supabase project and get your database URL
2. Update `.env` with your Supabase database URL
3. Push to GitHub
4. Import project in Vercel
5. Add environment variables in Vercel
6. Deploy!

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Roadmap

### V1 (Current)
- ✅ Basic claim database
- ✅ Claim Score system
- ✅ Country and category pages
- ✅ SEO-optimized pages
- ✅ API endpoints

### V2 (Growth)
- [ ] User authentication
- [ ] Claim tracking
- [ ] Email notifications
- [ ] Claim deadline reminders

### V3 (Intelligence)
- [ ] AI eligibility matching
- [ ] Personalized recommendations
- [ ] Actual payout database
- [ ] Claim timeline tracking

### V4 (Pro)
- [ ] Data breach monitoring
- [ ] Enterprise API
- [ ] Premium subscriptions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

ClaimRadar is not a law firm and does not provide legal advice. The information provided is for general informational purposes only. Always verify information with official settlement websites before taking action.
