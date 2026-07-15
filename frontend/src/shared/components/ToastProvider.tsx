import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,

        style: {
          borderRadius: "12px",
          fontSize: "14px",
        },

        success: {
          duration: 3000,
        },

        error: {
          duration: 5000,
        },
      }}
    />
  );
};

export default ToastProvider;