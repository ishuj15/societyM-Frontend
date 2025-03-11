import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../../services/auth-services/auth.services";

export const LoginGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const authService: AuthService = inject(AuthService);

    if (hasValidToken()) {
      return true;
    } else {
      authService.loggedIn$.set(false);
      authService.user$.set(null);

      return router.navigate(['landing']).then(() => false);
    }
  };

  function hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      return false;
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Check if the token has expired
      return decodedToken.exp > currentTime;
    } catch (error) {
      // In case of any error (invalid token format, decoding issues), treat it as invalid
      return false;
    }
  }