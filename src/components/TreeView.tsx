import { useJson } from '../stores/useJsonStore';
import Node from './Node';

export default function TreeView() {
  const { json } = useJson();
  if (!json) return null;

  return (
    <div className="mt-6 p-4 rounded overflow-x-auto">
      <Node data={json} path="root" depth={0} />
    </div>
  );
} 