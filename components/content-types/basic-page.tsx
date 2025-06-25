export type BasicPageProps = {
  id: string;
  title: string;
};

export function BasicPage({ id, title }: BasicPageProps) {
  return (
    <div>
      {id} {title}
    </div>
  );
}
