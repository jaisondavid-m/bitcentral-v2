# Build stage
FROM golang:alpine AS builder

ENV GOTOOLCHAIN=auto
WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build statically compiled binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o mcp-server .

# Minimal final stage
FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /app/mcp-server /app/mcp-server

# Default port & environment
ENV PORT=8081
ENV BACKEND_URL=https://bitcentral.bitsathy.in
ENV GEMINI_MODEL=gemini-3.6-flash

EXPOSE 8081

CMD ["/app/mcp-server"]
