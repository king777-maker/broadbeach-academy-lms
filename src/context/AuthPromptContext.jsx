import React, { createContext, useContext, useState, useCallback } from "react";
import CourseLoginPromptModal from "../components/Auth/CourseLoginPromptModal";
import { useAuth } from "./AuthContext";

const AuthPromptContext = createContext(null);

export const AuthPromptProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [promptState, setPromptState] = useState({
    isOpen: false,
    courseData: null,
  });

  const showLoginPrompt = useCallback((courseData = {}) => {
    setPromptState({
      isOpen: true,
      courseData,
    });
  }, []);

  const hideLoginPrompt = useCallback(() => {
    setPromptState({
      isOpen: false,
      courseData: null,
    });
  }, []);

  /**
   * Helper to verify authentication:
   * If logged in -> returns true immediately.
   * If not logged in -> displays the "Please log in first to start this course." prompt modal
   * with Cancel and Log In actions, and returns false.
   */
  const requireAuth = useCallback(
    (courseData = {}) => {
      if (isAuthenticated && user) {
        return true;
      }
      showLoginPrompt(courseData);
      return false;
    },
    [isAuthenticated, user, showLoginPrompt]
  );

  return (
    <AuthPromptContext.Provider
      value={{
        showLoginPrompt,
        hideLoginPrompt,
        requireAuth,
      }}
    >
      {children}
      <CourseLoginPromptModal
        isOpen={promptState.isOpen}
        onClose={hideLoginPrompt}
        courseData={promptState.courseData}
      />
    </AuthPromptContext.Provider>
  );
};

export const useAuthPrompt = () => {
  const context = useContext(AuthPromptContext);
  if (!context) {
    throw new Error("useAuthPrompt must be used within an AuthPromptProvider");
  }
  return context;
};

export default AuthPromptContext;
