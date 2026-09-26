"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { 
  Building2, 
  UserCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight
} from "lucide-react";
import { GoogleAuthModal } from "./GoogleAuthModal";

export interface AuthSwitchProps {
  portal?: "officer" | "citizen";
  onPortalChange?: (portal: "officer" | "citizen") => void;
  onLoginSuccess?: (user: { name: string; role: string; email: string; isGuest?: boolean }) => void;
  onGuestLogin?: (role: "CITIZEN" | "POLICYMAKER") => void;
  onGoogleLogin?: (user: { name: string; email: string; role: "CITIZEN" | "POLICYMAKER" }) => void;
}

export default function AuthSwitch({
  portal: initialPortal = "officer",
  onPortalChange,
  onLoginSuccess,
  onGuestLogin,
  onGoogleLogin,
}: AuthSwitchProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activePortal, setActivePortal] = useState<"officer" | "citizen">(initialPortal);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  useEffect(() => {
    if (initialPortal) {
      setActivePortal(initialPortal);
    }
  }, [initialPortal]);

  const handlePortalSwitch = (newPortal: "officer" | "citizen") => {
    setActivePortal(newPortal);
    setEmail("");
    setPassword("");
    setFullName("");
    setLocation("");
    setStatusMessage(null);
    if (onPortalChange) {
      onPortalChange(newPortal);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleModalOpen(true);
  };

  const handleGoogleSuccess = (googleData: { name: string; email: string; role: "CITIZEN" | "POLICYMAKER" }) => {
    setIsGoogleModalOpen(false);
    setStatusMessage(`Authenticated with Google as ${googleData.name}`);
    if (onGoogleLogin) {
      onGoogleLogin(googleData);
    } else if (onLoginSuccess) {
      onLoginSuccess({
        name: googleData.name,
        role: googleData.role === "POLICYMAKER" ? "Officer / Policymaker" : "Citizen",
        email: googleData.email,
      });
    }
  };

  const handleGuestOfficer = () => {
    setStatusMessage("Continuing as Guest Officer...");
    if (onGuestLogin) {
      onGuestLogin("POLICYMAKER");
    } else if (onLoginSuccess) {
      onLoginSuccess({
        name: "District Magistrate Office (Guest Officer)",
        role: "Officer / Policymaker",
        email: "guest.officer@jansetu.gov.in",
        isGuest: true,
      });
    }
  };

  const handleGuestCitizen = () => {
    setStatusMessage("Continuing as Guest Citizen...");
    if (onGuestLogin) {
      onGuestLogin("CITIZEN");
    } else if (onLoginSuccess) {
      onLoginSuccess({
        name: "Ramesh Kumar (Guest Citizen - Ward 22)",
        role: "Citizen",
        email: "guest.citizen@jansetu.gov.in",
        isGuest: true,
      });
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const roleName = activePortal === "officer" ? "Officer / Policymaker" : "Citizen";
    const userName = fullName || (activePortal === "officer" ? "Officer" : "Citizen");
    const userEmail = email || (activePortal === "officer" ? "officer@gov.in" : "citizen@gmail.com");
    
    setStatusMessage(`Authenticated as ${userName}`);
    if (onLoginSuccess) {
      onLoginSuccess({
        name: userName,
        role: roleName,
        email: userEmail,
      });
    }
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  };

  return (
    <div className="auth-switch-root">
      <style>{`
        .auth-switch-root {
          font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          user-select: none;
        }

        .auth-switch-root * {
          box-sizing: border-box;
        }

        /* Clean Compact Centered Portal Toggle */
        .portal-header-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 880px;
          margin-bottom: 8px;
        }

        .portal-toggle-pill {
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          padding: 2.5px;
          box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.05);
        }

        .portal-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 16px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748b;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .portal-btn:hover {
          color: #0f172a;
        }

        .portal-btn.active-officer {
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .portal-btn.active-citizen {
          background: #0d9488;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
        }

        /* Compact Sliding Container - 440px Height */
        .auth-container {
          position: relative;
          width: 100%;
          max-width: 880px;
          height: 440px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 16px 40px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.08);
          overflow: hidden;
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 0.8s 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        form.auth-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 2.8rem;
          transition: all 0.2s 0.3s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        form.sign-up-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        form.sign-in-form {
          z-index: 2;
          pointer-events: all;
        }

        .auth-title {
          font-size: 1.5rem;
          color: #0f172a;
          margin-bottom: 2px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .auth-subtitle {
          font-size: 0.74rem;
          color: #64748b;
          margin-bottom: 10px;
          text-align: center;
        }

        .input-field-wrap {
          max-width: 310px;
          width: 100%;
          background-color: #f1f5f9;
          margin: 4px 0;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 0 0.8rem;
          position: relative;
          transition: 0.2s;
          border: 1px solid #e2e8f0;
        }

        .input-field-wrap:focus-within {
          background-color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 2.5px rgba(37, 99, 235, 0.15);
        }

        .input-icon-box {
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .input-field-wrap input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 0.82rem;
          color: #0f172a;
          width: 100%;
        }

        .input-field-wrap input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .auth-submit-btn {
          width: 100%;
          max-width: 310px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          border: none;
          outline: none;
          height: 38px;
          border-radius: 10px;
          color: #ffffff;
          font-weight: 700;
          margin-top: 6px;
          cursor: pointer;
          transition: all 0.25s;
          font-size: 0.82rem;
          letter-spacing: 0.01em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
        }

        .auth-submit-btn:hover {
          background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(37, 99, 235, 0.35);
        }

        .auth-submit-btn:active {
          transform: translateY(0);
        }

        /* Divider */
        .auth-divider {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 310px;
          margin: 7px 0 5px 0;
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #e2e8f0;
        }

        .auth-divider span {
          padding: 0 8px;
        }

        /* Dedicated Google Sign-In Button */
        .google-btn {
          width: 100%;
          max-width: 310px;
          height: 38px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #1e293b;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .google-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .google-btn:active {
          transform: translateY(0);
        }

        /* Decorative Sliding Panels */
        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .side-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          z-index: 6;
          padding: 1.8rem 2.2rem;
        }

        .left-panel {
          pointer-events: all;
        }

        .right-panel {
          pointer-events: none;
        }

        .side-panel .panel-content {
          color: #ffffff;
          transition: transform 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 300px;
        }

        .side-panel h3 {
          font-weight: 800;
          line-height: 1.2;
          font-size: 1.35rem;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .side-panel p {
          font-size: 0.78rem;
          line-height: 1.4;
          padding: 0 0 14px 0;
          color: rgba(255, 255, 255, 0.9);
        }

        .btn-transparent {
          margin: 0;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          padding: 6px 20px;
          border-radius: 9999px;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.76rem;
          cursor: pointer;
          transition: all 0.25s;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .btn-transparent:hover {
          background: #ffffff;
          color: #0f172a;
          border-color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .right-panel .panel-content {
          transform: translateX(800px);
        }

        /* Sign up Mode Transformations */
        .auth-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-container.sign-up-mode .left-panel .panel-content {
          transform: translateX(-800px);
        }

        .auth-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .auth-container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
          pointer-events: all;
        }

        .auth-container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .auth-container.sign-up-mode .right-panel .panel-content {
          transform: translateX(0%);
        }

        .auth-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .auth-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        /* Animated Circular Gradient Backdrop */
        .auth-container:before {
          content: "";
          position: absolute;
          height: 1800px;
          width: 1800px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: ${
            activePortal === "officer"
              ? "linear-gradient(-45deg, #1e3a8a 0%, #1d4ed8 50%, #0284c7 100%)"
              : "linear-gradient(-45deg, #0f766e 0%, #0d9488 50%, #0284c7 100%)"
          };
          transition: 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 50%;
          z-index: 6;
        }

        @media (max-width: 870px) {
          .auth-container {
            height: 490px;
            max-width: 440px;
          }
          .signin-signup {
            width: 100%;
            top: 92%;
            transform: translate(-50%, -100%);
            left: 50%;
          }
          .auth-container.sign-up-mode .signin-signup {
            left: 50%;
            top: 8%;
            transform: translate(-50%, 0);
          }
          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .side-panel {
            padding: 1.2rem 1rem;
            grid-column: 1 / 2;
          }
          .right-panel {
            grid-row: 3 / 4;
          }
          .left-panel {
            grid-row: 1 / 2;
          }
          .side-panel h3 {
            font-size: 1.1rem;
          }
          .side-panel p {
            display: none;
          }
          .auth-container:before {
            width: 1200px;
            height: 1200px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
          }
          .auth-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
        }
      `}</style>

      {/* Clean Compact Portal Toggle & Fast-Track Guest Login */}
      <div className="portal-header-bar flex flex-col items-center gap-2 mb-2">
        <div className="portal-toggle-pill" role="tablist" aria-label="Portal Selection">
          <button
            type="button"
            role="tab"
            aria-selected={activePortal === "officer"}
            onClick={() => handlePortalSwitch("officer")}
            className={`portal-btn ${activePortal === "officer" ? "active-officer" : ""}`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Officer &amp; Policymaker</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activePortal === "citizen"}
            onClick={() => handlePortalSwitch("citizen")}
            className={`portal-btn ${activePortal === "citizen" ? "active-citizen" : ""}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Citizen Portal</span>
          </button>
        </div>

        {/* 1-Click Fast Guest Login Shortcuts */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-500">Quick Guest Login:</span>
          <button
            type="button"
            onClick={handleGuestCitizen}
            className="px-2.5 py-0.5 rounded-full border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Continue as Guest Citizen (Instant Access)"
          >
            <span>👤 Guest Citizen</span>
          </button>
          <button
            type="button"
            onClick={handleGuestOfficer}
            className="px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Continue as Guest Officer (Instant Access)"
          >
            <span>🏛️ Guest Officer</span>
          </button>
        </div>
      </div>

      {/* Main Sliding Card */}
      <div className={isSignUp ? "auth-container sign-up-mode" : "auth-container"}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* SIGN IN FORM */}
            <form className="auth-form sign-in-form" onSubmit={onSubmit}>
              <h2 className="auth-title">
                {activePortal === "officer" ? "Officer Login" : "Citizen Sign In"}
              </h2>
              <p className="auth-subtitle">
                {activePortal === "officer"
                  ? "Access governance & capex intelligence"
                  : "Voice your community development needs"}
              </p>

              {/* Input 1 */}
              <div className="input-field-wrap">
                <div className="input-icon-box">
                  {activePortal === "officer" ? (
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                  )}
                </div>
                <input
                  type={activePortal === "officer" ? "email" : "text"}
                  placeholder={
                    activePortal === "officer"
                      ? "officer.name@nic.in / @gov.in"
                      : "Mobile Number / Aadhaar VID"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Input 2 */}
              <div className="input-field-wrap">
                <div className="input-icon-box">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <input
                  type="password"
                  placeholder="Password / Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Primary Submit CTA */}
              <button type="submit" className="auth-submit-btn">
                <span>
                  {activePortal === "officer" ? "Sign In as Officer" : "Sign In"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Instant One-Click Guest Access */}
              <button
                type="button"
                onClick={() => {
                  if (activePortal === "officer") {
                    handleGuestOfficer();
                  } else {
                    handleGuestCitizen();
                  }
                }}
                className={`w-full mt-2 py-2 px-3 rounded-lg border text-[11px] font-bold flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-2xs ${
                  activePortal === "officer"
                    ? "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800"
                    : "border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800"
                }`}
              >
                <span>⚡</span>
                <span>
                  {activePortal === "officer"
                    ? "Continue as Guest Officer / Evaluator (1-Click)"
                    : "Continue as Guest Citizen (Ward 22 - 1-Click)"}
                </span>
              </button>

              {/* Clean Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="google-btn"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </form>

            {/* SIGN UP FORM */}
            <form className="auth-form sign-up-form" onSubmit={onSubmit}>
              <h2 className="auth-title">
                {activePortal === "officer" ? "Cadre Registration" : "Create Account"}
              </h2>
              <p className="auth-subtitle">
                {activePortal === "officer"
                  ? "Request institutional intelligence access"
                  : "Submit needs and track resolution in your area"}
              </p>

              {/* Input 1 */}
              <div className="input-field-wrap">
                <div className="input-icon-box">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Input 2 */}
              <div className="input-field-wrap">
                <div className="input-icon-box">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <input
                  type={activePortal === "officer" ? "email" : "text"}
                  placeholder={
                    activePortal === "officer"
                      ? "Official Email (@gov.in / @nic.in)"
                      : "Email or Mobile Number"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Input 3 */}
              <div className="input-field-wrap">
                <div className="input-icon-box">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder={
                    activePortal === "officer"
                      ? "Ministry / Department"
                      : "District / City"
                  }
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Primary Submit CTA */}
              <button type="submit" className="auth-submit-btn">
                <span>
                  {activePortal === "officer"
                    ? "Request Access"
                    : "Create Account"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Clean Divider */}
              <div className="auth-divider">
                <span>or</span>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="google-btn"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>
            </form>
          </div>
        </div>

        {/* Decorative Sliding Panels */}
        <div className="panels-container">
          {/* Left Panel */}
          <div className="side-panel left-panel">
            <div className="panel-content">
              <h3>
                {activePortal === "officer"
                  ? "Need Clearance?"
                  : "New Here?"}
              </h3>
              <p>
                {activePortal === "officer"
                  ? "Request institutional capex intelligence dashboard clearance."
                  : "Join JanSetu AI to voice your community infrastructure priorities."}
              </p>
              <button
                type="button"
                className="btn-transparent"
                onClick={() => setIsSignUp(true)}
              >
                <span>{activePortal === "officer" ? "Request Access" : "Sign Up"}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="side-panel right-panel">
            <div className="panel-content">
              <h3>
                {activePortal === "officer"
                  ? "Authorized Officer?"
                  : "Welcome Back!"}
              </h3>
              <p>
                {activePortal === "officer"
                  ? "Sign in to access real-time demand hotspots and capex dossiers."
                  : "Sign in to track petitions and view your district's priority projects."}
              </p>
              <button
                type="button"
                className="btn-transparent"
                onClick={() => setIsSignUp(false)}
              >
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Google OAuth Account Selection Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        defaultRole={activePortal === "officer" ? "POLICYMAKER" : "CITIZEN"}
      />
    </div>
  );
}
