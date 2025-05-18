import React from 'react';
import './RecipeCategoryManager.css';

const AddCategoryForm = ({ categoryName, setCategoryName, onSubmit }) => {
  return (
    <div className="formContainer">
      <h3>Add Category</h3>
      <input
        type="text"
        placeholder="Category name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        className="input"
      />
      <button onClick={onSubmit} className="button">
        Submit Category
      </button>
    </div>
  );
};

export default AddCategoryForm;
