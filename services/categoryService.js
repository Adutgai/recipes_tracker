import axios from 'axios';


const CATEGORY_URL = "http://localhost:5000/categories";
const RECIPE_URL = "http://localhost:5000/recipes";

export const getCategories = () => axios.get(CATEGORY_URL);
export const addCategory = (categoryName) => axios.post(CATEGORY_URL, { name: categoryName });

export const addRecipe = (recipe) => axios.post(RECIPE_URL, recipe);
export const getRecipesByCategory = (categoryId) => axios.get(`${RECIPE_URL}/${categoryId}`);
