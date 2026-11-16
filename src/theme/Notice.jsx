/**
 * Aviso en linea (notice). El tono decide el color del borde izquierdo.
 */

export default function Notice({ tone = "info", tag = "info", children, style }) {
  return (
    <div className={`notice notice--${tone}`} style={style}>
      <span className="notice__tag">{tag}</span>
      <span>{children}</span>
    </div>
  );
}
