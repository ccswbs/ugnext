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

# Copy the entrypoint into the image
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy the dependency manifests so the image still builds successfully
COPY package.json bun.lock bunfig.toml ./

# Copy the rest of the project
COPY . .

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["bun", "run", "test:update-snapshots"]