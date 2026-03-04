import pool from '../../config/db';

export const getVideoById = async (videoId: number, userId: number) => {
    const [videoRows]: any = await pool.query(
        'SELECT v.*, s.subject_id FROM videos v JOIN sections s ON v.section_id = s.id WHERE v.id = ?',
        [videoId]
    );
    if (videoRows.length === 0) return null;

    const video = videoRows[0];
    const subjectId = video.subject_id;

    // Find prerequisite (previous video in global order)
    // Global order is sections.order_index, then videos.order_index
    const [prevVideoRows]: any = await pool.query(`
    SELECT v.id FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE s.subject_id = ? 
    AND (
      s.order_index < (SELECT order_index FROM sections WHERE id = ?)
      OR (s.id = ? AND v.order_index < ?)
    )
    ORDER BY s.order_index DESC, v.order_index DESC
    LIMIT 1
  `, [subjectId, video.section_id, video.section_id, video.order_index]);

    const prerequisiteId = prevVideoRows.length > 0 ? prevVideoRows[0].id : null;
    let locked = false;

    if (prerequisiteId) {
        const [progress]: any = await pool.query(
            'SELECT is_completed FROM video_progress WHERE user_id = ? AND video_id = ?',
            [userId, prerequisiteId]
        );
        if (progress.length === 0 || !progress[0].is_completed) {
            locked = true;
        }
    }

    // Next video ID
    const [nextVideoRows]: any = await pool.query(`
    SELECT v.id FROM videos v
    JOIN sections s ON v.section_id = s.id
    WHERE s.subject_id = ? 
    AND (
      s.order_index > (SELECT order_index FROM sections WHERE id = ?)
      OR (s.id = ? AND v.order_index > ?)
    )
    ORDER BY s.order_index ASC, v.order_index ASC
    LIMIT 1
  `, [subjectId, video.section_id, video.section_id, video.order_index]);

    return {
        ...video,
        locked,
        previous_video_id: prerequisiteId,
        next_video_id: nextVideoRows.length > 0 ? nextVideoRows[0].id : null
    };
};
