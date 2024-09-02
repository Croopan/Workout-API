import axios from 'axios'

// Define the category IDs
const categoryIds = [8, 10];

// Function to fetch exercises for a specific category using Axios with query parameters
function fetchExercisesByCategory(categoryId) {
  const url = 'https://wger.de/api/v2/exercise/';
  return axios.get(url, {
    params: {
      category: categoryId,
      muscles: 10,
      equipment: 7,
      id: 2042,
      // Add additional parameters here if needed, e.g., language or status
      language: 2, // Example: language ID 2 (English)
    }
  })
  .then(response => response.data) // Get the data from the response
  .catch(error => {
    console.error(`Error fetching category ${categoryId}:`, error);
    return null; // Handle the error and return null
  });
}

// Fetch exercises for all categories and combine the results
Promise.all(categoryIds.map(fetchExercisesByCategory))
  .then(results => {
    // Combine all results into one array, filtering out any null responses
    const allExercises = results
      .filter(result => result !== null)
      .flatMap(result => result.results);
    console.log(allExercises);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
