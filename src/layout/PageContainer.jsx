export default function PageContainer({ title, children }) {
  return (
    <div style={{ padding: 16 }}>
      {title && <h2 style={{ marginBottom: 16 }}>{title}</h2>}
      {children}
    </div>
  );
}









