import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../utils/newRequest';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../Component/Navbar'; 



const UserDisplay = ({ userId }) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['user', userId],
        queryFn: () => newRequest.get(`/users/${userId}`).then(res => res.data),
        staleTime: 1000 * 60 * 60, // Cache user data for 1 hour
        enabled: !!userId, // Only run if userId is available
    });

    if (isLoading) return (
        <div className="flex items-center gap-3 animate-pulse mt-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
    );

    return (
        <div className="flex items-center gap-3 mt-4">
            <img 
                src={user?.img || '/img/noavatar.png'} 
                alt={user?.username || 'seller'} 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-300"
            />
            <span className="font-bold text-lg text-gray-800">{user?.username || "N/A"}</span>
        </div>
    );
};

const StarRating = ({ rating, starNumber }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = totalStars - fullStars - halfStar;

  return (
    <div className="flex items-center">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        ))}
        {halfStar === 1 && (
            <svg key="half" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
            <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
        ))}
      </div>
      {starNumber > 0 && (
          <>
            <span className="ml-2 text-gray-700 font-medium">{rating.toFixed(1)}</span>
            <span className="ml-1 text-gray-500">({starNumber} reviews)</span>
          </>
      )}
    </div>
  );
};

const Review = ({ review }) => {
    return (
        <div className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
                <img 
                    src={review.user?.img || '/img/noavatar.png'} 
                    alt={review.user?.username || 'user'} 
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{review.user?.username || 'Anonymous'}</h3>
                        <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="my-2">
                        <StarRating rating={review.star} starNumber={0} />
                    </div>
                    <p className="text-gray-700 text-base">{review.desc}</p>
                </div>
            </div>
        </div>
    );
};

