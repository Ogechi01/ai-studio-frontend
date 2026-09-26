const styles = {
  error: "bg-red-50 text-red-700 border-red-200",
  success: "bg-green-50 text-green-700 border-green-200",
  info: "bg-violet-50 text-violet-700 border-violet-200",
};

// A message box shown on the page instead of a browser alert()
function Alert({ type = "error", children, onClose }) {
  if (!children) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}
    >
      <span>{children}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="font-bold opacity-60 hover:opacity-100"
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;
