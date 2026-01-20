import api from "./http";
import type { User } from "../models/User";
import {jwtDecode} from "jwt-decode";

// Tipo para el payload del JWT
type JwtPayload = {
  sub: string; // normalmente el username
  role?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
};

export class AuthService {
  // LOGIN
  static async login(name: string, password: string): Promise<User | null> {
    try {
      const response = await api.post("/auth/login", { name, password });
      const token: string = response.data.token;

      // Decodifica el JWT
      const decoded = jwtDecode<JwtPayload>(token);

      // Extrae el rol del token (puede estar en diferentes claims según tu backend)
      const role =
        decoded.role ??
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      const user: User = {
        id: 0, // si no lo envía el backend, puedes dejar 0 o extraerlo del JWT si existe
        name: decoded.sub, 
        email: "", // si tu backend no lo envía, deja vacío
        role: role ?? "user",
        token
      };

      console.log("Usuario guardado:", user);

      localStorage.setItem("session", JSON.stringify(user));
      return user;
    } catch (error: any) {
      console.error("Error en login:", error?.response?.data ?? error.message);
      return null;
    }
  }

  // REGISTER
  static async register(name: string, email: string, password: string): Promise<User | null> {
    try {
      await api.post("/auth/register", { name, email, password, role: "user" });

      // Login automático
      return await this.login(name, password);
    } catch (error: any) {
      console.error("Error al registrar:", error?.response?.data ?? error.message);
      return null;
    }
  }

  // GET CURRENT USER
  static getCurrentUser(): User | null {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }

  // LOGOUT
  static logout() {
    localStorage.removeItem("session");
  }
}
