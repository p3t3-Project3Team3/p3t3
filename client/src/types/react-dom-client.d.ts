declare module "react-dom/client" {
  import { ReactNode } from "react";

  export function createRoot(
    container: Element | DocumentFragment,
    options?: { hydrate?: boolean }
  ): Root;

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }
}