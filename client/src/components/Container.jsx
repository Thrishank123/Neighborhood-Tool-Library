const Container = ({ children, className = "", ...props }) => {
  return (
    <div className={`container-max ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
