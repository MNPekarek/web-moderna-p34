type MetaItem = { label: string; value: string };
type EditorialMetaProps = { items: MetaItem[]; className?: string };

export function EditorialMeta({ items, className = "" }: EditorialMetaProps) {
  return (
    <dl className={`editorial-meta ${className}`}>
      {items.map((item) => (
        <div className="editorial-meta__item" key={item.label} data-meta-item>
          <dt>{item.label}</dt><dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
