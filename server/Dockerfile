# Multi-stage Dockerfile for BitCentral Go Backend Server

# Stage 1: Build stage
FROM golang:1.24-alpine AS builder

ENV GOTOOLCHAIN=auto
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git ca-certificates tzdata

# Cache Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY . .

# Build statically linked Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server main.go

# Stage 2: Final lightweight runtime container
FROM alpine:3.19

WORKDIR /app

# Install runtime dependencies (SSL certs, timezone data)
RUN apk add --no-cache ca-certificates tzdata

# Copy compiled executable and necessary runtime assets from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/isrgrootx1.pem /app/isrgrootx1.pem

# Create directory for PDF storage if missing
RUN mkdir -p /app/pdfs /app/data

# Default environment setup
ENV PORT=8080
ENV GIN_MODE=release

EXPOSE 8080

CMD ["/app/server"]
