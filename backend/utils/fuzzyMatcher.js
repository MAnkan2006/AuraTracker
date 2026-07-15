const levenshtein = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

const predefinedAbbreviations = {
    'dbms': 'Database Management Systems',
    'os': 'Operating Systems',
    'cn': 'Computer Networks',
    'ds': 'Data Structures',
    'oop': 'Object Oriented Programming',
    'coa': 'Computer Organization and Architecture',
    'se': 'Software Engineering',
    'dsa': 'Data Structures and Algorithms',
    'ai': 'Artificial Intelligence',
    'ml': 'Machine Learning',
    'web': 'Web Development'
};

const fuzzyMatch = (input, knownSubjects) => {
    if (!input) return null;
    const normalizedInput = input.trim().toLowerCase();

    // Check predefined exact abbreviations
    if (predefinedAbbreviations[normalizedInput]) {
        const matchedName = predefinedAbbreviations[normalizedInput];
        const found = knownSubjects.find(s => 
            s.name.toLowerCase() === matchedName.toLowerCase() || 
            (s.aliases && s.aliases.map(a => a.toLowerCase()).includes(matchedName.toLowerCase()))
        );
        if (found) return found;
        return { name: matchedName };
    }

    // Check exact name or aliases
    for (let subj of knownSubjects) {
        if (subj.name.toLowerCase() === normalizedInput) return subj;
        if (subj.aliases && subj.aliases.map(a => a.toLowerCase()).includes(normalizedInput)) return subj;
    }

    // Levenshtein nearest neighbor
    let bestMatch = null;
    let lowestDist = Infinity;
    
    for (let subj of knownSubjects) {
        const dist = levenshtein(normalizedInput, subj.name.toLowerCase());
        if (dist < lowestDist) {
            lowestDist = dist;
            bestMatch = subj;
        }
    }

    // Return match if within threshold
    if (lowestDist <= 3 && bestMatch) {
        return bestMatch;
    }

    return null; 
};

module.exports = { fuzzyMatch };
