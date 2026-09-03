# Deployment & Infrastructure Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   CDN (Optional)                             │
│              (Cloudflare, Bunny, AWS CloudFront)             │
│            Cache static assets and HTML                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                          │
│   Deployment: Vercel, Netlify, AWS Amplify                  │
│   - Auto-scaling                                             │
│   - Global CDN                                               │
│   - Environment variables                                    │
│   - Preview deployments                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Node.js)                       │
│   Deployment: Railway, Render, Fly.io, AWS EC2              │
│   - Auto-scaling based on load                              │
│   - Health checks                                            │
│   - Zero-downtime deployments                               │
│   - Environment variables & secrets                          │
└─────────────────────────────────────────────────────────────┘
                          ↓ TCP/IP
┌─────────────────────────────────────────────────────────────┐
│                   Database (MongoDB)                         │
│   Deployment: MongoDB Atlas (cloud)                          │
│   - Multi-region replication                                │
│   - Automated backups                                        │
│   - Point-in-time recovery                                   │
│   - IP whitelist security                                    │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Deployment Options

### Option 1: Vercel (Recommended for Next.js)
**Pros:**
- ✅ Made by Next.js creators
- ✅ Zero-config deployment
- ✅ Global CDN included
- ✅ Preview deployments
- ✅ Auto-scaling
- ✅ Environment management
- ✅ Built-in analytics

**Cons:**
- ❌ Vendor lock-in
- ❌ Limited customization

**Cost:** 
- Free tier: 1 deployment per day
- Hobby: $20/month (unlimited deployments)
- Pro: $40/month per seat

**Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add API_URL https://api.featurepulse.com
```

### Option 2: Netlify
**Pros:**
- ✅ Excellent DX
- ✅ Free tier generous
- ✅ Forms & functions
- ✅ A/B testing

**Cost:**
- Free: 100 GB/month bandwidth
- Pro: $19/month (unlimited team members)

**Deployment:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Self-hosted (AWS S3 + CloudFront)
**Pros:**
- ✅ Full control
- ✅ Can be cheaper at scale
- ✅ No vendor lock-in

**Cons:**
- ❌ More setup required
- ❌ Complexity

**Cost:**
- S3: $0.023 per GB stored
- CloudFront: $0.085 per GB delivered
- Estimate (1GB assets): ~$1-2/month

**Deployment:**
```bash
npm run build
aws s3 sync out/ s3://featurepulse-web --delete
aws cloudfront create-invalidation --distribution-id E123ABC --paths "/*"
```

## Backend Deployment Options

### Option 1: Railway.app (Recommended)
**Pros:**
- ✅ Simplest deployment
- ✅ GitHub integration
- ✅ Auto-scaling
- ✅ Environment variables UI
- ✅ Webhook deployments
- ✅ Hobby-friendly pricing

**Cons:**
- ❌ Limited regions (US/EU)
- ❌ Smaller company

**Cost:**
- Usage-based: $5/month credit + pay-as-you-go
- Estimate for small app: $10-30/month

**Deployment:**
```bash
# 1. Connect GitHub repo to Railway.app
# 2. Set environment variables in dashboard
# 3. Auto-deploy on push to main

# Manual deployment:
npm install -g @railway/cli
railway up
```

### Option 2: Render.com
**Pros:**
- ✅ Good free tier
- ✅ Zero-downtime deployments
- ✅ Built-in SSL

**Cost:**
- Free: Auto-sleep after 15 min inactivity
- Starter: $7/month (always on)
- Standard: $25/month (auto-scale)

**Deployment:**
```bash
# Connect GitHub, auto-deploys on push
# Deploy from web dashboard
```

### Option 3: Fly.io
**Pros:**
- ✅ Global deployment
- ✅ Built-in Redis
- ✅ Competitive pricing

**Cost:**
- Pay-as-you-go: $0.01-0.05 per vCPU/month
- Estimate: $5-15/month

**Deployment:**
```bash
npm install -g @fly/cli
fly auth login
fly launch
fly deploy
```

### Option 4: AWS (EC2 + RDS) - Advanced
**Pros:**
- ✅ Full control
- ✅ Massive scalability
- ✅ Rich features

**Cons:**
- ❌ Complex setup
- ❌ Higher cost for small apps

**Cost:**
- t3.micro EC2: $0.0104/hour (~$7.50/month)
- Data transfer: $0.02 per GB
- Estimate: $15-50/month

**Deployment:**
```bash
# 1. Create EC2 instance (Ubuntu 22.04)
# 2. SSH and install Node/npm
# 3. Clone repository
# 4. pm2 start app.ts  # Process manager
# 5. Set up nginx reverse proxy
# 6. Configure SSL with Let's Encrypt
# 7. Set up monitoring with CloudWatch
```

**Recommended Setup** for this project:
```bash
# Create instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.micro \
  --key-name my-key

# SSH in
ssh -i my-key.pem ec2-user@instance-ip

# Install dependencies
sudo yum update
sudo yum install nodejs npm
curl https://raw.githubusercontent.com/pm2-hive/pm2/master/packager/setup.rpm | sudo bash
sudo yum install pm2

# Clone and deploy
git clone https://github.com/user/featurepulse.git
cd featurepulse/apps/api
npm install
pm2 start npm --name "featurepulse-api" -- start
pm2 startup
pm2 save
```

## Database Deployment Options

### Option 1: MongoDB Atlas (Recommended)
**Pros:**
- ✅ Fully managed
- ✅ Global clusters
- ✅ Auto-scaling storage
- ✅ Backups included
- ✅ Free tier (512MB storage)

**Cons:**
- ❌ Vendor lock-in

**Cost:**
- Free tier: 512MB storage
- Shared: $6.99-12.99/month
- Dedicated: $80+/month

**Setup:**
```bash
# 1. Create account at mongodb.com/cloud
# 2. Create cluster (use free tier)
# 3. Create database user
# 4. Whitelist IP address
# 5. Copy connection string

