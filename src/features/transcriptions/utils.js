/**
 * Cleans the raw transcription content by removing strange characters
 * and normalizing whitespace/line breaks.
 */
export function cleanTranscriptContent(rawText) {
    if (!rawText) return '';
    
    return rawText
        // Remove strange characters/control characters often found in raw outputs
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
        // Remove the specific zero-width/space characters user mentioned
        .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, "")
        // Handle repeated newline blocks (keep meaningful breaks but don't overdo it)
        .replace(/\n{3,}/g, '\n\n')
        // Trim each line
        .split('\n').map(line => line.trimEnd()).join('\n')
        .trim();
}

/**
 * Parses the transcription content into logical sections.
 */
export function parseTranscriptSections(rawText) {
    const cleaned = cleanTranscriptContent(rawText);
    
    const sections = {
        summary: '',
        notes: '',
        detailedNotes: '',
        nextSteps: '',
        fullTranscript: cleaned // Default to full text if no sections are found
    };

    // Define regex markers for splitting
    const markers = [
        { key: 'notes', regex: /=== NOTES ===|Notes\b/i },
        { key: 'fullTranscript', regex: /=== TRANSCRIPTION ===|Transcription\b/i },
        { key: 'summary', regex: /Résumé\b|Summary\b/i },
        { key: 'detailedNotes', regex: /Détails\b|Detailed Notes\b/i },
        { key: 'nextSteps', regex: /Étapes suivantes suggérées\b|Next Steps\b/i }
    ];

    // Find all occurrences of markers with their positions
    let findings = [];
    markers.forEach(m => {
        const match = cleaned.match(m.regex);
        if (match) {
            findings.push({
                key: m.key,
                index: match.index,
                length: match[0].length
            });
        }
    });

    // Sort findings by position
    findings.sort((a, b) => a.index - b.index);

    if (findings.length === 0) {
        return sections;
    }

    // Split content based on findings
    for (let i = 0; i < findings.length; i++) {
        const current = findings[i];
        const next = findings[i+1];
        
        const start = current.index + current.length;
        const end = next ? next.index : cleaned.length;
        
        sections[current.key] = cleaned.substring(start, end).trim();
    }

    return sections;
}

/**
 * Formats the raw transcript into structured blocks with speaker names and timestamps.
 */
export function formatTranscriptBlocks(rawTranscript) {
    if (!rawTranscript) return [];

    const lines = rawTranscript.split('\n');
    const blocks = [];
    
    // Regex for: [00:00:00] Speaker Name: Message OR Speaker Name: Message
    // Adjusted to handle optional timestamps
    const blockRegex = /^(\[?\d{1,2}:\d{2}(?::\d{2})?\]?)?\s*([^:\n\d]+)?:\s*(.*)/;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const match = trimmed.match(blockRegex);
        if (match) {
            blocks.push({
                timestamp: match[1] ? match[1].replace(/[\[\]]/g, '') : null,
                speaker: match[2] ? match[2].trim() : 'Unknown',
                text: match[3].trim()
            });
        } else if (blocks.length > 0) {
            // Append line to the previous block if it doesn't match a new speaker pattern
            blocks[blocks.length - 1].text += '\n' + trimmed;
        } else {
            // Initial line doesn't match a speaker, treat as intro/meta
            blocks.push({
                timestamp: null,
                speaker: null,
                text: trimmed
            });
        }
    });

    return blocks;
}
