/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export function protectAdminRoute(callback: Function) {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("adminAuth");
      if (!isAdmin) {
        window.location.href = "/admin/login"; // Redirect to login if not an admin
        return;
      }
      callback();
    }
  }
  