import * as veteranInfo from './veteran/veteranInfo';
import contactInformation from './veteran/contactInformation';
import * as combinedDebts from './veteran/combinedDebts';
import * as benefits from './income/benefits';
import * as additionalIncomeValues from './income/additionalIncome/additionalIncomeValues';
import * as spouseInformation from './income/spouse/spouseInfo';
import * as spouseName from './income/spouse/spouseName';
import * as spouseBenefits from './income/spouse/benefits';
import * as spouseBenefitRecords from './income/spouse/benefits/records';
import * as spouseEmploymentQuestion from './income/spouse/employment/employmentQuestion';
import * as spouseEmploymentHistory from './income/employmentEnhanced/spouseEmploymentHistory';
import * as spouseGrossMonthlyIncome from './income/employmentEnhanced/spouseGrossMonthlyIncome';
import * as spousePayrollDeductionChecklist from './income/employmentEnhanced/spousePayrollDeductionChecklist';
import * as spousePayrollDeductionInputList from './income/employmentEnhanced/spousePayrollDeductionInputList';
import * as spouseAdditionalIncomeValues from './income/spouse/additionalIncome/enhancedRecords';
import * as dependents from './income/dependents';
import * as dependentRecords from './income/dependents/records';
import * as monetaryValues from './assets/monetary/monetaryValues';
import * as enhancedRealEstate from './assets/realEstate/enhancedIndex';
import * as enhancedRealEstateRecords from './assets/realEstate/enhancedRecords';
import * as recreationalVehicles from './assets/recreationalVehicles';
import * as recreationalVehicleRecords from './assets/recreationalVehicles/records';
import * as vehicles from './assets/vehicles';
import * as otherAssetPages from './assets/other/otherAssetsEnhanced';
import * as expenses from './expenses/household';
import * as utilityBillPages from './expenses/utilities/utilityBillsEnhanced';
import * as otherExpensesPages from './expenses/other/otherExpensesPages';
import * as resolutionOption from './resolution/resolutionOption';
import * as resolutionComment from './resolution/resolutionComment';
import * as resolutionWaiverAgreement from './resolution/resolutionWaiverAgreement';
import * as bankruptcyHistory from './bankruptcy';
import * as enhancedBankruptcyHistoryRecords from './bankruptcy/enhancedRecords';
import * as addIssue from './income/employmentEnhanced/addIssue';
import * as employmentHistory from './income/employmentEnhanced/employmentHistory';
import * as payrollDeductionChecklist from './income/employmentEnhanced/payrollDeductionChecklist';
import * as payrollDeductionInputList from './income/employmentEnhanced/payrollDeductionInputList';
import * as grossMonthlyIncome from './income/employmentEnhanced/grossMonthlyIncome';
import * as enhancedEmploymentRecords from './income/employmentEnhanced/enhancedRecords';
import * as householdExpensesChecklist from './expenses/householdExpensesChecklist';
import * as householdExpensesInputList from './expenses/householdExpensesValues';
import * as creditCardBills from './expenses/creditCardBills';
import * as installmentContracts from './expenses/repayments/installmentContracts';

export {
  veteranInfo,
  combinedDebts,
  benefits,
  spouseName,
  additionalIncomeValues,
  spouseInformation,
  spouseBenefits,
  spouseBenefitRecords,
  spouseEmploymentQuestion,
  spouseEmploymentHistory,
  spouseGrossMonthlyIncome,
  spousePayrollDeductionChecklist,
  spousePayrollDeductionInputList,
  spouseAdditionalIncomeValues,
  dependents,
  dependentRecords,
  monetaryValues,
  enhancedRealEstate,
  enhancedRealEstateRecords,
  recreationalVehicles,
  recreationalVehicleRecords,
  vehicles,
  otherAssetPages,
  expenses,
  utilityBillPages,
  otherExpensesPages,
  resolutionOption,
  resolutionComment,
  resolutionWaiverAgreement,
  bankruptcyHistory,
  contactInformation,
  addIssue,
  employmentHistory,
  payrollDeductionChecklist,
  payrollDeductionInputList,
  grossMonthlyIncome,
  enhancedEmploymentRecords,
  householdExpensesChecklist,
  householdExpensesInputList,
  enhancedBankruptcyHistoryRecords,
  creditCardBills,
  installmentContracts,
};
