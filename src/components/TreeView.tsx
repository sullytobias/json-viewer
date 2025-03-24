import { useJson } from '../stores/useJsonStore';
import Node from './Node';

export default function TreeView() {
  const { json } = useJson();
  if (!json) return null;

  return (
    <div className="mt-6 bg-gray-800 p-4 rounded">
      <Node data={json} path="root" depth={0} />
    </div>
  );
}