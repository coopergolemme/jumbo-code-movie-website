"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  addWatchedMovie,
  getCurrentUserId,
  getUserMovieReview,
  updateWatchedMovie,
} from "@/lib/user-api";
import { DetailedMovie } from "@/lib/movie-api";
import { UserMovieReview } from "@/types/database";

interface ClientInteractiveSectionProps {
  movie: DetailedMovie;
}

export default function ClientInteractiveSection({
  movie,
}: ClientInteractiveSectionProps) {
  const [isWatched, setIsWatched] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [existingReview, setExistingReview] = useState<UserMovieReview | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial watched status and review from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const id = await getCurrentUserId();
        setUserId(id);

        if (id) {
          const reviewData = await getUserMovieReview(id, movie.id);
          setExistingReview(reviewData);

          if (reviewData?.isWatched) {
            setIsWatched(true);
            setRating(reviewData.rating || 0);
            setReview(reviewData.review || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [movie.id]);

  const handleWatchedToggle = () => {
    if (isWatched) {
      setShowConfirmDialog(true);
    } else {
      setIsWatched(true);
      console.log("Movie watched status:", true, "for movieId:", movie.id);
    }
  };

  const confirmUnwatch = () => {
    setIsWatched(false);
    setShowConfirmDialog(false);
    console.log("Movie watched status:", false, "for movieId:", movie.id);
  };

  const handleReviewSubmit = async () => {
    if (review.trim() === "" && rating === 0) {
      console.warn("Cannot submit empty review or zero rating");
      return;
    }
    if (!userId) {
      console.error("User ID is required to submit a review");
      return;
    }

    try {
      let success = false;

      if (existingReview?.isWatched) {
        // Update existing review
        success = await updateWatchedMovie(
          userId,
          movie.id,
          movie.title,
          movie.poster_path,
          rating,
          review,
        );
      } else {
        // Add new review
        success = await addWatchedMovie(
          userId,
          movie.id,
          movie.title,
          movie.poster_path,
          rating,
          review,
        );
      }

      if (success) {
        // Update local state
        setExistingReview({
          rating,
          review,
          isWatched: true,
        });
        setShowReviewDialog(false);
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleReviewCancel = () => {
    setShowReviewDialog(false);
    setReview("");
    setRating(0);
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
  };

  const handleStarHover = (starIndex: number) => {
    setHoverRating(starIndex);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={isWatched ? "default" : "outline"}
          className={`transition-all duration-200 hover:scale-105 ${
            isWatched
              ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
              : "border-gray-300 hover:border-green-600 hover:text-green-600"
          }`}
          onClick={handleWatchedToggle}
        >
          {isWatched ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>Watched</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">
                <Eye />
              </span>
              <span>Mark as Watched</span>
            </div>
          )}
        </Button>

        {isWatched && (
          <Button onClick={() => setShowReviewDialog(true)}>
            {existingReview?.review || existingReview?.rating
              ? "Edit Review"
              : "Leave Review"}
          </Button>
        )}
      </div>

      {/* Display existing review */}
      {isWatched && (existingReview?.review || existingReview?.rating) && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
          <h3 className="text-lg font-semibold text-white">Your Review</h3>

          {existingReview.rating && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Your Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= (existingReview.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-medium">
                {existingReview.rating}/5
              </span>
            </div>
          )}

          {existingReview.review && (
            <div>
              <span className="text-sm text-gray-300">Your Review:</span>
              <p className="text-white mt-1">{existingReview.review}</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this movie as not watched?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnwatch}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {existingReview?.review || existingReview?.rating
                ? "Edit Review"
                : "Leave a Review"}
            </DialogTitle>
            <DialogDescription>
              {existingReview?.review || existingReview?.rating
                ? "Update your thoughts and rating for this movie"
                : "Share your thoughts and rate this movie"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Review</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleReviewCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={rating === 0 && !review.trim()}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
