export default function AssetTag({ id, large = false }) {
  return <span className={`asset-tag${large ? " large" : ""}`}>{id}</span>;
}
