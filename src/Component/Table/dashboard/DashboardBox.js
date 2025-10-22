import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardBox = (props) => {
  const {
    title,
    icon,
    value,
    link,
    background,
    color,
    fontColor,
    backgroundcolor,
    border,
    iconImg,
  } = props;

  const navigate = useNavigate();

  return (
    <>
      <style jsx>{`
        .dashboardBoxWrapper {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboardBoxWrapper:hover {
          transform: translateY(-4px);
        }

        .dashboardBoxWrapper:hover .dashboardBox {
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
        }

        .dashboardBox {
          border-radius: 16px;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .dashboardBox::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(30%, -30%);
          transition: all 0.3s ease;
        }

        .dashboardBoxWrapper:hover .dashboardBox::before {
          transform: translate(20%, -20%) scale(1.2);
        }

        .dashContent {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .dashCount {
          flex: 1;
        }

        .dName {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
          display: block;
          margin-bottom: 8px;
          letter-spacing: 0.3px;
        }

        .dCount {
          font-size: 32px;
          font-weight: 700;
          display: block;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .dashIcon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .dashboardBoxWrapper:hover .dashIcon {
          transform: scale(1.1) rotate(5deg);
        }

        .dashIcon i {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dashIcon img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }

        .viewDetails {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 14px;
          font-weight: 500;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
          z-index: 2;
        }

        .viewDetails i {
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        .dashboardBoxWrapper:hover .viewDetails i {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .dCount {
            font-size: 28px;
          }

          .dashIcon {
            width: 56px;
            height: 56px;
            font-size: 24px;
          }

          .dashboardBox {
            padding: 20px;
          }
        }
      `}</style>

      <div
        className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4 dashboardBoxWrapper"
        onClick={() => navigate(`${link}`)}
      >
        <div
          className="dashboardBox"
          style={{
            background: background || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: color || "#ffffff",
            border: border || "none",
          }}
        >
          <div className="dashContent">
            <div className="dashCount">
              <span className="dName">{title}</span>
              <span className="dCount">{value}</span>
            </div>
            <div
              className="dashIcon"
              style={{
                background: backgroundcolor || "rgba(255, 255, 255, 0.2)",
                color: fontColor || "#ffffff",
              }}
            >
              {icon ? (
                <i className={icon}></i>
              ) : (
                <img src={iconImg} alt={title} />
              )}
            </div>
          </div>
          <div className="viewDetails">
            <span>View Details</span>
            <i className="bi bi-arrow-right"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardBox;