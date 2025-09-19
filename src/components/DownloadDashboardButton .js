import { useState } from "react";
import axiosInstance from "../api/axiosConfig"; // Real axios instance configured with API base URL
import authHeader from "../services/auth-header"; // Auth headers to include in the request
import { t } from "i18next";

export const DownloadDashboardButton = ({ query }) => {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleClick = (event) => {
    if (status === "idle") {
      setStatus("downloading");
      let currentProgress = 0;

      // Simulate download progress at a faster rate
      const interval = setInterval(() => {
        currentProgress += 10; // Increase by 10% per interval for faster download simulation
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setTimeout(() => {
            setStatus("complete");
          }, 500); // Delay before showing "Complete"
        }
        setProgress(currentProgress);
      }, 100); // Faster update interval (100ms)

      // Ripple Effect
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(button.offsetWidth, button.offsetHeight);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600); // Remove ripple after animation
    }
  };

  const downloadDashboardPdf = async (params) => {
    setStatus("downloading");
    setProgress(0);

    try {
      // Real API request
      const response = await axiosInstance.get("/dashboard/download", {
        headers: authHeader(), // Pass authorization headers (like JWT token)
        params, // API query parameters
        responseType: "blob", // Ensure response is a blob (PDF)
      });

      // Trigger file download once the data is ready
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dashboard.pdf"); // Set default download filename
      document.body.appendChild(link);
      link.click(); // Simulate a click to trigger the download

      // Simulate download completion with progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10; // Increase by 10% per interval
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(currentProgress);
          clearInterval(interval);

          // Set status to "complete" and then back to "idle" after a delay
          setTimeout(() => {
            setStatus("complete"); // Show "complete" status after download finishes
            setTimeout(() => {
              setStatus("idle"); // Reset status to idle after another delay
            }, 500); // Short delay before switching to "idle"
          }, 500); // Delay before showing "Complete"
        } else {
          setProgress(currentProgress); // Update progress
        }
      }, 100); // Faster update interval (100ms)
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setStatus("idle"); // If there's an error, reset status to idle
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <button
        className={`relative flex items-center justify-center px-2 py-2 rounded-md border-none bg-gradient-to-r from-blue-500 to-teal-500 text-white font-sans font-bold cursor-pointer overflow-hidden transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl hover:scale-105
    ${
      status === "downloading"
        ? "bg-gradient-to-r from-teal-500 to-blue-600 cursor-default shadow-md"
        : ""
    }
    ${
      status === "complete"
        ? "bg-gradient-to-r from-green-400 to-green-600 shadow-xl"
        : ""
    }`}
        onClick={(e) => {
          handleClick(e);
          downloadDashboardPdf(query);
        }}
        disabled={status !== "idle"}
        style={{ width: "90px", height: "30px" }}
      >
        {/* Download Icon */}
        <div className="relative w-4 h-4">
          <svg
            className={`absolute top-0 left-0 w-full h-full fill-white transition-all duration-300 ease-in-out
        ${status === "downloading" ? "animate-arrow-whoosh" : ""}
        ${status === "complete" ? "transform scale-0 opacity-0" : ""}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.018l-8.49 -8.49l1.414 -1.415l6.076 6.076v-14.189l2 0v14.189l6.076 -6.076l1.414 1.415z" />
          </svg>
          {/* Checkmark Icon */}
          <svg
            className={`absolute top-0 left-0 w-full h-full fill-white
        ${
          status === "complete"
            ? "animate-checkmark-pop"
            : "transform scale-0 opacity-0"
        }`}
            viewBox="0 0 24 24"
          >
            <path d="M20.285 2.067l-12.392 12.392 -4.85 -4.85l-1.415 1.414l6.265 6.265l13.807 -13.807z" />
          </svg>
          {/* Downloading Spinner Icon */}
          <svg
            className={`absolute top-0 left-0 w-full h-full fill-none stroke-white
      ${
        status === "downloading"
          ? "animate-spin"
          : "transform scale-0 opacity-0"
      }`}
            viewBox="0 0 50 50"
          >
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="126.92"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        {/* Progress Bar */}
        {status === "downloading" && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white transition-all duration-300 ease-in-out">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* CSS Animations */}
        <style>{`

      .animate-arrow-whoosh {
    animation: whoosh 1s infinite;
  }

  @keyframes whoosh {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }

  .animate-checkmark-pop {
    animation: checkmarkPop 0.6s ease-out;
  }

  @keyframes checkmarkPop {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-spin {
    animation: spin 1.2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .path {
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 126.92; /* Define the length of the stroke */
    stroke-dashoffset: 0;
  }

  .path {
    stroke-linecap: round;
    stroke-linejoin: round;
  }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: scale(0);
          animation: ripple-animation 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }

        @keyframes ripple-animation {
          from { transform: scale(0); opacity: 1; }
          to { transform: scale(2.5); opacity: 0; }
        }

        @keyframes arrow-whoosh {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(100px) scale(0.5); opacity: 0; }
        }

        @keyframes checkmark-pop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        .animate-arrow-whoosh {
          animation: arrow-whoosh 0.3s ease-in-out forwards;
        }

        .animate-checkmark-pop {
          animation: checkmark-pop 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards;
        }
      `}</style>
      </button>
      {/* Button Text */}
      <div className=" text-center flex flex-col">
        <span
          className={`transition-all duration-300 ease-in-out
      ${status === "downloading" || status === "complete" ? "hidden" : "block"}
      text-metallic`}
        >
          Download pdf
        </span>
        <span
          className={`transition-all duration-300 ease-in-out
      ${status === "downloading" ? "block" : "hidden"}
      text-metallic`}
        >
          Downloading...
        </span>
        <span
          className={`transition-all duration-300 ease-in-out
      ${status === "complete" ? "block" : "hidden"}
      text-metallic`}
        >
          Complete
        </span>
      </div>

      <style jsx>{`
        .text-metallic {
          background: linear-gradient(
            135deg,
            #b0b0b0,
            #e0e0e0,
            #a1a1a1,
            #c7c7c7
          ); /* Subtle gradient for a solid metallic look */
          color: transparent;
          background-clip: text; /* Clips the background to the text */
          font-weight: bold;
          font-size: 0.4rem;
          text-transform: uppercase;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2),
            0 2px 4px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.3),
            0 4px 6px rgba(0, 0, 0, 0.3); /* Deeper shadows for a more realistic effect */
          letter-spacing: 2px; /* Adding space between letters for a more defined metallic look */
        }

        .hidden {
          display: none; /* Hide the element when not needed */
        }

        .block {
          display: block; /* Show the element when needed */
        }
      `}</style>
    </div>
  );
};
