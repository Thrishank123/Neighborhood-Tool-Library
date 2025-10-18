import { useState, useEffect } from "react";
import api from "../api/axiosConfig";

const Reviews = () => {
  const [toolId, setToolId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async (id) => {
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reviews", { tool_id: toolId, rating, comment });
      alert("Review added!");
      fetchReviews(toolId);
    } catch (err) {
      alert(err.response?.data?.message || "Error adding review");
    }
  };

  return (
    <div>
      <h2>Reviews</h2>
      <form onSubmit={handleSubmit} className="review-form">
        <input
          type="number"
          placeholder="Tool ID"
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <textarea
          placeholder="Your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit Review</button>
      </form>

      {toolId && (
        <>
          <h3>Reviews for Tool #{toolId}</h3>
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <strong>{r.user_name}</strong> rated {r.rating}/5
              <p>{r.comment}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Reviews;
