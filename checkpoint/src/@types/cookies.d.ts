declare module "js-cookie" {
  export interface CookieOptions {
    expires?: number | Date | undefined;
    path?: string | undefined;
    domain?: string | undefined;
    secure?: boolean | undefined;
    sameSite?: "strict" | "lax" | "none" | undefined;
  }

  export function get(name: string): string | undefined;
  export function set(
    name: string,
    value: string,
    options?: CookieOptions
  ): void;
  export function remove(name: string, options?: CookieOptions): void;
}
