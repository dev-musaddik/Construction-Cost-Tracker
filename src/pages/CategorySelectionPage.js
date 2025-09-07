import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const CategorySelectionPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

        const response = await axios.get("http://localhost:5000/api/categories", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    navigate(`/contract-expenses/${categoryId}`);
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Select a Category</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200 cursor-pointer"
            onClick={() => handleCategorySelect(category._id)}
          >
            <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelectionPage;
