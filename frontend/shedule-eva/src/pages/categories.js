import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

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
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>Categories</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>Select up to 4 from the below options</p>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "nowrap" }}>
        {categories.map((category) => (
          <div key={category.title} style={{ 
            border: "2px solid #ddd", 
            padding: "20px", 
            borderRadius: "12px", 
            flex: 1, 
            minWidth: 0, 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            backgroundColor: "#fff",
            cursor: "pointer",
            transform: "translateY(-3px)"
          }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#444" }}>{category.title}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", width: "100%" }}>
              {category.options.map((option) => (
                <button
                  key={option}
                  style={{
                    padding: "10px", 
                    width: "90%", 
                    height: "40px", 
                    borderRadius: "15px",
                    border: "2px solid",
                    fontSize: "14px",
                    cursor: isMaxReached && !selectedOptions.includes(option) ? "not-allowed" : "pointer",
                    backgroundColor: selectedOptions.includes(option) ? "#7D5BA6" : isMaxReached ? "#e0e0e0" : "#fff",
                    color: selectedOptions.includes(option) ? "#fff" : "#000", 
                    borderColor: selectedOptions.includes(option) ? "#7D5BA6" : "#ccc", 
                    transition: "all 0.3s ease",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isMaxReached && !selectedOptions.includes(option) ? 0.5 : 1
                  }}
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
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "#7D5BA6",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background 0.3s ease",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)"
        }}
      >
        Submit
      </button>
      <ToastContainer />
    </div>
  );
}
