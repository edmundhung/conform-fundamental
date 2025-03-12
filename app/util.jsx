import { useRef } from "react";

export function useRenderCount() {
    const countRef = useRef(0);
    return countRef.current++;
}