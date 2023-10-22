import { RiseLoader } from "react-spinners"
export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">Loading...</h2>
        <RiseLoader></RiseLoader>
    </div>
  </div>
  }