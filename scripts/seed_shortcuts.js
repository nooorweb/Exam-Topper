const { Client } = require('pg');

const connectionString = 'postgresql://postgres:re4fn2FY0RZHXdCR@db.mirehrrlyedurrnrwvjn.supabase.co:5432/postgres';

const notes = [
  {
    id: 'cs-note-shortcut-word',
    subject: 'Computer Science',
    title: 'MS Word Shortcut Keys (Advanced)',
    overview: 'Advanced function keys, Ctrl+Shift, Alt+Shift, and Ctrl+Alt combinations for Microsoft Word.',
    content: 'This guide covers advanced Microsoft Word keyboard shortcuts frequently tested in ETEA, KPPSC, and clerical exams. Memorize the function key assignments (F1-F12), character formatting triggers (Ctrl+Shift+A for All Caps, Ctrl+Shift+D for Double Underline), and outline navigation keys (Alt+Shift+Arrows).',
    key_points: JSON.stringify([
      'F2 moves selected text: select text, press F2, move cursor to destination, and press Enter.',
      'Shift+F3 toggles text case between lowercase, UPPERCASE, and Title Case.',
      'Ctrl+Shift+K toggles Small Caps formatting on the selected text.',
      'Ctrl+Shift+W underlines words only, excluding spaces. Ctrl+Shift+D applies a double underline.',
      'Ctrl+Alt+1, Ctrl+Alt+2, and Ctrl+Alt+3 apply Heading 1, 2, and 3 styles respectively.',
      'Ctrl+Alt+F inserts a footnote, while Ctrl+Alt+D inserts an endnote.'
    ]),
    formulas: null,
    tables_data: JSON.stringify([
      {
        headers: ['Shortcut', 'Action', 'Function'],
        rows: [
          ['F2', 'Move text', 'Move selected text without copy-paste'],
          ['Shift+F3', 'Toggle Case', 'Toggle lowercase -> UPPERCASE -> Title Case'],
          ['Shift+F5', 'Resume Edit', 'Move cursor to last 3 edit locations'],
          ['Ctrl+Shift+C', 'Copy Format', 'Copy formatting only (Format Painter)'],
          ['Ctrl+Shift+V', 'Paste Format', 'Paste copied formatting'],
          ['Ctrl+Shift+W', 'Underline Words', 'Underline words only, not spaces'],
          ['Ctrl+Shift+D', 'Double Underline', 'Apply double underline to selection'],
          ['Ctrl+Alt+F', 'Insert Footnote', 'Inserts footnote at cursor location'],
          ['Ctrl+Alt+D', 'Insert Endnote', 'Inserts endnote at document end'],
          ['Alt+Shift+D', 'Insert Date', 'Inserts current date field']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['FIA', 'Computer Operator', 'Junior Clerk', 'ETEA', 'KPPSC', 'FPSC']),
    importance: 'critical',
    estimated_read_time: 8,
    is_public: true
  },
  {
    id: 'cs-note-shortcut-excel',
    subject: 'Computer Science',
    title: 'MS Excel Shortcut Keys (Advanced)',
    overview: 'Advanced worksheet, formatting, array formulas, and cell selection shortcuts in Microsoft Excel.',
    content: 'This guide covers advanced Microsoft Excel shortcuts. Pay special attention to number formatting modifiers (Ctrl+Shift+~ for General, Ctrl+Shift+$ for Currency), cell editing triggers (F2), and outline/grouping tools (Alt+Shift+Arrows).',
    key_points: JSON.stringify([
      'F2 puts the active cell in edit mode with the cursor placed at the end of the cell contents.',
      'F4 toggles between absolute ($A$1) and relative (A1) references in a formula.',
      'Shift+F11 inserts a new worksheet into the current workbook. Shift+F12 saves the workbook.',
      'Ctrl+Shift+; inserts the current date. Ctrl+Shift+: inserts the current time.',
      'Ctrl+9 hides selected rows. Ctrl+0 hides selected columns.',
      'Alt+= auto-inserts the SUM formula for the adjacent data range.',
      'Ctrl+Shift+Enter enters a formula as an Array Formula (enclosed in curly braces {}).'
    ]),
    formulas: null,
    tables_data: JSON.stringify([
      {
        headers: ['Shortcut', 'Action', 'Function'],
        rows: [
          ['F2', 'Edit Cell', 'Edit active cell with cursor at the end'],
          ['F4', 'Toggle Reference', 'Toggle absolute/relative cell references'],
          ['Shift+F11', 'Insert Sheet', 'Insert a new worksheet'],
          ['Ctrl+Shift+;', 'Insert Date', 'Inserts current date in active cell'],
          ['Ctrl+Shift+:', 'Insert Time', 'Inserts current time in active cell'],
          ['Ctrl+9', 'Hide Rows', 'Hides selected rows in worksheet'],
          ['Ctrl+0', 'Hide Columns', 'Hides selected columns in worksheet'],
          ['Alt+=', 'AutoSum', 'Automatically insert SUM formula'],
          ['Ctrl+Shift+Enter', 'Array Formula', 'Enters formula as array formula { }'],
          ['Ctrl+Shift+*', 'Select Region', 'Selects data island surrounding active cell']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['FIA', 'Computer Operator', 'Junior Clerk', 'ETEA', 'KPPSC', 'FPSC']),
    importance: 'critical',
    estimated_read_time: 8,
    is_public: true
  },
  {
    id: 'cs-note-shortcut-ppt',
    subject: 'Computer Science',
    title: 'MS PowerPoint Shortcut Keys (Advanced)',
    overview: 'Presentation creation, slide management, and slide show control shortcuts for PowerPoint.',
    content: 'This guide covers essential PowerPoint shortcuts used during design and presentation phases. Memorize the difference between starting from beginning (F5) vs current slide (Shift+F5), and slide manipulation (Ctrl+M to insert new slide, Ctrl+D to duplicate).',
    key_points: JSON.stringify([
      'F5 starts the slide show from the very first slide.',
      'Shift+F5 starts the slide show from the currently selected slide.',
      'Ctrl+M inserts a brand new blank slide. Ctrl+N opens a new presentation.',
      'Ctrl+Shift+D duplicates the currently selected active slide.',
      'Escape ends the running slide show presentation.',
      'Alt+Shift+Left/Right promotes or demotes items in the outline view.'
    ]),
    formulas: null,
    tables_data: JSON.stringify([
      {
        headers: ['Shortcut', 'Action', 'Function'],
        rows: [
          ['F5', 'Start Presentation', 'Start slide show from the first slide'],
          ['Shift+F5', 'Start from Current', 'Start slide show from active slide'],
          ['Ctrl+M', 'New Slide', 'Insert a new slide in presentation'],
          ['Ctrl+N', 'New Presentation', 'Create a new blank presentation file'],
          ['Ctrl+Shift+D', 'Duplicate Slide', 'Duplicate the active slide'],
          ['Escape', 'End Slide Show', 'Exit active slide show presentation'],
          ['Alt+Shift+Left', 'Promote Bullet', 'Promote bullet point in outline view'],
          ['Alt+Shift+Right', 'Demote Bullet', 'Demote bullet point in outline view'],
          ['Ctrl+P', 'Pen Tool', 'Change cursor to drawing pen during show'],
          ['Ctrl+A', 'Arrow Tool', 'Change cursor back to arrow during show']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['FIA', 'Computer Operator', 'Junior Clerk', 'ETEA', 'KPPSC', 'FPSC']),
    importance: 'critical',
    estimated_read_time: 7,
    is_public: true
  }
];

const mcqs = [
  // Word (cs-note-shortcut-word)
  {
    id: 'snw-q1',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'Which function key is used to open the Save As dialog box in Microsoft Word?',
    options: JSON.stringify(['F1', 'F5', 'F7', 'F12']),
    correct_answer: 3,
    explanation: 'F12 opens the Save As dialog box. F1 opens Help, F5 opens Find & Replace (Go To tab), and F7 runs Spelling & Grammar check.',
    category: 'Computer Science',
    sort_order: 1,
    is_public: true
  },
  {
    id: 'snw-q2',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'In MS Word, which shortcut key is used to copy formatting only from selected text?',
    options: JSON.stringify(['Ctrl + C', 'Ctrl + Shift + C', 'Ctrl + Alt + C', 'Alt + Shift + C']),
    correct_answer: 1,
    explanation: 'Ctrl + Shift + C copies formatting only (equivalent to Format Painter). Ctrl + Shift + V pastes the copied formatting.',
    category: 'Computer Science',
    sort_order: 2,
    is_public: true
  },
  {
    id: 'snw-q3',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'Which keyboard shortcut toggles case changing in Microsoft Word (lowercase, UPPERCASE, Title Case)?',
    options: JSON.stringify(['Ctrl + F3', 'Shift + F3', 'Alt + F3', 'Ctrl + Shift + C']),
    correct_answer: 1,
    explanation: 'Shift + F3 toggles case changing between lowercase, UPPERCASE, and Title Case for the selected text.',
    category: 'Computer Science',
    sort_order: 3,
    is_public: true
  },
  {
    id: 'snw-q4',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'Which key combination is used to apply double underline formatting to selected text in MS Word?',
    options: JSON.stringify(['Ctrl + D', 'Ctrl + Shift + D', 'Ctrl + Alt + D', 'Alt + Shift + D']),
    correct_answer: 1,
    explanation: 'Ctrl + Shift + D applies double underline to selected text. Ctrl + Shift + W underlines words only (excluding spaces).',
    category: 'Computer Science',
    sort_order: 4,
    is_public: true
  },
  {
    id: 'snw-q5',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'In Microsoft Word, what does the shortcut Ctrl + Alt + F insert at the cursor position?',
    options: JSON.stringify(['Endnote', 'Footnote', 'Field Code', 'Formatting Marks']),
    correct_answer: 1,
    explanation: 'Ctrl + Alt + F inserts a footnote at the cursor position. Ctrl + Alt + D inserts an endnote at the end of the document.',
    category: 'Computer Science',
    sort_order: 5,
    is_public: true
  },
  {
    id: 'snw-q6',
    note_topic_id: 'cs-note-shortcut-word',
    question: 'Which shortcut key is used to collapse or expand the Ribbon in Microsoft Word?',
    options: JSON.stringify(['Ctrl + F1', 'Ctrl + Shift + R', 'Alt + F1', 'Ctrl + R']),
    correct_answer: 0,
    explanation: 'Ctrl + F1 collapses or expands the Ribbon. Alt + F1 is used to go to the next field.',
    category: 'Computer Science',
    sort_order: 6,
    is_public: true
  },

  // Excel (cs-note-shortcut-excel)
  {
    id: 'sne-q1',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'Which function key is used to edit the contents of the active cell in Microsoft Excel?',
    options: JSON.stringify(['F1', 'F2', 'F4', 'F9']),
    correct_answer: 1,
    explanation: 'F2 is the keyboard shortcut to edit the active cell, placing the blinking cursor at the end of the cell contents.',
    category: 'Computer Science',
    sort_order: 1,
    is_public: true
  },
  {
    id: 'sne-q2',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'In MS Excel, which shortcut toggles a cell reference between absolute ($A$1) and relative (A1) in a formula?',
    options: JSON.stringify(['F2', 'F4', 'F5', 'F11']),
    correct_answer: 1,
    explanation: 'F4 toggles absolute/relative reference modes for cell coordinates highlighted in the formula bar.',
    category: 'Computer Science',
    sort_order: 2,
    is_public: true
  },
  {
    id: 'sne-q3',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'Which shortcut combination inserts a new worksheet tab in the active Excel workbook?',
    options: JSON.stringify(['Ctrl + N', 'Shift + F11', 'Alt + Shift + W', 'Ctrl + Shift + N']),
    correct_answer: 1,
    explanation: 'Shift + F11 inserts a new worksheet. Ctrl + N opens a brand new workbook window.',
    category: 'Computer Science',
    sort_order: 3,
    is_public: true
  },
  {
    id: 'sne-q4',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'In Microsoft Excel, what is the shortcut to hide the currently selected columns?',
    options: JSON.stringify(['Ctrl + 9', 'Ctrl + 0', 'Ctrl + H', 'Ctrl + Shift + C']),
    correct_answer: 1,
    explanation: 'Ctrl + 0 hides selected columns. Ctrl + 9 hides selected rows.',
    category: 'Computer Science',
    sort_order: 4,
    is_public: true
  },
  {
    id: 'sne-q5',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'Which key combination is used to enter a formula as an Array Formula in Microsoft Excel?',
    options: JSON.stringify(['Ctrl + Enter', 'Ctrl + Alt + Enter', 'Ctrl + Shift + Enter', 'Alt + Shift + Enter']),
    correct_answer: 2,
    explanation: 'Ctrl + Shift + Enter wraps the formula in curly braces { } and evaluates it as an Array Formula.',
    category: 'Computer Science',
    sort_order: 5,
    is_public: true
  },
  {
    id: 'sne-q6',
    note_topic_id: 'cs-note-shortcut-excel',
    question: 'What does the keyboard shortcut Alt + = do in Microsoft Excel?',
    options: JSON.stringify(['Insert average formula', 'Auto-insert SUM formula', 'Insert current date', 'Calculate active sheet']),
    correct_answer: 1,
    explanation: 'Alt + = is the AutoSum shortcut, which automatically generates a SUM function for adjacent cells.',
    category: 'Computer Science',
    sort_order: 6,
    is_public: true
  },

  // PowerPoint (cs-note-shortcut-ppt)
  {
    id: 'snp-q1',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'Which function key starts the PowerPoint slide show from the very beginning?',
    options: JSON.stringify(['F5', 'Shift + F5', 'Alt + F5', 'Ctrl + F5']),
    correct_answer: 0,
    explanation: 'F5 starts the presentation from the first slide. Shift + F5 starts the show from the currently selected slide.',
    category: 'Computer Science',
    sort_order: 1,
    is_public: true
  },
  {
    id: 'snp-q2',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'In Microsoft PowerPoint, what is the shortcut to start the slide show from the CURRENT slide?',
    options: JSON.stringify(['F5', 'Shift + F5', 'Alt + F5', 'Ctrl + F5']),
    correct_answer: 1,
    explanation: 'Shift + F5 starts the slide show starting from the active slide rather than slide 1.',
    category: 'Computer Science',
    sort_order: 2,
    is_public: true
  },
  {
    id: 'snp-q3',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'Which shortcut key is used to insert a brand new, blank slide into the active presentation?',
    options: JSON.stringify(['Ctrl + N', 'Ctrl + M', 'Ctrl + S', 'Ctrl + Shift + N']),
    correct_answer: 1,
    explanation: 'Ctrl + M inserts a new slide. Ctrl + N opens a new, blank presentation file.',
    category: 'Computer Science',
    sort_order: 3,
    is_public: true
  },
  {
    id: 'snp-q4',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'In Microsoft PowerPoint, which key combination duplicates the currently active slide?',
    options: JSON.stringify(['Ctrl + D', 'Ctrl + Shift + D', 'Ctrl + Alt + D', 'Alt + Shift + D']),
    correct_answer: 1,
    explanation: 'Ctrl + Shift + D duplicates the selected slide in PowerPoint.',
    category: 'Computer Science',
    sort_order: 4,
    is_public: true
  },
  {
    id: 'snp-q5',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'Which key on the keyboard is pressed to immediately end a running PowerPoint slide show?',
    options: JSON.stringify(['Backspace', 'Escape', 'Ctrl + Q', 'Delete']),
    correct_answer: 1,
    explanation: 'Escape (Esc) immediately exits the running slide show and returns to the normal presentation editor.',
    category: 'Computer Science',
    sort_order: 5,
    is_public: true
  },
  {
    id: 'snp-q6',
    note_topic_id: 'cs-note-shortcut-ppt',
    question: 'During a PowerPoint slide show, which shortcut changes the mouse cursor to a drawing pen tool?',
    options: JSON.stringify(['Ctrl + P', 'Ctrl + A', 'Ctrl + H', 'Ctrl + E']),
    correct_answer: 0,
    explanation: 'Ctrl + P changes the cursor to a pen for annotations. Ctrl + A changes it back to the selection arrow.',
    category: 'Computer Science',
    sort_order: 6,
    is_public: true
  }
];

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database to seed advanced shortcuts note topics and MCQs.');

    // 1. Seed note topics
    for (const note of notes) {
      console.log(`Seeding note topic: ${note.title}...`);
      await client.query(`
        INSERT INTO public.note_topics 
          (id, subject, title, overview, content, key_points, formulas, tables_data, exam_targets, importance, estimated_read_time, is_public)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          subject = EXCLUDED.subject,
          title = EXCLUDED.title,
          overview = EXCLUDED.overview,
          content = EXCLUDED.content,
          key_points = EXCLUDED.key_points,
          formulas = EXCLUDED.formulas,
          tables_data = EXCLUDED.tables_data,
          exam_targets = EXCLUDED.exam_targets,
          importance = EXCLUDED.importance,
          estimated_read_time = EXCLUDED.estimated_read_time,
          is_public = EXCLUDED.is_public;
      `, [
        note.id, note.subject, note.title, note.overview, note.content,
        note.key_points, note.formulas, note.tables_data, note.exam_targets,
        note.importance, note.estimated_read_time, note.is_public
      ]);
    }
    console.log('Seeded all note topics.');

    // 2. Seed MCQs
    for (const mcq of mcqs) {
      console.log(`Seeding note MCQ: ${mcq.question.substring(0, 40)}...`);
      await client.query(`
        INSERT INTO public.note_topic_mcqs
          (id, note_topic_id, question, options, correct_answer, explanation, category, sort_order, is_public)
        VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          note_topic_id = EXCLUDED.note_topic_id,
          question = EXCLUDED.question,
          options = EXCLUDED.options,
          correct_answer = EXCLUDED.correct_answer,
          explanation = EXCLUDED.explanation,
          category = EXCLUDED.category,
          sort_order = EXCLUDED.sort_order,
          is_public = EXCLUDED.is_public;
      `, [
        mcq.id, mcq.note_topic_id, mcq.question, mcq.options,
        mcq.correct_answer, mcq.explanation, mcq.category,
        mcq.sort_order, mcq.is_public
      ]);
    }
    console.log('Seeded all note MCQs successfully.');

  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
  }
}

main();
