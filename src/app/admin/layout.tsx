export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        #admin-root h1,
        #admin-root h2,
        #admin-root h3,
        #admin-root h4 { font-size: inherit; margin: 0; line-height: inherit; color: inherit; }
        #admin-root ul { list-style: none; padding: 0; margin: 0; }
        #admin-root p { margin: 0; }
        #admin-root a { color: inherit; text-decoration: none; }
        #admin-root button { font-family: inherit; }
        #admin-root input, #admin-root textarea, #admin-root select { font-family: inherit; }
        body { background-color: #f8fafc !important; }
      `}</style>
      <div id="admin-root">{children}</div>
    </>
  );
}
