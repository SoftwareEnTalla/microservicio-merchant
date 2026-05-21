import { SetMetadata } from '@nestjs/common';

export interface FinancialActionFieldTrigger {
  field: string;
  values?: string[];
}

export interface FinancialActionMetadata {
  policyCode: string;
  actionType: string;
  targetType: string;
  requiredPermissions: string[];
  watchedFields?: FinancialActionFieldTrigger[];
}

export const FINANCIAL_ACTION_KEY = 'financial_action_metadata';

export function FinancialAction(metadata: FinancialActionMetadata): MethodDecorator {
  return SetMetadata(FINANCIAL_ACTION_KEY, metadata);
}