package config

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
	"server/data"
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
	createFacultyDirectoryTable()
	createAuditLogsTable()
	createDailyActiveUserStatsTable()
	createAdminSentEmailsTable()
	createEmailJobQueuesTables()
	createCollegeLeavesTable()
	createNotificationsTables()
	createLostFoundTables()
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
		id INT AUTO_INCREMENT PRIMARY KEY,
		google_id VARCHAR(255) NULL,
		uid VARCHAR(128) NULL,
		email VARCHAR(255),
		display_name VARCHAR(255),
		photo_url VARCHAR(1024),
		creation_time VARCHAR(64),
		last_sign_in_time VARCHAR(64),
		last_seen_at VARCHAR(64),
		blocked TINYINT(1) NOT NULL DEFAULT 0,
		blocked_at DATETIME NULL,
		phone VARCHAR(64) NULL,
		role VARCHAR(64) NOT NULL DEFAULT 'user',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ createUsersTable notice: %v", err)
	}

	// 1. Add google_id column if missing
	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL`); err != nil {
		log.Printf("ℹ️ google_id column status: %v", err)
	}

	// 2. Backfill google_id from uid for 4000+ existing users
	if _, err := DB.Exec(`UPDATE users SET google_id = uid WHERE (google_id IS NULL OR google_id = '') AND (uid IS NOT NULL AND uid != '')`); err != nil {
		log.Printf("ℹ️ google_id backfill status: %v", err)
	}

	// 3. Add id column auto-increment if missing
	var hasID int
	_ = DB.QueryRow(`SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id'`).Scan(&hasID)
	if hasID == 0 {
		if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT UNIQUE KEY FIRST`); err != nil {
			if _, err2 := DB.Exec(`ALTER TABLE users ADD COLUMN id INT AUTO_INCREMENT UNIQUE KEY`); err2 != nil {
				log.Printf("⚠️ id column add error: %v / %v", err, err2)
			} else {
				log.Println("✅ Successfully added id AUTO_INCREMENT UNIQUE KEY column for 4000+ users")
			}
		} else {
			log.Println("✅ Successfully added id AUTO_INCREMENT UNIQUE KEY column for 4000+ users")
		}
	}

	// 4. Ensure unique index on google_id
	if _, err := DB.Exec(`ALTER TABLE users ADD UNIQUE INDEX idx_google_id (google_id)`); err != nil {
		log.Printf("ℹ️ idx_google_id index status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN last_seen_at VARCHAR(64) NULL`); err != nil {
		log.Printf("ℹ️ last_seen_at column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN blocked TINYINT(1) NOT NULL DEFAULT 0`); err != nil {
		log.Printf("ℹ️ blocked column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN blocked_at DATETIME NULL`); err != nil {
		log.Printf("ℹ️ blocked_at column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN flagged TINYINT(1) NOT NULL DEFAULT 0`); err != nil {
		log.Printf("ℹ️ flagged column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN flagged_at DATETIME NULL`); err != nil {
		log.Printf("ℹ️ flagged_at column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN flag_reason VARCHAR(255) NULL`); err != nil {
		log.Printf("ℹ️ flag_reason column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN flagged_by VARCHAR(255) NULL`); err != nil {
		log.Printf("ℹ️ flagged_by column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN phone VARCHAR(64) NULL`); err != nil {
		log.Printf("ℹ️ phone column status: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE users ADD COLUMN role VARCHAR(64) NOT NULL DEFAULT 'user'`); err != nil {
		log.Printf("ℹ️ role column status: %v", err)
	}

	log.Println("✅ users table schema & 4000+ user migration ready")
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

	if _, err := DB.Exec(`ALTER TABLE cards ADD COLUMN app_route VARCHAR(255) NOT NULL DEFAULT '' AFTER link`); err != nil {
		log.Printf("ℹ️ app_route column not created (may already exist): %v", err)
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
		INDEX idx_tx_is_anon (is_anonymous),
		INDEX idx_tx_status (payment_status)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ sponsor_transactions table notice: %v", err)
	} else {
		log.Println("✅ sponsor_transactions table ready")
	}
	_, _ = DB.Exec("CREATE INDEX idx_tx_status ON sponsor_transactions (payment_status)")
}

func createFacultyDirectoryTable() {
	query := `
	CREATE TABLE IF NOT EXISTS faculty_directory (
		id INT AUTO_INCREMENT PRIMARY KEY,
		email VARCHAR(255) NOT NULL UNIQUE,
		name VARCHAR(255) NOT NULL,
		phone VARCHAR(64) NOT NULL,
		photo_url TEXT,
		department VARCHAR(255) NOT NULL DEFAULT '',
		job_title VARCHAR(255) NOT NULL DEFAULT '',
		source VARCHAR(64) NOT NULL DEFAULT 'google_directory',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_fac_email (email),
		INDEX idx_fac_phone (phone),
		INDEX idx_fac_dept (department)
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ faculty_directory table notice: %v", err)
	} else {
		log.Println("✅ faculty_directory table ready")
	}
}

func createAuditLogsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS audit_logs (
		id INT AUTO_INCREMENT PRIMARY KEY,
		method VARCHAR(10) NOT NULL,
		endpoint VARCHAR(512) NOT NULL,
		query TEXT NULL,
		payload LONGTEXT NULL,
		ip_address VARCHAR(64) NOT NULL,
		user_uid VARCHAR(128) NULL,
		user_name VARCHAR(255) NULL,
		roll_no VARCHAR(64) NULL,
		role VARCHAR(64) NULL,
		status_code INT NOT NULL DEFAULT 200,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		INDEX idx_audit_created (created_at),
		INDEX idx_audit_user (user_uid),
		INDEX idx_audit_roll (roll_no),
		INDEX idx_audit_ip (ip_address),
		INDEX idx_audit_method (method)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ audit_logs table notice: %v", err)
	} else {
		log.Println("✅ audit_logs table ready")
	}
}

func createDailyActiveUserStatsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS daily_active_user_stats (
		id INT AUTO_INCREMENT PRIMARY KEY,
		date VARCHAR(10) NOT NULL UNIQUE,
		active_users_count INT NOT NULL DEFAULT 0,
		total_users_count INT NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_dau_date (date)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ daily_active_user_stats table notice: %v", err)
	} else {
		log.Println("✅ daily_active_user_stats table ready")
	}
}

func createAdminSentEmailsTable() {
	query := `
	CREATE TABLE IF NOT EXISTS admin_sent_emails (
		id INT AUTO_INCREMENT PRIMARY KEY,
		admin_uid VARCHAR(128) NULL,
		admin_email VARCHAR(255) NULL,
		subject VARCHAR(500) NOT NULL,
		body LONGTEXT NOT NULL,
		is_html TINYINT(1) DEFAULT 1,
		recipient_count INT DEFAULT 0,
		success_count INT DEFAULT 0,
		fail_count INT DEFAULT 0,
		recipients_json LONGTEXT NULL,
		error_details TEXT NULL,
		sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		INDEX idx_sent_at (sent_at),
		INDEX idx_admin_uid (admin_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ admin_sent_emails table notice: %v", err)
	} else {
		log.Println("✅ admin_sent_emails table ready")
	}
}

func createEmailJobQueuesTables() {
	queryBatches := `
	CREATE TABLE IF NOT EXISTS email_job_batches (
		id INT AUTO_INCREMENT PRIMARY KEY,
		batch_id VARCHAR(64) NOT NULL UNIQUE,
		admin_uid VARCHAR(128) NULL,
		admin_email VARCHAR(255) NULL,
		subject VARCHAR(500) NOT NULL,
		body LONGTEXT NOT NULL,
		is_html TINYINT(1) DEFAULT 1,
		custom_from_name VARCHAR(255) NULL,
		reply_to VARCHAR(255) NULL,
		status VARCHAR(32) NOT NULL DEFAULT 'pending',
		total_count INT NOT NULL DEFAULT 0,
		sent_count INT NOT NULL DEFAULT 0,
		failed_count INT NOT NULL DEFAULT 0,
		pending_count INT NOT NULL DEFAULT 0,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_batch_status (status),
		INDEX idx_batch_created (created_at),
		INDEX idx_batch_admin (admin_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryBatches); err != nil {
		log.Printf("ℹ️ email_job_batches table notice: %v", err)
	} else {
		log.Println("✅ email_job_batches table ready")
	}

	queryItems := `
	CREATE TABLE IF NOT EXISTS email_queue_items (
		id INT AUTO_INCREMENT PRIMARY KEY,
		batch_id VARCHAR(64) NOT NULL,
		recipient_email VARCHAR(255) NOT NULL,
		recipient_name VARCHAR(255) NULL,
		recipient_user_id VARCHAR(128) NULL,
		recipient_register_no VARCHAR(128) NULL,
		recipient_dept VARCHAR(128) NULL,
		recipient_batch VARCHAR(128) NULL,
		status VARCHAR(32) NOT NULL DEFAULT 'pending',
		attempts INT NOT NULL DEFAULT 0,
		error_message TEXT NULL,
		sent_at DATETIME NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_eq_batch_id (batch_id),
		INDEX idx_eq_status (status),
		INDEX idx_eq_recipient (recipient_email)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryItems); err != nil {
		log.Printf("ℹ️ email_queue_items table notice: %v", err)
	} else {
		log.Println("✅ email_queue_items table ready")
	}
}

func createCollegeLeavesTable() {
	query := `
	CREATE TABLE IF NOT EXISTS college_leaves (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		from_date DATE NOT NULL,
		to_date DATE NOT NULL,
		day VARCHAR(50) NULL,
		from_half_day VARCHAR(10) NOT NULL DEFAULT '',
		to_half_day VARCHAR(10) NOT NULL DEFAULT '',
		leave_type VARCHAR(50) NOT NULL DEFAULT 'GP',
		remarks TEXT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_leaves_dates (from_date, to_date),
		INDEX idx_leaves_from (from_date)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(query); err != nil {
		log.Printf("ℹ️ college_leaves table notice: %v", err)
	} else {
		log.Println("✅ college_leaves table ready")
	}

	// Safe column additions for existing tables
	_, _ = DB.Exec(`ALTER TABLE college_leaves ADD COLUMN from_half_day VARCHAR(10) NOT NULL DEFAULT '' AFTER day`)
	_, _ = DB.Exec(`ALTER TABLE college_leaves ADD COLUMN to_half_day VARCHAR(10) NOT NULL DEFAULT '' AFTER from_half_day`)
	_, _ = DB.Exec(`ALTER TABLE college_leaves ADD COLUMN leave_type VARCHAR(50) NOT NULL DEFAULT 'GP' AFTER to_half_day`)
	_, _ = DB.Exec(`ALTER TABLE college_leaves ADD COLUMN remarks TEXT NULL AFTER leave_type`)

	// Seed initial holidays if table is empty
	var count int
	err := DB.QueryRow("SELECT COUNT(*) FROM college_leaves").Scan(&count)
	if err == nil && count == 0 {
		stmt, err := DB.Prepare(`
			INSERT INTO college_leaves (name, from_date, to_date, day, from_half_day, to_half_day, leave_type, remarks)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`)
		if err == nil {
			defer stmt.Close()
			for _, hol := range data.Holidays {
				fromDate := hol.FromDate
				fromHalfDay := hol.FromHalfDay
				if strings.HasSuffix(fromDate, "(AN)") {
					fromDate = strings.TrimSuffix(fromDate, "(AN)")
					fromHalfDay = "AN"
				} else if strings.HasSuffix(fromDate, "(FN)") {
					fromDate = strings.TrimSuffix(fromDate, "(FN)")
					fromHalfDay = "FN"
				}

				dayName := hol.Day
				if dayName == "" {
					if t, parseErr := time.Parse("2006-01-02", fromDate); parseErr == nil {
						dayName = t.Weekday().String()
					}
				}

				leaveType := "GP"
				if strings.Contains(hol.Name, "GP") {
					leaveType = "GP"
				} else {
					leaveType = "Holiday"
				}

				_, _ = stmt.Exec(hol.Name, fromDate, hol.ToDate, dayName, fromHalfDay, hol.ToHalfDay, leaveType, hol.Remarks)
			}
			log.Println("✅ Seeded default college leaves from initial holidays data")
		}
	}
}

func createNotificationsTables() {
	queryNotif := `
	CREATE TABLE IF NOT EXISTS notifications (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		message TEXT NOT NULL,
		type VARCHAR(50) NOT NULL DEFAULT 'announcement',
		priority VARCHAR(20) NOT NULL DEFAULT 'normal',
		target_type ENUM('all', 'user', 'batch', 'dept') NOT NULL DEFAULT 'all',
		target_user_uid VARCHAR(128) NULL,
		target_email VARCHAR(255) NULL,
		target_roll_no VARCHAR(64) NULL,
		target_batch VARCHAR(64) NULL,
		target_dept VARCHAR(255) NULL,
		link_url VARCHAR(1024) NULL,
		link_text VARCHAR(100) NULL,
		created_by VARCHAR(128) NULL,
		is_active TINYINT(1) NOT NULL DEFAULT 1,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_notif_target (target_type, is_active, created_at),
		INDEX idx_notif_user_uid (target_user_uid),
		INDEX idx_notif_email (target_email),
		INDEX idx_notif_roll (target_roll_no)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryNotif); err != nil {
		log.Printf("ℹ️ notifications table notice: %v", err)
	} else {
		log.Println("✅ notifications table ready")
	}

	queryReads := `
	CREATE TABLE IF NOT EXISTS user_notification_reads (
		id INT AUTO_INCREMENT PRIMARY KEY,
		notification_id INT NOT NULL,
		user_uid VARCHAR(128) NOT NULL,
		read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE KEY uk_user_notif (notification_id, user_uid),
		INDEX idx_user_reads (user_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryReads); err != nil {
		log.Printf("ℹ️ user_notification_reads table notice: %v", err)
	} else {
		log.Println("✅ user_notification_reads table ready")
	}

	queryDismiss := `
	CREATE TABLE IF NOT EXISTS user_notification_dismissals (
		id INT AUTO_INCREMENT PRIMARY KEY,
		notification_id INT NOT NULL,
		user_uid VARCHAR(128) NOT NULL,
		dismissed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE KEY uk_user_dismissal (notification_id, user_uid),
		INDEX idx_user_dismiss (user_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryDismiss); err != nil {
		log.Printf("ℹ️ user_notification_dismissals table notice: %v", err)
	} else {
		log.Println("✅ user_notification_dismissals table ready")
	}
}

func createLostFoundTables() {
	queryItems := `
	CREATE TABLE IF NOT EXISTS lost_found_items (
		id INT AUTO_INCREMENT PRIMARY KEY,
		item_type ENUM('lost', 'found') NOT NULL,
		title VARCHAR(255) NOT NULL,
		category VARCHAR(64) NOT NULL,
		description TEXT NOT NULL,
		location_campus VARCHAR(128) NOT NULL,
		location_details VARCHAR(255) NULL,
		date_occurred VARCHAR(64) NOT NULL,
		time_occurred VARCHAR(64) NULL,
		images JSON NOT NULL,
		matched_roll_number VARCHAR(64) NULL,
		current_custody VARCHAR(128) NOT NULL DEFAULT 'with_finder',
		custody_details VARCHAR(255) NULL,
		secret_question VARCHAR(255) NULL,
		contact_phone VARCHAR(64) NULL,
		show_phone TINYINT(1) NOT NULL DEFAULT 1,
		allow_inapp_claim TINYINT(1) NOT NULL DEFAULT 1,
		user_uid VARCHAR(128) NOT NULL,
		user_name VARCHAR(255) NOT NULL,
		user_email VARCHAR(255) NOT NULL,
		user_roll_no VARCHAR(64) NULL,
		user_department VARCHAR(128) NULL,
		user_batch VARCHAR(64) NULL,
		status ENUM('active', 'claimed', 'handed_over', 'closed') NOT NULL DEFAULT 'active',
		latitude DOUBLE NULL,
		longitude DOUBLE NULL,
		is_pinned TINYINT(1) NOT NULL DEFAULT 0,
		is_flagged TINYINT(1) NOT NULL DEFAULT 0,
		resolved_at DATETIME NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_type_status (item_type, status),
		INDEX idx_category (category),
		INDEX idx_campus_location (location_campus),
		INDEX idx_roll (matched_roll_number),
		INDEX idx_user (user_uid),
		INDEX idx_created (created_at DESC)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryItems); err != nil {
		log.Printf("ℹ️ lost_found_items table notice: %v", err)
	} else {
		log.Println("✅ lost_found_items table ready")
	}

	// Safe column additions for existing table
	_, _ = DB.Exec("ALTER TABLE lost_found_items ADD COLUMN latitude DOUBLE NULL AFTER status")
	_, _ = DB.Exec("ALTER TABLE lost_found_items ADD COLUMN longitude DOUBLE NULL AFTER latitude")

	queryClaims := `
	CREATE TABLE IF NOT EXISTS lost_found_claims (
		id INT AUTO_INCREMENT PRIMARY KEY,
		item_id INT NOT NULL,
		claimant_uid VARCHAR(128) NOT NULL,
		claimant_name VARCHAR(255) NOT NULL,
		claimant_email VARCHAR(255) NOT NULL,
		claimant_roll_no VARCHAR(64) NULL,
		claimant_phone VARCHAR(64) NULL,
		proof_description TEXT NOT NULL,
		proof_image VARCHAR(1024) NULL,
		status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		INDEX idx_item_claims (item_id),
		INDEX idx_claimant (claimant_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := DB.Exec(queryClaims); err != nil {
		log.Printf("ℹ️ lost_found_claims table notice: %v", err)
	} else {
		log.Println("✅ lost_found_claims table ready")
	}
}