// --- Main GigDetail Component ---

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewInput, setReviewInput] = useState({ star: 5, desc: '' });
  const [mainImage, setMainImage] = useState('');
  const [canReview, setCanReview] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const fetchGig = async () => {
    try {
      const res = await newRequest.get(`/gigs/single/${id}`);
      setGig(res.data);
      if(!mainImage) setMainImage(res.data.cover);
    } catch (err) {
      console.error('Error fetching gig:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await newRequest.get(`/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    const checkPurchase = async () => {
      try {
        const res = await newRequest.get(`/orders/check-purchase/${id}`);
        setCanReview(res.data.purchased);
      } catch (err) {
        setCanReview(false);
      }
    };

    Promise.all([fetchGig(), fetchReviews()]).then(() => {
        if (currentUser && !currentUser.isSeller) {
            checkPurchase();
        }
        setLoading(false);
    });
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewInput({ ...reviewInput, [name]: value });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    const promise = newRequest.post('/reviews', {
      gigId: id,
      ...reviewInput,
    });

    toast.promise(promise, {
        loading: 'Submitting your review...',
        success: () => {
            setCanReview(false);
            fetchReviews();
            fetchGig(); 
            return <b>Review submitted successfully!</b>;
        },
        error: (err) => <b>{err.response?.data?.message || "Failed to submit review."}</b>
    });
  };

  const handleOrder = () => {
    if (!currentUser) {
        toast.error("Please log in to complete this order.");
        navigate("/login");
        return;
    }
    navigate(`/pay/${id}`);
  };

  const handleContact = async () => {
    try {
      const res = await newRequest.post("/conversations", { to: gig.userId });
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      toast.error("Could not start conversation.");
    }
  };

  if (loading) return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        <p className="text-gray-600 mt-4 text-lg">Loading Details...</p>
      </div>
  );

  if (!gig) return <div className="text-center mt-10 text-red-600 font-semibold text-xl">Gig not found.</div>;

  const averageRating = gig.starNumber > 0 ? gig.totalStars / gig.starNumber : 0;

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <Toaster position="top-center" />
        
        <div className="bg-white">
          <header className="max-w-6xl mx-auto pt-8 pb-6 px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">{gig.title}</h1>
            {gig.userId && <UserDisplay userId={gig.userId} />}
            <div className="mt-4">
              <StarRating rating={averageRating} starNumber={gig.starNumber}/>
            </div>
          </header>
        </div>
      
        <main className="max-w-6xl mx-auto mt-8 px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <img src={mainImage} alt="Main gig showcase" className="w-full h-auto object-cover"/>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                <div onClick={() => setMainImage(gig.cover)} className="overflow-hidden rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105 border-2 hover:border-indigo-500">
                    <img src={gig.cover} alt="Thumbnail main" className="w-full h-32 object-cover"/>
                </div>
                {gig.images?.map((imgUrl, index) => (
                    <div key={index} onClick={() => setMainImage(imgUrl)} className="overflow-hidden rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-105 border-2 hover:border-indigo-500">
                        <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-32 object-cover"/>
                    </div>
                ))}
              </div>

              <section className="mt-12 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Gig</h2>
                <div className="prose prose-lg text-gray-700 max-w-none whitespace-pre-wrap">
                    {gig.desc}
                </div>
                {gig.features && gig.features.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What's Included:</h3>
                      <ul className="space-y-2">
                          {gig.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                  <span>{feature}</span>
                              </li>
                          ))}
                      </ul>
                    </>
                )}
              </section>

              {/* Reviews Section */}
              <section className="mt-12 bg-white p-8 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
                  <div className="space-y-8">
                      {reviews.length > 0 ? (
                          reviews.map((review) => <Review key={review._id} review={review} />)
                      ) : (
                          <p className="text-gray-600">No reviews have been submitted for this gig yet.</p>
                      )}
                  </div>

                  {/* Submit a Review Form */}
                  {canReview && (
                  <div className="mt-10 border-t pt-8">
                      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                          <label htmlFor="star" className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                          <select id="star" name="star" value={reviewInput.star} onChange={handleReviewChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white">
                          <option value={5}>5 Stars - Excellent</option>
                          <option value={4}>4 Stars - Good</option>
                          <option value={3}>3 Stars - Average</option>
                          <option value={2}>2 Stars - Fair</option>
                          <option value={1}>1 Star - Poor</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                          <textarea id="desc" name="desc" value={reviewInput.desc} onChange={handleReviewChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Share your experience with this service..." required></textarea>
                      </div>
                      <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors">Submit Review</button>
                      </form>
                  </div>
                  )}
              </section>
            </div>
      
            {/* Right Column - Order Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">₹{new Intl.NumberFormat('en-IN').format(gig.price)}</h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">{gig.cat}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{gig.shortDesc}</p>
                  <button 
                    onClick={handleOrder}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-4 flex items-center justify-center"
                  >
                    <span>Order Now</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                  <button 
                    onClick={handleContact}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 mt-2 flex items-center justify-center"
                  >
                    <span>Contact Seller</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
      
                <div className="space-y-3 text-sm">
                  <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg><span><strong>Delivery Time:</strong> {gig.deliveryTime} days</span></div>
                  <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M17.924 2.617a.997.997 0 00-.215-.322l-.001-.001a1 1 0 00-.59-.355h-.002a.998.998 0 00-.256-.038 1.002 1.002 0 00-.256.038h-.002a1 1 0 00-.589.355l-1.455 1.455a1 1 0 000 1.414l4.242 4.242a1 1 0 001.414 0l1.455-1.455a1 1 0 00.355-.59h.002c.013-.085.038-.17.038-.256a1.002 1.002 0 00-.038-.256h-.002a1 1 0 00-.355-.59l-1.455-1.455zM2.998 12.82a1 1 0 000 1.414l4.243 4.243a1 1 0 001.414 0l9.192-9.192a1 1 0 000-1.414l-4.242-4.242a1 1 0 00-1.414 0L2.998 12.82z" /></svg><span><strong>Revisions:</strong> {gig.revisionNumber}</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default GigDetail;