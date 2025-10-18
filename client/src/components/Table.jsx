const Table = ({ children, className = "", ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

const Thead = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const Tbody = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const Tr = ({ children, ...props }) => <tr {...props}>{children}</tr>;
const Th = ({ children, ...props }) => <th {...props}>{children}</th>;
const Td = ({ children, ...props }) => <td {...props}>{children}</td>;

Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Tr = Tr;
Table.Th = Th;
Table.Td = Td;

export default Table;
