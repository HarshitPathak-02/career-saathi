import { AppError } from '../../core/errors/app-error.js';
import { HTTP_STATUS } from '../../core/constants/http-status.constants.js';

import { taskRepository } from '../task/task.repository.js';

import { ResourceResponse } from './resource.types.js';

import { toResourceResponse } from './resource.mapper.js';

class ResourceService {

    async getTaskResources(
        taskId: string
    ): Promise<ResourceResponse[]> {

        const task =
            await taskRepository.findById(
                taskId
            );

        if (!task) {

            throw new AppError(
                HTTP_STATUS.NOT_FOUND,
                'Task not found.'
            );
        }

        return task.resources.map(
            toResourceResponse
        );
    }
}

export const resourceService =
    new ResourceService();