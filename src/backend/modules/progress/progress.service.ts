import pool from '../../config/db';

export const getSubjectProgress = async (userId: number, subjectId: number) => {
    const [videoCountRows]: any = await pool.query(
        'SELECT COUNT(*) as total FROM videos v JOIN sections s ON v.section_id = s.id WHERE s.subject_id = ?',
        [subjectId]
    );

    const [completedCountRows]: any = await pool.query(`
    SELECT COUNT(*) as completed FROM video_progress vp
    JOIN videos v ON vp.video_id = v.id
    JOIN sections s ON v.section_id = s.id
    WHERE vp.user_id = ? AND s.subject_id = ? AND vp.is_completed = TRUE
  `, [userId, subjectId]);

    const total = videoCountRows[0].total;
    const completed = completedCountRows[0].completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percent };
};

export const getVideoProgress = async (userId: number, videoId: number) => {
    const [rows]: any = await pool.query(
        'SELECT last_position_seconds, is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
        [userId, videoId]
    );
    return rows[0] || { last_position_seconds: 0, is_completed: false };
};

export const updateVideoProgress = async (userId: number, videoId: number, lastPosition: number, isCompleted: boolean) => {
    const completedAt = isCompleted ? new Date() : null;

    await pool.query(`
    INSERT INTO video_progress (user_id, video_id, last_position_seconds, is_completed, completed_at)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      last_position_seconds = VALUES(last_position_seconds),
      is_completed = IF(is_completed = TRUE, TRUE, VALUES(is_completed)),
      completed_at = IF(completed_at IS NOT NULL, completed_at, VALUES(completed_at))
  `, [userId, videoId, lastPosition, isCompleted, completedAt]);
};
export const getSubjectProgressDetails = async (userId: number, subjectId: number) => {
    const [rows]: any = await pool.query(`
    SELECT v.id, vp.is_completed FROM videos v
    JOIN sections s ON v.section_id = s.id
    LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_id = ?
    WHERE s.subject_id = ?
  `, [userId, subjectId]);
    return rows;
};
