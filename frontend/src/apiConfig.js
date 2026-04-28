const API_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:5001" 
  : "https://online-food-ordering-lncf.onrender.com";
export default API_URL;
