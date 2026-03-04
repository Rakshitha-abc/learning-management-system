import pool from '../../config/db';

export const getAllPublishedSubjects = async () => {
    const [rows]: any = await pool.query(`
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM videos v 
         JOIN sections sec ON v.section_id = sec.id 
         WHERE sec.subject_id = s.id) as totalLessons
      FROM subjects s 
      WHERE s.is_published = TRUE
    `);
    return rows;
};

export const getSubjectById = async (id: number) => {
    const [subjects]: any = await pool.query(`
      SELECT 
        s.*,
        (SELECT v.id FROM videos v 
         JOIN sections sec ON v.section_id = sec.id 
         WHERE sec.subject_id = s.id 
         ORDER BY sec.order_index ASC, v.order_index ASC 
         LIMIT 1) as firstVideoId,
        (SELECT COUNT(*) FROM videos v 
         JOIN sections sec ON v.section_id = sec.id 
         WHERE sec.subject_id = s.id) as totalLessons
      FROM subjects s 
      WHERE s.id = ?
    `, [id]);
    return subjects[0];
};

export const getSubjectTree = async (subjectId: number) => {
    const [subjectRows]: any = await pool.query('SELECT * FROM subjects WHERE id = ?', [subjectId]);
    if (subjectRows.length === 0) return null;

    const subject = subjectRows[0];

    const [sections]: any = await pool.query(
        'SELECT * FROM sections WHERE subject_id = ? ORDER BY order_index ASC',
        [subjectId]
    );

    for (const section of sections) {
        const [videos]: any = await pool.query(
            'SELECT id, title, order_index FROM videos WHERE section_id = ? ORDER BY order_index ASC',
            [section.id]
        );
        section.videos = videos;
    }

    return {
        ...subject,
        sections
    };
};
