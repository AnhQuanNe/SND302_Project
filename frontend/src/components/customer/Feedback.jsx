import { useState, useEffect } from "react";
import {submitFeedback, getAllFeedback} from "../../services/feedback.service";
import { FaStar } from "react-icons/fa";
import "./Feedback.css";

function Feedback(){
    const user = JSON.parse(localStorage.getItem("user"));

    const [feedback, setFeedback] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [subject, setSubject] = useState("");
    const [comment, setComment] = useState("");
    const [toast, setToast] = useState(null);
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    const fetchFeedbacks = async () => {
        try {
            const response = await getAllFeedback();

            setFeedback(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (rating < 1 || !subject.trim() || !comment.trim()) {
            setToast({
                type: "error",
                message: "Vui lòng nhập đầy đủ thông tin!"
            });
            return;
        }
        try{
            setLoading(true);

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                setToast({
                    type: "error",
                    message: "Bạn cần đăng nhập trước khi gửi feedback!"
                });
                return;
            }

            const payload = {
                name: user?.fullName || "Anonymous",
                email: user?.email || "",
                rating,
                subject,
                comment
            };

            if (user?._id) {
                payload.userId = user._id;
            }

            await submitFeedback(payload);

            setToast({
                type: "success",
                message: "Cảm ơn bạn đã gửi phản hồi ❤️"
            })

            setRating(0);
            setSubject("");
            setComment("");

            fetchFeedbacks();
        }catch (error){
            console.log(error.response?.data);
            alert("Không thể gửi feedback !!!");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="feedback-page">
            <div className="feedback-card">
                <div className="feedback-header">
                    <h1 className="feedback-title">
                        Gửi phản hồi
                    </h1>
                    <p className="feedback-subtitle">
                        Chúng tôi luôn mong muốn cải thiện chất lượng dịch vụ.
                        Mọi ý kiến đóng góp của bạn đều rất quý giá đối với Smart Queue.
                    </p>

                </div>
                <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Đánh giá</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className="star"
                                        size={34}
                                        color={
                                            star <= (hover || rating)
                                                ? "#fbbf24"
                                                : "#d1d5db"
                                        }
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                ))}

                            </div>
                            <div className="rating-text">
                                {rating === 1 && "😞 Không hài lòng"}
                                {rating === 2 && "😕 Chưa tốt"}
                                {rating === 3 && "🙂 Bình thường"}
                                {rating === 4 && "😊 Tốt"}
                                {rating === 5 && "😍 Xuất sắc"}
                            </div>
                        </div>

                    <div className="form-group">
                        <label>Tiêu đề</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Ví dụ: Dịch vụ nhanh chóng"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nội dung phản hồi</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                        />
                    </div>

                    <button
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang gửi..."
                            : "Gửi Feedback"}
                    </button>
                </form>
                <div className="feedback-list">
                    <h2>Feedback Của Mọi Người</h2>

                    {feedback.map((item) => (
                        <div key={item._id} className="feedback-item">
                            <h4>{item.name}</h4>
                            <div className="stars">
                                {[...Array(item.rating)].map((_, i) => (
                                    <FaStar key={i} color="#fbbf24"/>
                                ))}
                            </div>

                            <p style={{fontSize: "15px", fontWeight:"bold"}}>{item.subject}</p>
                            <p style={{fontStyle:"italic", fontSize: "20px"}}>{item.comment}</p>

                            <small style={{fontSize: "12px"}}>
                                {new Date(item.createdAt).toLocaleString()}
                            </small>

                        </div>
                    ))}
                </div>
            </div>
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default Feedback;