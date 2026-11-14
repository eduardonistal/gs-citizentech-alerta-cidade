FROM node:22-alpine

ENV NODE_ENV=production PORT=3000
WORKDIR /app

# Imagem de runtime sem npm/corepack: reduz superfície e elimina CVEs
# transitivos do toolchain que o Trivy reportava no scan de imagem.
RUN rm -rf \
      /usr/local/lib/node_modules/npm \
      /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm \
      /usr/local/bin/npx \
      /usr/local/bin/corepack \
    && mkdir -p /app

COPY --chown=node:node MVP ./MVP
COPY --chown=node:node 01-Generative-AI-for-Engineering ./01-Generative-AI-for-Engineering
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "MVP/server.mjs"]
