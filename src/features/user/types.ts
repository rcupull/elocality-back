import { BaseIdentity, PaymentPlanType } from "../../types";

export type UserRole = "user" | "admin";

export interface User extends BaseIdentity {
  name: string;
  email: string;
  password: string;
  passwordVerbose: string; // remove after migration
  role: UserRole;
  validated: boolean;
  generateAccessJWT: () => string;
  payment: {
    planHistory: [
      {
        planType: PaymentPlanType;
        dateOfPurchase: string;
        trialMode: boolean;
      }
    ];
  };
}
