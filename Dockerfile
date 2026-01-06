FROM mcr.microsoft.com/playwright:v1.57.0-jammy

# 1. Install Bun
ENV BUN_INSTALL=/opt/bun
ENV PATH=$BUN_INSTALL/bin:$PATH
RUN apt-get update && apt-get install -y curl unzip \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# 2. Copy dependency files first for better caching
COPY package.json bun.lock bunfig.toml ./

# 3. Install dependencies
RUN bun install --frozen-lockfile

# 4. Copy the rest of the application
COPY . .

# (Optional) If you want the container to keep running or have a default entry
CMD ["bunx", "playwright", "test"]