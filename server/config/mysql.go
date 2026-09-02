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
	createUsersTable()
	dropUserPresenceTable()
	createQBAnswerKeyTable()
	createSemesterSubjectsTable()
	createCardsTable()
	createMessMenuTables()
	createAdminsTable()
	createAllowedEmailsTable()
	createTrackerUsersTable()
	createSponsorNameOverridesTable()
	createSponsorDepartmentTables()
	createSponsorTransactionOverridesTable()
	createSponsorTransactionsTable()
	dropAcademicTables()
	createFeedbackMessagesTable()
}

func createAdminsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS admins (
		uid VARCHAR(128) PRIMARY KEY,
		created_by VARCHAR(128) NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create admins table: %v", err)
	}
	log.Println("✅ admins table ready")
}

func createFeedbackMessagesTable() {
	query := `
	CREATE TABLE IF NOT EXISTS feedback_messages (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_uid VARCHAR(128) NOT NULL,
		sender_type ENUM('user', 'admin') NOT NULL,
		sender_name VARCHAR(255) NOT NULL,
		sender_email VARCHAR(255) NOT NULL,
		message TEXT NOT NULL,
		is_read_by_admin TINYINT(1) DEFAULT 0,
		is_read_by_user TINYINT(1) DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		INDEX idx_user_uid_created (user_uid, created_at)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create feedback_messages table: %v", err)
	}
	log.Println("✅ feedback_messages table ready")
}

func createAllowedEmailsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS allowed_emails (
		id INT AUTO_INCREMENT PRIMARY KEY,
		value VARCHAR(255) NOT NULL,
		type ENUM('email','domain') NOT NULL,
		created_by VARCHAR(128) NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create allowed_emails table: %v", err)
	}
	log.Println("✅ allowed_emails table ready")
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

func createUsersTable() {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		uid VARCHAR(128) PRIMARY KEY,
		email VARCHAR(255),
		display_name VARCHAR(255),
		photo_url VARCHAR(1024),
		creation_time VARCHAR(64),
		last_sign_in_time VARCHAR(64),
		last_seen_at VARCHAR(64),
		blocked TINYINT(1) NOT NULL DEFAULT 0,
		blocked_at DATETIME NULL,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create users table: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN last_seen_at VARCHAR(64) NULL`); err != nil {
		log.Printf("ℹ️ last_seen_at column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN blocked TINYINT(1) NOT NULL DEFAULT 0`); err != nil {
		log.Printf("ℹ️ blocked column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN blocked_at DATETIME NULL`); err != nil {
		log.Printf("ℹ️ blocked_at column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN phone VARCHAR(64) NULL`); err != nil {
		log.Printf("ℹ️ phone column not created (may already exist): %v", err)
	}

	log.Println("✅ users table ready")
}

func dropUserPresenceTable() {
	DB.Exec("DROP TABLE IF EXISTS user_presence")
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

func createSemesterSubjectsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS semester_subjects (
		id INT AUTO_INCREMENT PRIMARY KEY,
		year INT NOT NULL,
		department VARCHAR(50) NOT NULL DEFAULT 'ALL',
		idx INT NOT NULL,
		code VARCHAR(50),
		name VARCHAR(255),
		qb1 VARCHAR(1024),
		qb2 VARCHAR(1024),
		ak1 VARCHAR(1024),
		ak2 VARCHAR(1024),
		sem_qb_with_ans VARCHAR(1024),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY unique_year_idx (year, idx)
	) ENGINE=InnoDB;`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("❌ Failed to create semester_subjects table: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE semester_subjects DROP INDEX unique_year_idx`); err != nil {
		log.Printf("ℹ️ unique_year_idx index drop status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE semester_subjects DROP INDEX unique_year_code`); err != nil {
		log.Printf("ℹ️ unique_year_code index drop status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE semester_subjects ADD COLUMN department VARCHAR(50) NOT NULL DEFAULT 'ALL'`); err != nil {
		log.Printf("ℹ️ department column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE semester_subjects ADD INDEX idx_sem_sub_year_dept (year, department)`); err != nil {
		log.Printf("ℹ️ idx_sem_sub_year_dept index not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE semester_subjects ADD INDEX idx_sem_sub_year_idx (year, idx)`); err != nil {
		log.Printf("ℹ️ idx_sem_sub_year_idx index not created (may already exist): %v", err)
	}
	log.Println("✅ semester_subjects table ready")
}

func createCardsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS cards (
		id INT AUTO_INCREMENT PRIMARY KEY,
		card_order INT NOT NULL DEFAULT 0,
		click_count INT NOT NULL DEFAULT 0,
		img LONGTEXT,
		name VARCHAR(255) NOT NULL,
		keywords JSON,
		link VARCHAR(1024),
		btntext VARCHAR(255),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("❌ Failed to create cards table: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE cards ADD COLUMN card_order INT NOT NULL DEFAULT 0 AFTER id`); err != nil {
		log.Printf("ℹ️ card_order column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE cards ADD COLUMN click_count INT NOT NULL DEFAULT 0 AFTER card_order`); err != nil {
		log.Printf("ℹ️ click_count column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE cards ADD INDEX idx_cards_card_order (card_order)`); err != nil {
		log.Printf("ℹ️ idx_cards_card_order not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`UPDATE cards SET card_order = id WHERE card_order = 0`); err != nil {
		log.Printf("ℹ️ card_order backfill skipped: %v", err)
	}

	log.Println("✅ cards table ready")
}

func createMessMenuTables() {
	query := `
	CREATE TABLE IF NOT EXISTS mess_menu_items (
		id INT AUTO_INCREMENT PRIMARY KEY,
		hostel VARCHAR(10) NOT NULL,
		menu_date DATE NOT NULL,
		day VARCHAR(32) NOT NULL,
		meal_type VARCHAR(20) NOT NULL,
		item_order INT NOT NULL,
		item VARCHAR(255) NOT NULL,
		source_file VARCHAR(255),
		uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY unique_menu_row (hostel, menu_date, meal_type, item_order),
		INDEX idx_mess_lookup (hostel, menu_date),
		INDEX idx_mess_meal_order (hostel, menu_date, meal_type, item_order)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create mess_menu_items table: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD COLUMN source_file VARCHAR(255) NULL AFTER item`); err != nil {
		log.Printf("ℹ️ source_file column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD COLUMN uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP AFTER source_file`); err != nil {
		log.Printf("ℹ️ uploaded_at column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER uploaded_at`); err != nil {
		log.Printf("ℹ️ updated_at column not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD UNIQUE KEY unique_menu_row (hostel, menu_date, meal_type, item_order)`); err != nil {
		log.Printf("ℹ️ unique_menu_row index not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD INDEX idx_mess_lookup (hostel, menu_date)`); err != nil {
		log.Printf("ℹ️ idx_mess_lookup not created (may already exist): %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE mess_menu_items ADD INDEX idx_mess_meal_order (hostel, menu_date, meal_type, item_order)`); err != nil {
		log.Printf("ℹ️ idx_mess_meal_order not created (may already exist): %v", err)
	}

	log.Println("✅ mess_menu_items table ready")
}

func createTrackerUsersTable() {
	query := `
	CREATE TABLE IF NOT EXISTS tracker_users (
		user_id VARCHAR(128) NULL,
		id VARCHAR(128) PRIMARY KEY,
		name VARCHAR(255) NULL,
		email VARCHAR(255) NULL,
		batch VARCHAR(64) NULL,
		phone VARCHAR(64) NULL,
		department VARCHAR(255) NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_tracker_users_user_id (user_id),
		INDEX idx_tracker_users_name (name),
		INDEX idx_tracker_users_email (email)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ tracker_users table notice: %v", err)
	} else {
		log.Println("✅ tracker_users table ready")
	}

	// Safe column additions for existing tables
	DB.Exec(`ALTER TABLE tracker_users ADD COLUMN batch VARCHAR(64) NULL`)
	DB.Exec(`ALTER TABLE tracker_users ADD COLUMN phone VARCHAR(64) NULL`)
	DB.Exec(`ALTER TABLE tracker_users ADD COLUMN department VARCHAR(255) NULL`)
}

func dropAcademicTables() {
	tables := []string{
		"academic_exam_schedules",
		"academic_question_papers",
		"academic_materials",
		"academic_exams",
		"academic_curriculum",
		"academic_courses",
		"academic_batches",
		"academic_departments",
		"academic_semesters",
		"academic_regulations",
	}
	for _, t := range tables {
		DB.Exec(fmt.Sprintf("DROP TABLE IF EXISTS %s", t))
	}
}

func createSponsorNameOverridesTable() {
	query := `
	CREATE TABLE IF NOT EXISTS sponsor_name_overrides (
		donor_key VARCHAR(255) PRIMARY KEY,
		custom_name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NULL,
		phone VARCHAR(64) NULL,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_sponsor_overrides_email (email),
		INDEX idx_sponsor_overrides_phone (phone)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ sponsor_name_overrides table notice: %v", err)
	} else {
		log.Println("✅ sponsor_name_overrides table ready")
	}
}

func createSponsorDepartmentTables() {
	queryDept := `
	CREATE TABLE IF NOT EXISTS sponsor_departments (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		code VARCHAR(50) NOT NULL,
		email_code VARCHAR(50) NOT NULL DEFAULT '',
		year VARCHAR(50) NOT NULL,
		year_code VARCHAR(50) NOT NULL DEFAULT '',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY uk_dept_code_year (code, year)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(queryDept); err != nil {
		log.Printf("ℹ️ sponsor_departments table notice: %v", err)
	} else {
		log.Println("✅ sponsor_departments table ready")
	}

	// Add email_code and year_code columns if missing (for existing databases)
	_, _ = DB.Exec("ALTER TABLE sponsor_departments ADD COLUMN email_code VARCHAR(50) NOT NULL DEFAULT '' AFTER code")
	_, _ = DB.Exec("ALTER TABLE sponsor_departments ADD COLUMN year_code VARCHAR(50) NOT NULL DEFAULT '' AFTER year")

	queryMapping := `
	CREATE TABLE IF NOT EXISTS sponsor_department_mappings (
		donor_key VARCHAR(255) PRIMARY KEY,
		department_id INT NOT NULL,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_sponsor_dept_id (department_id)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(queryMapping); err != nil {
		log.Printf("ℹ️ sponsor_department_mappings table notice: %v", err)
	}
	createSponsorTransactionOverridesTable()
	createSponsorTransactionsTable()
}

func createSponsorTransactionOverridesTable() {
	query := `
	CREATE TABLE IF NOT EXISTS sponsor_transaction_overrides (
		payment_id VARCHAR(255) PRIMARY KEY,
		is_anonymous TINYINT(1) NOT NULL DEFAULT 0,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ sponsor_transaction_overrides table notice: %v", err)
	} else {
		log.Println("✅ sponsor_transaction_overrides table ready")
	}
}

func createSponsorTransactionsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS sponsor_transactions (
		payment_id VARCHAR(255) PRIMARY KEY,
		donor_name VARCHAR(255) NOT NULL DEFAULT '',
		email VARCHAR(255) NOT NULL DEFAULT '',
		phone VARCHAR(50) NOT NULL DEFAULT '',
		phone_digits VARCHAR(20) NOT NULL DEFAULT '',
		amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
		is_anonymous TINYINT(1) NOT NULL DEFAULT 0,
		target_department_id INT NOT NULL DEFAULT 0,
		target_department_code VARCHAR(50) NOT NULL DEFAULT '',
		payment_status VARCHAR(50) NOT NULL DEFAULT 'captured',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_tx_phone (phone_digits),
		INDEX idx_tx_email (email),
		INDEX idx_tx_is_anon (is_anonymous)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ sponsor_transactions table notice: %v", err)
	} else {
		log.Println("✅ sponsor_transactions table ready")
	}
}
