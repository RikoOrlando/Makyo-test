import React, { useEffect } from "react";

export default function useOutsideClick(
  ref: React.MutableRefObject<null | HTMLDivElement>,
  callback = () => {},
  listenClick = false
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    if (listenClick) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    // Bind the event listener
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, listenClick]);
}
