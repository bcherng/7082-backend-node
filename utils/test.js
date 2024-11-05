// testWorkoutRoutine.js
const { generateRoutine } = require("./helpers");

async function testGenerateRoutine() {
    try {
        console.log("Testing with default requirements:");
        const defaultResponse = await generateRoutine();
        console.log("Default response:", defaultResponse);

        console.log("\nTesting with custom requirements:");
        const customRequirements = "Fitness Level: Advanced, Workout Goals: Fat Loss, Equipment: Gym, Time Commitment: 5 days a week, 45 minutes each.";
        const customResponse = await generateRoutine(customRequirements);
        console.log("Custom response:", customResponse);
    } catch (error) {
        console.error("Error during testing:", error);
    }
}

// Run the test function
testGenerateRoutine();
