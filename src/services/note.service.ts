import { supabase } from '../lib/supabase';
import { NoteTopic } from '../data/notesData';

export const NoteService = {
  /** Fetch all public note topics from Supabase */
  fetchNoteTopics: async (): Promise<NoteTopic[]> => {
    try {
      const { data, error } = await supabase
        .from('note_topics')
        .select('id, subject, title, overview, content, key_points, formulas, tables_data, importance, estimated_read_time, exam_targets')
        .eq('is_public', true);

      if (error) throw error;

      if (data) {
        return data.map((row) => ({
          id: row.id,
          subject: row.subject as any,
          title: row.title,
          overview: row.overview ?? '',
          content: row.content ?? '',
          keyPoints: Array.isArray(row.key_points)
            ? row.key_points
            : (typeof row.key_points === 'string' ? JSON.parse(row.key_points) : []),
          formulas: row.formulas
            ? (Array.isArray(row.formulas) ? row.formulas : JSON.parse(row.formulas))
            : undefined,
          tables: row.tables_data
            ? (Array.isArray(row.tables_data) ? row.tables_data : JSON.parse(row.tables_data))
            : undefined,
          importance: (row.importance as any) || 'medium',
          estimatedReadTime: row.estimated_read_time ?? 5,
          examTargets: row.exam_targets
            ? (Array.isArray(row.exam_targets) ? row.exam_targets : JSON.parse(row.exam_targets))
            : undefined,
        }));
      }
    } catch (err) {
      console.warn('NoteService: Failed to fetch note topics from database', err);
    }
    return [];
  },
};
