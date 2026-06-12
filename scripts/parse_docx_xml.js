const fs = require('fs');
const path = require('path');

const xmlPath = 'D:/smart-prep-mcqs/docx_extracted/word/document.xml';
const outputPath = 'D:/smart-prep-mcqs/docx_extracted/text_content.txt';

function parseDocxXml() {
  try {
    const xml = fs.readFileSync(xmlPath, 'utf8');
    
    // We want to extract text inside <w:t> tags.
    // Also, we want to know when a paragraph <w:p> starts/ends to add line breaks.
    // A simple regex approach:
    // Split by <w:p> to get paragraphs.
    const paragraphs = xml.split(/<w:p[ >]/);
    const parsedParagraphs = [];

    for (const p of paragraphs) {
      // Find all <w:t> contents in this paragraph
      const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (tMatches) {
        const pText = tMatches.map(t => {
          const content = t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '');
          // Decode XML entities if any (like &amp;, &lt;, &gt;)
          return content
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
        }).join('');
        
        if (pText.trim().length > 0) {
          parsedParagraphs.push(pText);
        }
      }
    }

    fs.writeFileSync(outputPath, parsedParagraphs.join('\n'), 'utf8');
    console.log(`Successfully parsed XML and wrote ${parsedParagraphs.length} paragraphs to ${outputPath}`);
  } catch (err) {
    console.error('Error parsing docx XML:', err);
  }
}

parseDocxXml();
