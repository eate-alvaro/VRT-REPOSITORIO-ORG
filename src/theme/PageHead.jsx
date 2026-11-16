/**
 * Cabecera de pagina del workspace.
 */

export default function PageHead({ eyebrow, title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow ? <div className="page-head__eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {subtitle ? <div className="page-head__sub">{subtitle}</div> : null}
      </div>
      {children ? <div className="page-head__actions">{children}</div> : null}
    </div>
  );
}
