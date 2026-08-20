export default function Logo({ size = "md" }) {
  return (
    <div className={`logo logo-${size}`}>
      Pay<span>tm</span>
    </div>
  );
}
