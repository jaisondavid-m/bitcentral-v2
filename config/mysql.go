package config

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func InitMySQL() {
	user := os.Getenv("MYSQL_USER")
	password := os.Getenv("MYSQL_PASSWORD")
	host := os.Getenv("MYSQL_HOST")
	port := os.Getenv("MYSQL_PORT")
	database := os.Getenv("MYSQL_DATABASE")

	if user == "" || password == "" || host == "" || database == "" {
		log.Fatal("❌ Missing required MySQL environment variables")
	}

	if port == "" {
		port = "3306"
	}

	useSSL := os.Getenv("MYSQL_SSL_ENABLED") == "true"

	var dsn string

	if useSSL {
		caPath := os.Getenv("MYSQL_SSL_CA_PATH")
		if caPath == "" {
			log.Fatal("❌ MYSQL_SSL_CA_PATH is required when SSL is enabled")
		}

		rootCertPool := x509.NewCertPool()

		pem, err := os.ReadFile(caPath)
		if err != nil {
			log.Fatalf("❌ Failed to read CA file: %v", err)
		}

		if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
			log.Fatal("❌ Failed to append CA cert")
		}

		tlsConfig := &tls.Config{
			RootCAs:            rootCertPool,
			MinVersion:         tls.VersionTLS12,
			InsecureSkipVerify: false, // NEVER set true in production
		}

		if err := mysql.RegisterTLSConfig("custom", tlsConfig); err != nil {
			log.Fatalf("❌ TLS config error: %v", err)
		}

		dsn = fmt.Sprintf(
			"%s:%s@tcp(%s:%s)/%s?tls=custom&parseTime=true&timeout=5s&readTimeout=5s&writeTimeout=5s",
			user, password, host, port, database,
		)

	} else {
		dsn = fmt.Sprintf(
			"%s:%s@tcp(%s:%s)/%s?parseTime=true&timeout=5s&readTimeout=5s&writeTimeout=5s",
			user, password, host, port, database,
		)
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ DB open error: %v", err)
	}

	// 🔥 Connection Pool (Production Optimized)
	db.SetMaxOpenConns(50)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(10 * time.Minute)
	db.SetConnMaxIdleTime(5 * time.Minute)

	// Test connection
	if err := db.Ping(); err != nil {
		log.Fatalf("❌ DB connection failed: %v", err)
	}

	DB = db
	log.Println("✅ MySQL connected successfully")

	createTokenTable()
}

// ✅ Create table with dynamic name
func createTokenTable() {
	table := os.Getenv("MYSQL_TOKEN_TABLE")
	if table == "" {
		table = "ps_tokens"
	}

	query := fmt.Sprintf(`
	CREATE TABLE IF NOT EXISTS %s (
		token_key VARCHAR(100) PRIMARY KEY,
		token VARCHAR(2048),
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		updated_by VARCHAR(255)
	) ENGINE=InnoDB;
	`, table)

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("❌ Failed to create table: %v", err)
	}

	log.Printf("✅ %s table ready\n", table)
}

func createQBAnswerKeyTable() {
	query := `
	CREATE TABLE IF NOT EXISTS qb_answer_keys (
		id           INT AUTO_INCREMENT PRIMARY KEY,
		semester     INT NOT NULL,
		subject_code VARCHAR(50) NOT NULL,
		subject_name VARCHAR(200) NOT NULL,
		year         INT NOT NULL,
		answers      JSON NOT NULL,
		created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY unique_qb (semester, subject_code, year)
	) ENGINE=InnoDB;`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("❌ Failed to create qb_answer_keys table: %v", err)
	}
	log.Println("✅ qb_answer_keys table ready")
}