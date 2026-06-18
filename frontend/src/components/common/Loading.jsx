import "./Loading.css";

const Loading = ({ 
  type = "spinner", // spinner, overlay, skeleton
  message = "Đang tải...", 
  size = "md"       // sm, md, lg
}) => {
  if (type === "overlay") {
    return (
      <div className="loading-overlay">
        <div className="loading-overlay-content">
          <span className={`loading-spinner spinner-${size}`}></span>
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  if (type === "skeleton") {
    return (
      <div className="loading-skeleton-pulse">
        <div className="skeleton-item title"></div>
        <div className="skeleton-item body"></div>
        <div className="skeleton-item body short"></div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <span className={`loading-spinner spinner-${size}`}></span>
      {message && <span className="loading-text">{message}</span>}
    </div>
  );
};

export default Loading;
