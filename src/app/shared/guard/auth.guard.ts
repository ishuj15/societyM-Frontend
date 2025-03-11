import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../services/auth-services/auth.services";
import { Roles } from "../../components/signup/signup.component";

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
  
    if (authService.role$() === Roles.ADMIN){
      return true;
    }else{
      return router.navigate(['Home']).then(() => false);
    }
  };