require("dotenv").config({path: '../.env'});
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Function to generate workout routine
async function generateRoutine(userRequirements = null) {
    console.log(process.env.GENAI_API);
    const genAI = new GoogleGenerativeAI(process.env.GENAI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const baseRequirements = `
        Generate a weekly workout routine in the format of 
        {
            "Monday": [["exercise 1", "rep per set", "sets", "expected time"]]
        }
        The output is to be parsed programmatically. Do not add unnecessary information. 
        Adhere to the strict format requirements. There may be more than 1 exercise per day.
        Response must be a JavaScript object. Fill days without exercise with [["Rest", "N/A", "N/A", "N/A"]].
        Tailor the response to the following requirements if they exist, otherwise assume a beginner with the goal of getting fit.
    `;

    const result = await model.generateContent(baseRequirements.concat("", userRequirements));
    return result;
}

// Function to sanitize and extract workout data from response
function extractContent(response) {
    console.log(response);
    const content = response.response.candidates[0].content.parts[0].text; // Return the raw response
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    console.log(cleanedContent);
    return JSON.parse(cleanedContent); // Parse the JSON response
}

// Validate the workout data structure
function validateResponse(data) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    if (typeof data !== "object") return false;

    for (let day of daysOfWeek) {
        if (!data[day] || !Array.isArray(data[day])) return false;

        for (let entry of data[day]) {
            if (!Array.isArray(entry) || entry.length !== 4) return false;
            if (typeof entry[0] !== "string" || !entry.slice(1).every(x => typeof x === "string" || typeof x === "number")) return false;
        }
    }

    return true;
}

// Function to format the workout data into an array for each day of the week
async function formatWorkoutData(userRequirements) {
    const rawResponse = await generateRoutine(userRequirements);
    const workoutData = extractContent(rawResponse);

    if (!validateResponse(workoutData)) {
        throw new Error("Generated workout data is invalid.");
    }
    return workoutData;
}

console.log(formatWorkoutData(""));

module.exports = { formatWorkoutData };
