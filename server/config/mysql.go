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
	createUserPresenceTable()
	createQBAnswerKeyTable()
	createSemesterSubjectsTable()
	createCardsTable()
	createMessMenuTables()
	createAdminsTable()
	createAllowedEmailsTable()
	createTrackerUsersTable()
	createAcademicTables()
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

	log.Println("✅ users table ready")
}

func createUserPresenceTable() {
	query := `
	CREATE TABLE IF NOT EXISTS user_presence (
		uid VARCHAR(128) PRIMARY KEY,
		last_seen_at VARCHAR(64) NOT NULL,
		last_used_route VARCHAR(128) NULL,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB;`

	if _, err := DB.Exec(query); err != nil {
		log.Fatalf("❌ Failed to create user_presence table: %v", err)
	}

	if _, err := DB.Exec(`ALTER TABLE user_presence ADD COLUMN last_used_route VARCHAR(128) NULL`); err != nil {
		log.Printf("ℹ️ last_used_route column not created (may already exist): %v", err)
	}

	log.Println("✅ user_presence table ready")
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

func createAcademicTables() {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS academic_departments (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			code VARCHAR(50) NOT NULL UNIQUE,
			description TEXT,
			current_semester_id INT NULL,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_dept_curr_sem (current_semester_id),
			CONSTRAINT fk_dept_curr_sem FOREIGN KEY (current_semester_id) REFERENCES academic_semesters(id) ON DELETE SET NULL
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_regulations (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			year INT NOT NULL,
			description TEXT,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_batches (
			id INT AUTO_INCREMENT PRIMARY KEY,
			department_id INT NOT NULL,
			regulation_id INT NOT NULL,
			start_year INT NOT NULL,
			end_year INT NOT NULL,
			batch_name VARCHAR(100) NOT NULL,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_batch_dept (department_id),
			INDEX idx_batch_reg (regulation_id),
			CONSTRAINT fk_batch_dept FOREIGN KEY (department_id) REFERENCES academic_departments(id) ON DELETE CASCADE,
			CONSTRAINT fk_batch_reg FOREIGN KEY (regulation_id) REFERENCES academic_regulations(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_semesters (
			id INT AUTO_INCREMENT PRIMARY KEY,
			semester_number INT NOT NULL UNIQUE,
			semester_name VARCHAR(100) NOT NULL,
			year_number INT NOT NULL,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_courses (
			id INT AUTO_INCREMENT PRIMARY KEY,
			department_id INT NOT NULL,
			regulation_id INT NOT NULL,
			semester_id INT NOT NULL,
			code VARCHAR(50) NOT NULL,
			name VARCHAR(255) NOT NULL,
			short_name VARCHAR(100),
			credits INT NOT NULL DEFAULT 3,
			course_type VARCHAR(50) NOT NULL DEFAULT 'Theory',
			is_elective TINYINT(1) NOT NULL DEFAULT 0,
			description TEXT,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_course_dept (department_id),
			INDEX idx_course_reg (regulation_id),
			INDEX idx_course_sem (semester_id),
			CONSTRAINT fk_course_dept FOREIGN KEY (department_id) REFERENCES academic_departments(id) ON DELETE CASCADE,
			CONSTRAINT fk_course_reg FOREIGN KEY (regulation_id) REFERENCES academic_regulations(id) ON DELETE CASCADE,
			CONSTRAINT fk_course_sem FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_curriculum (
			id INT AUTO_INCREMENT PRIMARY KEY,
			department_id INT NOT NULL,
			regulation_id INT NOT NULL,
			semester_id INT NOT NULL,
			course_id INT NOT NULL,
			is_elective TINYINT(1) NOT NULL DEFAULT 0,
			course_order INT NOT NULL DEFAULT 0,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			UNIQUE KEY unique_curr (department_id, regulation_id, semester_id, course_id),
			INDEX idx_curr_dept (department_id),
			INDEX idx_curr_reg (regulation_id),
			INDEX idx_curr_sem (semester_id),
			INDEX idx_curr_course (course_id),
			CONSTRAINT fk_curr_dept FOREIGN KEY (department_id) REFERENCES academic_departments(id) ON DELETE CASCADE,
			CONSTRAINT fk_curr_reg FOREIGN KEY (regulation_id) REFERENCES academic_regulations(id) ON DELETE CASCADE,
			CONSTRAINT fk_curr_sem FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE,
			CONSTRAINT fk_curr_course FOREIGN KEY (course_id) REFERENCES academic_courses(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_materials (
			id INT AUTO_INCREMENT PRIMARY KEY,
			course_id INT NOT NULL,
			title VARCHAR(255) NOT NULL,
			description TEXT,
			material_type VARCHAR(50) NOT NULL,
			file_url VARCHAR(1024) NOT NULL,
			unit VARCHAR(50),
			item_order INT NOT NULL DEFAULT 0,
			status ENUM('published', 'unpublished') NOT NULL DEFAULT 'published',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_mat_course (course_id),
			CONSTRAINT fk_mat_course FOREIGN KEY (course_id) REFERENCES academic_courses(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_exams (
			id INT AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			exam_type VARCHAR(50) NOT NULL,
			academic_year VARCHAR(50) NOT NULL,
			department_id INT NOT NULL,
			regulation_id INT NOT NULL,
			semester_id INT NOT NULL,
			start_date DATE,
			end_date DATE,
			description TEXT,
			status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_exam_dept (department_id),
			INDEX idx_exam_reg (regulation_id),
			INDEX idx_exam_sem (semester_id),
			CONSTRAINT fk_exam_dept FOREIGN KEY (department_id) REFERENCES academic_departments(id) ON DELETE CASCADE,
			CONSTRAINT fk_exam_reg FOREIGN KEY (regulation_id) REFERENCES academic_regulations(id) ON DELETE CASCADE,
			CONSTRAINT fk_exam_sem FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_exam_schedules (
			id INT AUTO_INCREMENT PRIMARY KEY,
			exam_id INT NOT NULL,
			course_id INT NOT NULL,
			exam_date DATE NOT NULL,
			start_time VARCHAR(20) NOT NULL,
			end_time VARCHAR(20) NOT NULL,
			venue VARCHAR(255) NOT NULL,
			instructions TEXT,
			status ENUM('scheduled', 'rescheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_sched_exam (exam_id),
			INDEX idx_sched_course (course_id),
			CONSTRAINT fk_sched_exam FOREIGN KEY (exam_id) REFERENCES academic_exams(id) ON DELETE CASCADE,
			CONSTRAINT fk_sched_course FOREIGN KEY (course_id) REFERENCES academic_courses(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,

		`CREATE TABLE IF NOT EXISTS academic_question_papers (
			id INT AUTO_INCREMENT PRIMARY KEY,
			course_id INT NOT NULL,
			exam_type VARCHAR(50) NOT NULL,
			academic_year VARCHAR(50) NOT NULL,
			regulation_id INT NOT NULL,
			semester_id INT NOT NULL,
			year_number INT NOT NULL,
			file_url VARCHAR(1024) NOT NULL,
			description TEXT,
			status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			INDEX idx_qp_course (course_id),
			INDEX idx_qp_reg (regulation_id),
			INDEX idx_qp_sem (semester_id),
			CONSTRAINT fk_qp_course FOREIGN KEY (course_id) REFERENCES academic_courses(id) ON DELETE CASCADE,
			CONSTRAINT fk_qp_reg FOREIGN KEY (regulation_id) REFERENCES academic_regulations(id) ON DELETE CASCADE,
			CONSTRAINT fk_qp_sem FOREIGN KEY (semester_id) REFERENCES academic_semesters(id) ON DELETE CASCADE
		) ENGINE=InnoDB;`,
	}

	for _, q := range queries {
		if _, err := DB.Exec(q); err != nil {
			log.Printf("⚠️ Academic table init notice: %v", err)
		}
	}

	// Auto seed default 8 engineering semesters if empty
	var semCount int
	if err := DB.QueryRow("SELECT COUNT(*) FROM academic_semesters").Scan(&semCount); err == nil && semCount == 0 {
		semStmt, err := DB.Prepare("INSERT INTO academic_semesters (semester_number, semester_name, year_number, status) VALUES (?, ?, ?, 'active')")
		if err == nil {
			defer semStmt.Close()
			for i := 1; i <= 8; i++ {
				yr := (i + 1) / 2
				semName := fmt.Sprintf("Semester %d", i)
				semStmt.Exec(i, semName, yr)
			}
			log.Println("✅ Auto-seeded 8 default semesters")
		}
	}

	// Safe column additions & schema updates for existing tables
	DB.Exec(`ALTER TABLE academic_departments ADD COLUMN current_semester_id INT NULL AFTER description`)
	DB.Exec(`ALTER TABLE academic_batches ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER id`)
	DB.Exec(`ALTER TABLE academic_courses ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER id`)
	DB.Exec(`ALTER TABLE academic_courses ADD COLUMN regulation_id INT NOT NULL DEFAULT 0 AFTER department_id`)
	DB.Exec(`ALTER TABLE academic_courses ADD COLUMN semester_id INT NOT NULL DEFAULT 0 AFTER regulation_id`)
	DB.Exec(`ALTER TABLE academic_courses ADD COLUMN is_elective TINYINT(1) NOT NULL DEFAULT 0 AFTER course_type`)
	DB.Exec(`ALTER TABLE academic_curriculum ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER id`)
	DB.Exec(`ALTER TABLE academic_exams ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER academic_year`)
	DB.Exec(`ALTER TABLE academic_materials ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER course_id`)
	DB.Exec(`ALTER TABLE academic_materials ADD COLUMN semester_id INT NOT NULL DEFAULT 0 AFTER department_id`)
	DB.Exec(`ALTER TABLE academic_question_papers ADD COLUMN exam_id INT NULL AFTER id`)
	DB.Exec(`ALTER TABLE academic_question_papers ADD COLUMN department_id INT NOT NULL DEFAULT 0 AFTER course_id`)

	// Drop single-column UNIQUE index on code if present, so courses can be mapped per dept/reg/sem
	DB.Exec(`ALTER TABLE academic_courses DROP INDEX code`)
	DB.Exec(`ALTER TABLE academic_courses DROP INDEX code_2`)
	DB.Exec(`ALTER TABLE academic_courses DROP INDEX uq_course_code`)

	// Clean up legacy program_id column if present from prior initialization
	DB.Exec(`ALTER TABLE academic_batches DROP FOREIGN KEY fk_batch_prog`)
	DB.Exec(`ALTER TABLE academic_batches DROP COLUMN program_id`)
	DB.Exec(`ALTER TABLE academic_curriculum DROP FOREIGN KEY fk_curr_prog`)
	DB.Exec(`ALTER TABLE academic_curriculum DROP COLUMN program_id`)
	DB.Exec(`ALTER TABLE academic_exams DROP FOREIGN KEY fk_exam_prog`)
	DB.Exec(`ALTER TABLE academic_exams DROP COLUMN program_id`)

	log.Println("✅ Academic tables ready")
}


