import pool from '../config/db';

const schema = `
DROP TABLE IF EXISTS video_progress;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  instructor_name VARCHAR(255) DEFAULT 'Senior Instructor',
  learning_outcomes TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);

CREATE TABLE IF NOT EXISTS sections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_subject_order (subject_id, order_index)
);

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(255) NOT NULL,
  order_index INT NOT NULL,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_section_order (section_id, order_index)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  subject_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_user_subject (user_id, subject_id)
);

CREATE TABLE IF NOT EXISTS video_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  video_id INT NOT NULL,
  last_position_seconds INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
  UNIQUE INDEX idx_user_video (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_token (user_id, token_hash)
);
`;

const courseData = [
    {
        course: "Java",
        instructor: "Dr. James Gosling",
        outcomes: "Master Java syntax and variables;Implement control flow logic;Comprehensive OOP principles;Exception handling;Building backend systems",
        sections: [
            {
                title: "Java Basics",
                videos: [
                    "https://youtu.be/grEKMHGYyns",
                    "https://youtu.be/grEKMHGYyns?t=600",
                    "https://youtu.be/grEKMHGYyns?t=1200",
                    "https://youtu.be/grEKMHGYyns?t=1800",
                    "https://youtu.be/grEKMHGYyns?t=2400"
                ]
            },
            {
                title: "Control Flow",
                videos: [
                    "https://youtu.be/grEKMHGYyns?t=3000",
                    "https://youtu.be/grEKMHGYyns?t=3600",
                    "https://youtu.be/grEKMHGYyns?t=4200",
                    "https://youtu.be/grEKMHGYyns?t=4800",
                    "https://youtu.be/grEKMHGYyns?t=5400"
                ]
            },
            {
                title: "OOP Concepts",
                videos: [
                    "https://youtu.be/grEKMHGYyns?t=6000",
                    "https://youtu.be/grEKMHGYyns?t=6600",
                    "https://youtu.be/grEKMHGYyns?t=7200",
                    "https://youtu.be/grEKMHGYyns?t=7800",
                    "https://youtu.be/grEKMHGYyns?t=8400"
                ]
            }
        ]
    },
    {
        course: "Python",
        instructor: "Guido van Rossum",
        outcomes: "Python fundamental syntax;Data structures (Lists, Dicts);Functional programming;Modules and packages;File handling and automation",
        sections: [
            {
                title: "Python Introduction",
                videos: [
                    "https://youtu.be/rfscVS0vtbw",
                    "https://youtu.be/rfscVS0vtbw?t=600",
                    "https://youtu.be/rfscVS0vtbw?t=1200",
                    "https://youtu.be/rfscVS0vtbw?t=1800",
                    "https://youtu.be/rfscVS0vtbw?t=2400"
                ]
            },
            {
                title: "Data Structures",
                videos: [
                    "https://youtu.be/rfscVS0vtbw?t=3000",
                    "https://youtu.be/rfscVS0vtbw?t=3600",
                    "https://youtu.be/rfscVS0vtbw?t=4200",
                    "https://youtu.be/rfscVS0vtbw?t=4800",
                    "https://youtu.be/rfscVS0vtbw?t=5400"
                ]
            },
            {
                title: "Functions & Modules",
                videos: [
                    "https://youtu.be/rfscVS0vtbw?t=6000",
                    "https://youtu.be/rfscVS0vtbw?t=6600",
                    "https://youtu.be/rfscVS0vtbw?t=7200",
                    "https://youtu.be/rfscVS0vtbw?t=7800",
                    "https://youtu.be/rfscVS0vtbw?t=8400"
                ]
            }
        ]
    },
    {
        course: "Machine Learning",
        instructor: "Andrew Ng",
        outcomes: "Foundations of AI & ML;Supervised learning models;Neural networks;Model evaluation;Deploying ML models",
        sections: [
            {
                title: "ML Introduction",
                videos: [
                    "https://youtu.be/7eh4d6sabA0",
                    "https://youtu.be/7eh4d6sabA0?t=600",
                    "https://youtu.be/7eh4d6sabA0?t=1200",
                    "https://youtu.be/7eh4d6sabA0?t=1800",
                    "https://youtu.be/7eh4d6sabA0?t=2400"
                ]
            },
            {
                title: "Supervised Learning",
                videos: [
                    "https://youtu.be/7eh4d6sabA0?t=3000",
                    "https://youtu.be/7eh4d6sabA0?t=3600",
                    "https://youtu.be/7eh4d6sabA0?t=4200",
                    "https://youtu.be/7eh4d6sabA0?t=4800",
                    "https://youtu.be/7eh4d6sabA0?t=5400"
                ]
            },
            {
                title: "ML Algorithms",
                videos: [
                    "https://youtu.be/7eh4d6sabA0?t=6000",
                    "https://youtu.be/7eh4d6sabA0?t=6600",
                    "https://youtu.be/7eh4d6sabA0?t=7200",
                    "https://youtu.be/7eh4d6sabA0?t=7800",
                    "https://youtu.be/7eh4d6sabA0?t=8400"
                ]
            }
        ]
    }
];

async function initialize() {
    const connection = await pool.getConnection();
    try {
        console.log("Initializing database schema...");
        const statements = schema.split(';').filter(s => s.trim());
        for (const statement of statements) {
            await connection.query(statement);
        }
        console.log("Schema initialized.");

        // Create Demo User
        console.log("Seeding demo user...");
        const { hashPassword } = await import('../utils/password');
        const demoPasswordHash = await hashPassword('demo123');
        await connection.query(
            "INSERT IGNORE INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
            ['demo@gmail.com', demoPasswordHash, 'Demo User', 'student']
        );
        console.log("Demo user created (demo@gmail.com / demo123).");

        console.log("Seeding course data...");
        for (const data of courseData) {
            const slug = data.course.toLowerCase().replace(/ /g, '-');
            const [subjectResult]: any = await connection.query(
                "INSERT IGNORE INTO subjects (title, slug, description, instructor_name, learning_outcomes, is_published) VALUES (?, ?, ?, ?, ?, ?)",
                [data.course, slug, `${data.course} full course with sections.`, data.instructor, data.outcomes, true]
            );

            let subjectId;
            if (subjectResult.insertId) {
                subjectId = subjectResult.insertId;
            } else {
                const [existing]: any = await connection.query("SELECT id FROM subjects WHERE slug = ?", [slug]);
                subjectId = existing[0].id;
            }

            for (let i = 0; i < data.sections.length; i++) {
                const section = data.sections[i];
                const [sectionResult]: any = await connection.query(
                    "INSERT IGNORE INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)",
                    [subjectId, section.title, i + 1]
                );

                let sectionId;
                if (sectionResult.insertId) {
                    sectionId = sectionResult.insertId;
                } else {
                    const [existing]: any = await connection.query(
                        "SELECT id FROM sections WHERE subject_id = ? AND order_index = ?",
                        [subjectId, i + 1]
                    );
                    sectionId = existing[0].id;
                }

                for (let j = 0; j < section.videos.length; j++) {
                    const videoUrl = section.videos[j];
                    await connection.query(
                        "INSERT IGNORE INTO videos (section_id, title, youtube_url, order_index) VALUES (?, ?, ?, ?)",
                        [sectionId, `Video ${j + 1}: ${section.title}`, videoUrl, j + 1]
                    );
                }
            }
        }
        console.log("Seeding completed.");

    } catch (error) {
        console.error("Initialization failed:", error);
    } finally {
        connection.release();
        process.exit();
    }
}

initialize();
