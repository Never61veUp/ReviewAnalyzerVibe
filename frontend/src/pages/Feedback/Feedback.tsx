// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchGroups } from "../../api/groups";
// import { Review } from "../../api/client";

// const FeedbackPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadReviews = async () => {
//       try {
//         const data = await fetchGroups();
//         const allReviews = data.result.groups.flatMap(group => group.reviews);
//         setReviews(allReviews);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadReviews();
//   }, []);

//   if (loading) return <div>Загрузка всех отзывов...</div>;

//   return (
//     <div className="min-h-screen px-6 lg:px-16 py-12 flex flex-col items-center bg-[var(--background)] text-[var(--text)]">
//       <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: "var(--primary)" }}>
//         Все отзывы пользователей
//       </h1>

//       <div className="w-full max-w-4xl flex flex-col gap-4">
//         {reviews.map((fb) => (
//           <div
//             key={fb.id}
//             className="p-4 rounded-2xl backdrop-blur-xl bg-white/20 dark:bg-black/10 
//                        border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <span className="font-semibold text-[var(--text)]">{fb.label}</span>
//               <span className="text-xs text-[var(--text)]/60">{fb.id}</span>
//             </div>
//             <p className="text-[var(--text)]">{fb.text}</p>
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={() => navigate(-1)}
//         className="mt-8 px-6 py-2 rounded-xl bg-[var(--primary)] text-white font-semibold
//                    hover:bg-[var(--accent)] transition"
//       >
//         Назад
//       </button>
//     </div>
//   );
// };

// export default FeedbackPage;
