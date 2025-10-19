import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Container from "../components/Container";
import Card from "../components/Card";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { ToastContainer } from "../components/Toast";

const Reviews = () => {
  const [toolId, setToolId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const fetchReviews = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      addToast("Failed to load reviews", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!toolId) newErrors.toolId = "Tool ID is required";
    if (!comment.trim()) newErrors.comment = "Comment is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.post("/reviews", { tool_id: toolId, rating: parseInt(rating), comment });
      addToast("Review submitted successfully!");
      setComment("");
      fetchReviews(toolId);
    } catch (err) {
      const message = err.response?.data?.message || "Error submitting review";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolIdChange = (e) => {
    const value = e.target.value;
    setToolId(value);
    if (value) {
      fetchReviews(value);
    } else {
      setReviews([]);
    }
    if (errors.toolId) setErrors((prev) => ({ ...prev, toolId: "" }));
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (errors.comment) setErrors((prev) => ({ ...prev, comment: "" }));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? "text-yellow-400" : "text-neutral-300"}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[url('https://www.shareable.net/wp-content/uploads/2018/12/blog_top-image_tools.jpg')] bg-cover bg-center bg-no-repeat pt-24">
      <div className="mx-4 lg:mx-8 xl:mx-16 mt-8">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="mb-8">
            <h1 className="text-19xl font-bold text-white mb-2">Reviews</h1>
            <p className="text-16xl text-white/80">Read and write reviews for tools</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Write a Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="toolId">
                      Tool ID
                    </label>
                    <input
                      type="number"
                      name="toolId"
                      id="toolId"
                      value={toolId}
                      onChange={handleToolIdChange}
                      className={`w-full px-4 py-3 bg-white/10 border text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:bg-white/20 ${errors.toolId ? "border-red-300 focus:ring-red-300" : "border-white/20 focus:ring-white/50"}`}
                      placeholder="Enter tool ID to review"
                      required
                      min="1"
                    />
                    {errors.toolId && (
                      <p className="mt-1 text-sm text-red-300" role="alert">
                        {errors.toolId}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="rating">
                      Rating
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20"
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num} className="bg-neutral-800">
                          {num} Star{num !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1 flex items-center">
                      {renderStars(rating)}
                      <span className="ml-2 text-sm text-white/80">({rating}/5)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="comment">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      value={comment}
                      onChange={handleCommentChange}
                      className={`w-full px-4 py-3 bg-white/10 border text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:bg-white/20 resize-none ${errors.comment ? "border-red-300 focus:ring-red-300" : "border-white/20 focus:ring-white/50"}`}
                      placeholder="Share your experience with this tool..."
                      rows="4"
                      required
                    />
                    {errors.comment && (
                      <p className="mt-1 text-sm text-red-300" role="alert">
                        {errors.comment}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || !toolId}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {toolId ? `Reviews for Tool #${toolId}` : "Select a tool to view reviews"}
                </h2>

                {isLoading ? (
                  <div className="text-center py-8">
                    <Spinner size="md" className="mx-auto mb-2" />
                    <p className="text-white/80">Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <p className="text-white/60 text-center py-8">
                    {toolId ? "No reviews yet. Be the first to review!" : "Enter a tool ID to view reviews."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-white">{review.user_name}</strong>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                            <span className="ml-2 text-sm text-white/80">({review.rating}/5)</span>
                          </div>
                        </div>
                        <p className="text-white/80">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </div>
    </div>
  );
};

export default Reviews;
