# ---------------------------------------------
# 🏗️ 1️⃣ Base Builder Image
# ---------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
# Use npm ci for clean reproducible installs
RUN npm ci

# Copy entire project
COPY . .

# Build the Next.js app (for production)
RUN npm run build


# ---------------------------------------------
# 🚀 2️⃣ Production Runtime Image
# ---------------------------------------------
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy necessary build output and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port 3000
EXPOSE 3000

# Next.js runs with standalone output if configured
# For now, we use the default start command
CMD ["npm", "start"]
