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
    <div className="min-h-screen pt-20">
      <Container className="py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Reviews</h1>
          <p className="text-neutral-600">Read and write reviews for tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Write a Review</h2>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <FormInput
                  label="Tool ID"
                  type="number"
                  name="toolId"
                  id="toolId"
                  value={toolId}
                  onChange={handleToolIdChange}
                  error={errors.toolId}
                  placeholder="Enter tool ID to review"
                  required
                  min="1"
                />

                <div className="mb-4">
                  <label className="label" htmlFor="rating">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="input"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1 flex items-center">
                    {renderStars(rating)}
                    <span className="ml-2 text-sm text-neutral-600">({rating}/5)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="label" htmlFor="comment">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={handleCommentChange}
                    className={`input resize-none ${errors.comment ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
                    placeholder="Share your experience with this tool..."
                    rows="4"
                    required
                  />
                  {errors.comment && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.comment}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
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
                </Button>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                {toolId ? `Reviews for Tool #${toolId}` : "Select a tool to view reviews"}
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <Spinner size="md" className="mx-auto mb-2" />
                  <p className="text-neutral-600">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-neutral-500 text-center py-8">
                  {toolId ? "No reviews yet. Be the first to review!" : "Enter a tool ID to view reviews."}
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-neutral-900">{review.user_name}</strong>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-neutral-600">({review.rating}/5)</span>
                        </div>
                      </div>
                      <p className="text-neutral-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </Container>
    </div>
  );
};

export default Reviews;
