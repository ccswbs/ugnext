FROM mcr.microsoft.com/playwright:v1.58.0-jammy

# 1. Install Node.js (already included in playwright image)
WORKDIR /workspace

ARG FONTAWESOME_PACKAGE_TOKEN
ENV FONTAWESOME_PACKAGE_TOKEN=$FONTAWESOME_PACKAGE_TOKEN

# 2. Copy dependency files first for better caching
COPY package.json package-lock.json .npmrc ./

# 3. Install dependencies
RUN npm ci

# 4. Copy the rest of the application
COPY . .

# (Optional) If you want the container to keep running or have a default entry
CMD ["npx", "playwright", "test"]