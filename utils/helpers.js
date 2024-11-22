require("dotenv").config({ path: '../.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Function to generate workout routine
async function generateRoutine(userRequirements = "") {
    console.log("API Key:", process.env.GENAI_API); // To check if the API key is loaded
    const genAI = new GoogleGenerativeAI(process.env.GENAI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const baseRequirements = `
    Generate a weekly workout routine in the format of a JavaScript object, without markdown formatting. The output should be a clean, valid JSON response. 
    Do not wrap the response in any code blocks or markdown. The format should look like this:

    {
        "Monday": [["exercise 1", "rep per set", "sets", "expected time"]],
        "Tuesday": [["Rest", "N/A", "N/A", "N/A"]],
        ...
    }

    The response must be a valid JavaScript object. Do not add unnecessary text, and make sure there are no markdown code blocks or other formatting.

    Tailor the response to the following requirements if they exist, otherwise assume a beginner with the goal of getting fit.
`;


    try {
        const result = await model.generateContent(`${baseRequirements} ${userRequirements}`);
        return result;
    } catch (error) {
        console.error("Error in generateRoutine:", error);
        throw new Error("Failed to generate workout routine.");
    }
}

// Function to sanitize and extract workout data from response
function extractContent(response) {
    try {
        console.log(Object.values(response));
        const content = response.response.candidates[0].content.parts[0].text;
        console.log(response.response.candidates[0].content);
        const cleanedContent = content.replace(/```json|```/g, '').trim();
        console.log(Object.values(cleanedContent));
        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error("Error parsing workout data:", error);
        throw new Error("Failed to parse workout data.");
    }
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

// Testing the async function
// (async () => {
//     try {
//         const data = await formatWorkoutData("");
//         console.log("Formatted Workout Data:", data);
//     } catch (error) {
//         console.error("Error during workout data generation:", error);
//     }
// })();

module.exports = { formatWorkoutData };
