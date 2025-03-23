import React, { useState, useEffect } from "react";
import { useNavigate ,useParams} from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import wellnessLogo from '../images/wellness.png';  
import physicalLogo from '../images/physical.png';  
import selfcare from '../images/selfcare.png'; 
import growth from '../images/growth.png'; 
import './categories.css';


const categories = [
  {
    title: "Self Care",
    options: ["Skincare routine", "Reading book", "Journaling", "Taking a bath", "Digital detox", "Sauna"]
  },
  {
    title: "Physical Health",
    options: ["Morning walk", "HIIT", "Yoga", "Dance class", "Strength training", "SoulCycle"]
  },
  {
    title: "Mental Wellness",
    options: ["Meditation", "Gratitude journaling", "Breathing exercises", "Therapy session", "Guided visualization","Explore Cafes"]
  },
  {
    title: "Productivity & Growth",
    options: ["Learning a new skill", "Weekly reflection", "Listening to podcasts", "Declutter workspace", "Personal finance check-in","Leetcode"]
  }
];

export default function Categories() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const maxSelection = 4;
  const isMaxReached = selectedOptions.length >= maxSelection;
  const navigate = useNavigate(); 
  const { year, month, day } = useParams();
  console.log("year",year);
  const [userEmail, setUserEmail] = useState(null);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      if (!isMaxReached) {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  const handleSubmit = async () => {
    // if (selectedOptions.length === 0) {
    //   toast.error("Please select at least one option.");
    //   return;
    // }

    const requestData = {
      email: userEmail,
      date: formattedDate,
      tasks: selectedOptions,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/schedule-activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        toast.success("Your response has been saved!");
        setTimeout(() => {
          navigate('/Calendar');
        }, 2000);
      } else {
        toast.error("Failed to submit activities.");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while submitting your activities.");
    }
  };
  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    setUserEmail(storedEmail);
    });
  return (
    <div className="categories-container">
      <h1 className="categories-header">Categories</h1>
      <p className="categories-subheader"> <em>Explore activities to enhance balance in your day</em></p>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.title}
            className="category-card"
            style={
              category.title === "Mental Wellness"
                ? { backgroundImage: `url(${wellnessLogo})` }
                : category.title === "Physical Health"
                ? { backgroundImage: `url(${physicalLogo})` }
                : category.title === "Self Care" ? { backgroundImage: `url(${selfcare})` }
                : category.title === "Productivity & Growth" ? { backgroundImage: `url(${growth})` } :{}
            }
          >
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
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
      <ToastContainer />
    </div>
  );
}
