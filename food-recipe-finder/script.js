const searchInput = document.querySelector('#searchInput');
const resultsList = document.querySelector('#results');
const searchButton = document.querySelector("#searchButton");
const filterSelect = document.querySelector('#filterSelect');

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchRecipes();
});

async function searchRecipes() {
    const searchValue = searchInput.value.trim();
    const response = await fetch(`https://api.edamam.com/search?q=${searchValue}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
    const data = await response.json();
    displayRecipes(data.hits);
}

function displayRecipes(recipes) {
    let html = '';
    recipes.forEach((recipe) => {
        html += `
         <div >
            <img src="${recipe.recipe.image}" alt="${recipe.recipe.label}">
            <h3>${recipe.recipe.label}</h3>
            <ul>
                ${recipe.recipe.ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.recipe.url}" target="_blank">View Recipe</a>
        </div> 
        `;
    });z
    resultsList.innerHTML = html;
}
function filterRecipes(recipes, filterOption) {
    let filteredRecipes = recipes;
    switch (filterOption) {
        case 'vegetarian':
            filteredRecipes = recipes.filter(recipe => recipe.recipe.dietLabels.includes('VEGETARIAN'));
            break;
        case 'vegan':
            filteredRecipes = recipes.filter(recipe => recipe.recipe.dietLabels.includes('VEGAN'));
            break;
        case 'gluten-free':
            filteredRecipes = recipes.filter(recipe => recipe.recipe.dietLabels.includes('GLUTEN FREE'));
            break;
        // add more filter options as needed
        default:
            filteredRecipes = recipes;
    }
    displayRecipes(filteredRecipes);
}

// add event listener to filter select
filterSelect.addEventListener('change', (e) => {
    const filterOption = e.target.value;
    const recipes = JSON.parse(localStorage.getItem('recipes')); // store recipes in local storage
    filterRecipes(recipes, filterOption);
});

// store recipes in local storage
searchRecipes().then((recipes) => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
});
// function filterRecipes(recipes, filterOption) {
//     const filterOptions = {
//         'egetarian': 'VEGETARIAN',
//         'egan': 'VEGAN',
//         'gluten-free': 'GLUTEN FREE'
//     };
//     let filteredRecipes = recipes;
//     if (filterOptions[filterOption]) {
//         filteredRecipes = recipes.filter(recipe => recipe.recipe.dietLabels.includes(filterOptions[filterOption]));
//     }
//     displayRecipes(filteredRecipes);
// }

// function storeRecipesInLocalStorage(recipes) {
//     localStorage.setItem('recipes', JSON.stringify(recipes));
//     localStorage.setItem('recipesTimestamp', Date.now());
// }

// function getRecipesFromLocalStorage() {
//     const recipes = JSON.parse(localStorage.getItem('recipes'));
//     const timestamp = localStorage.getItem('recipesTimestamp');
//     if (timestamp && Date.now() - timestamp < 3600000) { // 1 hour expiration time
//         return recipes;
//     } else {
//         return null;
//     }
// }

// filterSelect.addEventListener('change', (e) => {
//     const filterOption = e.target.value;
//     const recipes = getRecipesFromLocalStorage();
//     if (recipes) {
//         filterRecipes(recipes, filterOption);
//     } else {
//         searchRecipes();
//     }
// });