import { Mapper } from 'src/app/core/mapper';
import { Expense, ExpenseEntity } from '@shared/models';

export class ExpensesMapper implements Mapper<ExpenseEntity, Expense> {
  mapToList(param: Expense[]): ExpenseEntity[] {
    const personEntities: ExpenseEntity[] = [];

    param.forEach((expense) => {
      personEntities.push({
        id: expense.id,
        title: expense.title,
        date: expense.date,
        cost: expense.cost,
        originalCost: expense.originalCost,
        paidBy: expense.paidBy,
        typeId: expense.typeId,
        sharedBy: expense.sharedBy,
        settleBy: expense.settleBy,
      });
    });

    return personEntities;
  }

  mapFromList(param: ExpenseEntity[]): Expense[] {
    const personModels: Expense[] = [];

    param.forEach((expenseEntity) => {
      personModels.push({
        id: expenseEntity.id,
        title: expenseEntity.title,
        date: expenseEntity.date,
        cost: expenseEntity.cost,
        originalCost: expenseEntity.originalCost,
        paidBy: expenseEntity.paidBy,
        typeId: expenseEntity.typeId,
        sharedBy: expenseEntity.sharedBy,
        settleBy: expenseEntity.settleBy,
      });
    });

    return personModels;
  }

  mapFrom(param: ExpenseEntity): Expense {
    return {
      id: param.id,
      title: param.title,
      date: param.date,
      cost: param.cost,
      originalCost: param.originalCost,
      paidBy: param.paidBy,
      typeId: param.typeId,
      sharedBy: param.sharedBy,
      settleBy: param.settleBy,
    };
  }

  mapTo(param: Expense): ExpenseEntity {
    return {
      id: param.id,
      title: param.title,
      date: param.date,
      cost: param.cost,
      originalCost: param.originalCost,
      paidBy: param.paidBy,
      typeId: param.typeId,
      sharedBy: param.sharedBy,
      settleBy: param.settleBy,
    };
  }
}