# Use in .env
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/featurepulse?retryWrites=true&w=majority
```

### Option 2: Self-hosted MongoDB
**Pros:**
- ✅ Full control
- ✅ No vendor lock-in

**Cons:**
- ❌ Manual backups
- ❌ Maintenance overhead

**Cost:** Only hosting cost (EC2 instance)

**Setup:**
```bash
# On EC2 instance
sudo yum install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})
```

## Environment Variables Checklist

```bash
# .env.production
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://api.featurepulse.com
NEXT_PUBLIC_APP_NAME=FeaturePulse

# Backend - Auth
JWT_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>

# Backend - Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/featurepulse

# Backend - CORS
CLIENT_URL=https://app.featurepulse.com

# Optional - Monitoring
SENTRY_DSN=https://...@sentry.io/...
LOG_LEVEL=info

# Optional - Redis (for rate limiting)
REDIS_URL=redis://user:password@host:port
```

## Deployment Workflow

### GitHub Actions CI/CD Pipeline
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: |
          npm i -g vercel
          vercel --prod --token=$VERCEL_TOKEN

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm i -g @railway/cli
          railway deploy --token=$RAILWAY_TOKEN
```

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] 0 TypeScript errors
- [ ] ESLint passes
- [ ] No console.log() in production code
- [ ] Error handling complete
- [ ] Logging implemented

### Security
- [ ] All secrets in environment variables
- [ ] No secrets in code/git
- [ ] HTTPS enforced
- [ ] JWT secrets rotated
- [ ] Rate limiting configured
- [ ] Security headers configured
- [ ] CORS properly restricted

### Performance
- [ ] API response times < 200ms
- [ ] Frontend Lighthouse score > 90
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Minification enabled
- [ ] Caching configured

### Monitoring
- [ ] Error tracking enabled (Sentry)
- [ ] Logging service configured
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring enabled
- [ ] Alerts configured

### Database
- [ ] Backups configured
- [ ] Point-in-time recovery enabled
- [ ] Indexes created
- [ ] Connection pooling configured
- [ ] Network access restricted (IP whitelist)

## Scaling Strategy

### Phase 1: MVP (0-100 users)
- Single backend instance
- Shared MongoDB
- Basic monitoring
- Cost: ~$30-50/month

### Phase 2: Growth (100-1,000 users)
- Auto-scaling backend (2-3 instances)
- Redis cache for sessions
- CDN for static assets
- Enhanced monitoring
- Cost: ~$100-200/month

### Phase 3: Scale (1,000+ users)
- Load balancer
- Multi-region backend
- Read replicas for database
- Message queue for async jobs
- Dedicated observability platform
- Cost: $500+/month

### Phase 4: Enterprise (10,000+ users)
- Global infrastructure
- Database sharding
- Kubernetes orchestration
- Advanced caching strategy
- DDoS protection
- Enterprise support
- Cost: $2,000+/month

## Cost Breakdown (MVP Phase)

| Component | Provider | Cost/Month | Notes |
|-----------|----------|-----------|-------|
| Frontend | Vercel | $20 | Hobby plan |
| Backend | Railway | $15 | Usage-based |
| Database | MongoDB Atlas | $0 | Free tier (512MB) |
| Monitoring | Sentry | $0 | Free tier |
| **Total** | | **~$35/month** | |

### Estimate with paid tier database:
| Component | Cost |
|-----------|------|
| Frontend | $20 |
| Backend | $20 |
| Database | $45 (shared tier) |
| **Total** | **~$85/month** |

## Post-Deployment Tasks

### Day 1
- [ ] Verify all endpoints working
- [ ] Test authentication flow
- [ ] Verify emails sending
- [ ] Check logs for errors
- [ ] Monitor performance metrics

### Week 1
- [ ] Collect performance data
- [ ] Monitor for errors/issues
- [ ] User feedback collection
- [ ] Security audit
- [ ] Database backup verification

### Month 1
- [ ] Analyze user behavior
- [ ] Optimize slow queries
- [ ] Update documentation
- [ ] Plan Phase 2 improvements
- [ ] Review and iterate

## Disaster Recovery Plan

### Backup Strategy
```bash
# MongoDB Atlas automatic daily backups (free tier)
# Manual export:
mongodump -d featurepulse -o ./backups/$(date +%Y%m%d)

# Restore if needed:
mongorestore --nsInclude='featurepulse.*' ./backups/20240115/
```

### Recovery Procedures
1. **Database corruption**
   - Restore from daily backup
   - Re-run migrations if needed
   - Verify data integrity

2. **API outage**
   - Restart application
   - Check logs for errors
   - Scale up if needed
   - Failover to secondary region

3. **Frontend issues**
   - Rollback to previous deployment
   - Check error tracking service
   - Re-deploy with fix

## Summary

**Recommended Stack:**
- Frontend: Vercel ($20/month)
- Backend: Railway ($15/month)
- Database: MongoDB Atlas Free tier
- **Total: ~$35/month**

**Upgrade path when scale needs it:**
- Add Redis for caching (~$5/month)
- Upgrade MongoDB tier ($45/month)
- Auto-scale backend instances (+$15/month per instance)

**Time to Production:** ~30 minutes (with Vercel + Railway)
