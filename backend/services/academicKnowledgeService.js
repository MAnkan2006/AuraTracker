const AcademicKnowledge = require('../models/AcademicKnowledge');
const syllabusService = require('./syllabusService');

const checkCache = async (college, department, semester) => {
    return await AcademicKnowledge.findOne({ college, department, semester });
};

const saveKnowledge = async (college, department, semester, data) => {
    const knowledge = await AcademicKnowledge.findOneAndUpdate(
        { college, department, semester },
        {
            subjects: data.subjects,
            syllabus: data.syllabus,
            source: data.source,
            confidence: data.confidence,
            lastUpdated: new Date()
        },
        { upsert: true, new: true }
    );
    return knowledge;
};

const getOrFetch = async (college, department, semester, university = '') => {
    let knowledge = await checkCache(college, department, semester);
    
    if (knowledge) {
        console.log("[AcademicKnowledge] Cache hit");
        return knowledge;
    }
    
    console.log("[AcademicKnowledge] Cache miss, fetching syllabus");
    const syllabusData = await syllabusService.fetchSyllabus(college, department, semester, university);
    
    knowledge = await saveKnowledge(college, department, semester, syllabusData);
    return knowledge;
};

module.exports = { checkCache, saveKnowledge, getOrFetch };
