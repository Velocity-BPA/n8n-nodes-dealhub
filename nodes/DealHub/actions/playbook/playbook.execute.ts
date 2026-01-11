/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, IDataObject, INodeExecutionData } from 'n8n-workflow';
import { dealHubApiRequest, dealHubApiRequestAllItems, cleanQuery } from '../../transport';
import { transformKeysToSnakeCase } from '../../utils';

export async function executePlaybookOperation(
  this: IExecuteFunctions,
  operation: string,
  i: number,
): Promise<INodeExecutionData[]> {
  let responseData: IDataObject | IDataObject[] = {};

  switch (operation) {
    case 'get': {
      const playbookId = this.getNodeParameter('playbookId', i) as string;
      responseData = await dealHubApiRequest.call(this, 'GET', `/playbooks/${playbookId}`);
      break;
    }

    case 'getAll': {
      const returnAll = this.getNodeParameter('returnAll', i) as boolean;
      const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
      const query = cleanQuery(transformKeysToSnakeCase(filters));

      if (returnAll) {
        responseData = await dealHubApiRequestAllItems.call(this, 'GET', '/playbooks', undefined, query);
      } else {
        const limit = this.getNodeParameter('limit', i) as number;
        query.limit = limit;
        const response = await dealHubApiRequest.call(this, 'GET', '/playbooks', undefined, query);
        responseData = response.data || [];
      }
      break;
    }

    case 'getQuestions': {
      const playbookId = this.getNodeParameter('playbookId', i) as string;
      const response = await dealHubApiRequest.call(this, 'GET', `/playbooks/${playbookId}/questions`);
      responseData = response.data || response;
      break;
    }

    case 'getAnswerOptions': {
      const playbookId = this.getNodeParameter('playbookId', i) as string;
      const questionId = this.getNodeParameter('questionId', i) as string;
      const response = await dealHubApiRequest.call(
        this,
        'GET',
        `/playbooks/${playbookId}/questions/${questionId}/options`,
      );
      responseData = response.data || response;
      break;
    }

    case 'simulate': {
      const playbookId = this.getNodeParameter('playbookId', i) as string;
      const answersData = this.getNodeParameter('answers', i, {}) as IDataObject;
      const answerValues = answersData.answerValues as IDataObject[];

      const answers: Array<{ question_id: string; answer_value: string | string[] }> = [];

      if (answerValues && answerValues.length > 0) {
        for (const answer of answerValues) {
          const answerValue = answer.answerValue as string;
          answers.push({
            question_id: answer.questionId as string,
            answer_value: answerValue.includes(',')
              ? answerValue.split(',').map((v) => v.trim())
              : answerValue,
          });
        }
      }

      responseData = await dealHubApiRequest.call(this, 'POST', `/playbooks/${playbookId}/simulate`, {
        answers,
      });
      break;
    }
  }

  const executionData = this.helpers.constructExecutionMetaData(
    this.helpers.returnJsonArray(responseData),
    { itemData: { item: i } },
  );

  return executionData;
}
