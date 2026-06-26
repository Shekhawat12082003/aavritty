export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}
