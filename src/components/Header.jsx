import { useNavigate } from "react-router-dom";
import catLogo from "../assets/catlogo.svg";
import "../styles/header.css";

export default function Header({ extraActions }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("blackCat_userName") || "Translator";

  return (
    <header className="cat-header">
      <div className="cat-brand-box" onClick={() => navigate("/dashboard")}>
        <img src={catLogo} alt="Black Cat Logo" className="cat-logo" />
        <div>
          <h1 className="brand-title">
            BLACK CAT <span className="cat-emoji">🐾</span>
          </h1>
          <div className="brand-subtitle">BILINGUAL TRANSLATION STUDIO</div>
        </div>
      </div>

      <div className="header-actions">
        {extraActions}

        <div className="engine-status-badge">
          <span className="dot active"></span>
          Smart CAT Engine Active
        </div>

        <div className="user-profile">
          <div className="user-avatar">{userName.charAt(0).toUpperCase()}</div>
          <span className="user-name">{userName}</span>
        </div>
      </div>
    </header>
  );
}
