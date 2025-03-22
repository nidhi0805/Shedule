import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import './categories.css';
const categories = [
  {
    title: "Self Care",
    options: ["Skincare routine", "Reading book", "Journaling", "Taking a bath", "Digital detox"]
  },
  {
    title: "Physical Health",
    options: ["Morning walk", "Home workout", "Yoga", "Dance class", "Strength training"]
  },
  {
    title: "Mental Wellness",
    options: ["Meditation", "Gratitude journaling", "Breathing exercises", "Therapy session", "Guided visualization"]
  },
  {
    title: "Productivity & Growth",
    options: ["Learning a new skill", "Weekly reflection", "Listening to podcasts", "Declutter workspace", "Personal finance check-in"]
  }
];

export default function Categories() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const maxSelection = 4;
  const isMaxReached = selectedOptions.length >= maxSelection;
  const navigate = useNavigate(); 

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      if (!isMaxReached) {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };

  const handleSubmit = () => {
    toast.success("Your response has been saved!");
    setTimeout(() => {
      navigate('/Calendar');
    }, 2000);
  };

  return (
    <div className="categories-container">
      <h1 className="categories-header">Categories</h1>
      <p className="categories-subheader">Select up to 4 from the below options</p>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.title} className="category-card">
            <h2 className="category-title">{category.title}</h2>
            <div className="option-container">
              {category.options.map((option) => (
                <button
                  key={option}
                  className={`option-button ${selectedOptions.includes(option) ? 'selected' : ''} ${isMaxReached && !selectedOptions.includes(option) ? 'disabled' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={isMaxReached && !selectedOptions.includes(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="submit-button"
      >
        Submit
      </button>
      <ToastContainer />
    </div>
  );
}
