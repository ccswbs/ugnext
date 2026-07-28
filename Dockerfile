FROM mcr.microsoft.com/playwright:v1.61.1-noble

ENV BUN_INSTALL=/opt/bun
ENV PATH=$BUN_INSTALL/bin:$PATH

RUN apt-get update \
    && apt-get install -y curl unzip \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

ARG FONTAWESOME_PACKAGE_TOKEN
ENV FONTAWESOME_PACKAGE_TOKEN=$FONTAWESOME_PACKAGE_TOKEN

COPY package.json bun.lock bunfig.toml ./

RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]