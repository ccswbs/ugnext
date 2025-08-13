import { LoadingIndicator } from "@uoguelph/react-components/loading-indicator";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white flex items-center justify-center">
      <LoadingIndicator />
    </div>
  );
}
