import React from 'react';
import './RecipeCategoryManager.css';

const AddRecipeForm = ({ recipeForm, setRecipeForm, categories, onSubmit }) => {
  return (
    <div className="formContainerRecipe">
      <h3>Add Recipe</h3>
      <select
        value={recipeForm.categoryId}
        onChange={(e) => setRecipeForm({ ...recipeForm, categoryId: e.target.value })}
        className="select"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Recipe title"
        value={recipeForm.title}
        onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="Ingredients (comma separated)"
        value={recipeForm.ingredients}
        onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
        className="input"
      />
      <input
        type="text"
        placeholder="Steps (comma separated)"
        value={recipeForm.steps}
        onChange={(e) => setRecipeForm({ ...recipeForm, steps: e.target.value })}
        className="input"
      />
      <button onClick={onSubmit} className="button">
        Submit Recipe
      </button>
    </div>
  );
};

export default AddRecipeForm;
