/**
 * Marca de la plataforma.
 *
 * La marca muestra PAINTBALL VR & IOT con "VR" resaltado.
 */

export function BrandName({ className = "brand-name" }) {
  return (
    <span className={className}>
      PAINTBALL <em>VR</em> &amp; IOT
    </span>
  );
}

export default BrandName;
