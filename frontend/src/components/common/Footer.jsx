import "./Footer.css";

const Footer = ({ 
  companyName = "Smart Queue Management System", 
  termsText = "Điều khoản sử dụng", 
  supportText = "Hỗ trợ khách hàng" 
}) => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-inner">
        <p>© {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
        <div className="footer-links">
          <span className="footer-link" style={{ marginRight: "15px" }}>{termsText}</span>
          <span className="footer-link">{supportText}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
