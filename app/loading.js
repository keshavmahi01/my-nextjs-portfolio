export default function Loading() {
  return (
    <div className="skel-page">
      <div className="sk big" />
      <div className="sk" style={{ width: '70%' }} />
      <div className="skel-grid">{[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="sk" />)}</div>
    </div>
  );
}
