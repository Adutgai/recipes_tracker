import React, { useState, useEffect } from 'react';
import { getCategories, getRecipesByCategory, addCategory, addRecipe } from '../services/categoryService';
import './RecipeCategoryManager.css';
import AddCategoryForm from './AddCategoryForm';
import AddRecipeForm from './AddRecipeForm';

const RecipeCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [recipeForm, setRecipeForm] = useState({ title: '', ingredients: '', steps: '', categoryId: '' });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
      res.data.forEach(cat => fetchRecipes(cat._id));
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchRecipes = async (categoryId) => {
    try {
      const res = await getRecipesByCategory(categoryId);
      setRecipesMap(prev => ({ ...prev, [categoryId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch recipes for category', categoryId, err);
    }
  };

  const handleAddCategory = async () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return alert('Category name cannot be empty');
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      return alert('Category already exists');
    }

    try {
      const res = await addCategory(trimmed);
      setCategories([...categories, res.data]);
      setCategoryName('');
      setShowAddCategoryForm(false);
      fetchRecipes(res.data._id);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddRecipe = async () => {
    const { title, ingredients, steps, categoryId } = recipeForm;
    if (!title.trim()) return alert('Recipe title required');
    if (!categoryId) return alert('Select a category for the recipe');

    try {
      const newRecipe = {
        title: title.trim(),
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split(',').map(s => s.trim()),
        categoryId,
      };

      await addRecipe(newRecipe);
      setRecipeForm({ title: '', ingredients: '', steps: '', categoryId: '' });
      setAddingRecipe(false);
      fetchRecipes(categoryId);
    } catch (err) {
      console.error('Error adding recipe:', err);
    }
  };

  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  return (
    <div className="container">
      <h2 className="title">Category & Recipe Manager</h2>

      <div className="buttonGroup">
        <button
          onClick={() => {
            setShowAddCategoryForm(!showAddCategoryForm);
            setCategoryName('');
            setAddingRecipe(false);
          }}
          className="button"
        >
          {showAddCategoryForm ? 'Cancel Add Category' : 'Add Category'}
        </button>

        <button
          onClick={() => {
            if (!categories.length) return alert('Add a category first!');
            setAddingRecipe(!addingRecipe);
            setRecipeForm({ title: '', ingredients: '', steps: '', categoryId: '' });
            setShowAddCategoryForm(false);
          }}
          className="button"
        >
          {addingRecipe ? 'Cancel Add Recipe' : 'Add Recipe'}
        </button>
      </div>

      {showAddCategoryForm && (
        <AddCategoryForm
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          onSubmit={handleAddCategory}
        />
      )}

      {addingRecipe && (
        <AddRecipeForm
          recipeForm={recipeForm}
          setRecipeForm={setRecipeForm}
          categories={categories}
          onSubmit={handleAddRecipe}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          justifyContent: 'center',
          maxHeight: 500,
          overflowY: 'auto',
        }}
      >
        {categories.map((cat) => (
          <div key={cat._id} className="categoryCard">
            <h3 className="categoryTitle">{cat.name}</h3>
            <ul className="recipeList">
              {recipesMap[cat._id] && recipesMap[cat._id].length > 0 ? (
                recipesMap[cat._id].map((recipe) => (
                  <li key={recipe._id} className="recipeItem">
                    <span>{recipe.title}</span>
                    <button
                      onClick={() => handleViewDetails(recipe)}
                      className="recipeButton"
                    >
                      View Details
                    </button>
                  </li>
                ))
              ) : (
                <li className="noRecipes">No recipes yet</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="modalOverlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>{selectedRecipe.title}</h2>

            <section>
              <h4>Ingredients</h4>
              <ul>
                {selectedRecipe.ingredients.map((i, idx) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </section>

            <section>
              <h4>Steps</h4>
              <ol>
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </section>

            <button onClick={() => setSelectedRecipe(null)} className="closeButton">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCategoryManager;
